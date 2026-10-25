import {
    Component,
    ElementRef,
    OnChanges,
    SimpleChanges,
    booleanAttribute,
    computed,
    input,
    viewChildren,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MagmaInputCommon } from './input-common';

let counter = 0;

// ── Internal types ────────────────────────────────────────────────────────────

interface SegmentedSlot {
    index: number; // index within the flat cells[] array
    type: 'numeric' | 'alpha' | 'alphanumeric' | 'password';
    separator?: never;
}

interface SegmentedSeparator {
    index: -1;
    separator: string;
    type?: never;
}

type SegmentedEntry = SegmentedSlot | SegmentedSeparator;

/**
 * A group of consecutive slots between two separators (or at the edges).
 * In `grouped`/`unified` modes a single `<input>` is rendered per group.
 */
interface SegmentedGroup {
    /** Sequential group number (0-based). */
    index: number;
    /** Slot indices that belong to this group. */
    slotIndices: number[];
    /** Character type for every slot in the group (same for the whole group). */
    type: SegmentedSlot['type'];
    /** Max characters accepted by the group input. */
    maxlength: number;
    /** Whether this is a separator entry — always false for groups. */
    separator?: never;
}

type GroupEntry = SegmentedGroup | SegmentedSeparator;

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Segmented input where the structure is driven by a **pattern string**.
 *
 * Pattern characters:
 * | Char      | Accepted input     |
 * |-----------|-------------------|
 * | `0`       | digit (0–9)       |
 * | `x` / `X` | alphanumeric      |
 * | `a` / `A` | letter only       |
 * | `*`       | digit, masked (•) |
 * | any other | visual separator  |
 *
 * **Modes:**
 * - `separate` (default) — one `<input>` per character, individual borders
 * - `grouped`  — one `<input>` per group (accepts full group length), fused within groups
 * - `unified`  — one `<input>` per group, everything fused into one continuous block
 *
 * @example
 * ```html
 * <mg-input-segmented pattern="000000" />
 * <mg-input-segmented pattern="0000-0000-0000-0000" mode="grouped" />
 * <mg-input-segmented pattern="0000-0000-0000-0000" mode="unified" />
 * ```
 */
@Component({
    selector: 'mg-input-segmented',
    templateUrl: './input-segmented.component.html',
    styleUrl: './input-segmented.component.scss',
    providers: [
        { provide: MagmaInputCommon, useExisting: MagmaInputSegmented },
        { provide: NG_VALUE_ACCESSOR, useExisting: MagmaInputSegmented, multi: true },
        { provide: NG_VALIDATORS, useExisting: MagmaInputSegmented, multi: true },
    ],
    host: {
        '[id]': '_id()',
        '[attr.data-pattern]': 'pattern()',
        '[class.mode-separate]': 'mode() === "separate"',
        '[class.mode-grouped]': 'mode() === "grouped"',
        '[class.mode-unified]': 'mode() === "unified"',
    },
})
export class MagmaInputSegmented extends MagmaInputCommon<string> implements OnChanges {
    override readonly componentName = 'input-segmented';
    protected override counter = counter++;

    /** Pattern string defining the structure (e.g. `"0000-0000"`, `"000000"`). */
    readonly pattern = input('000000');

    /**
     * Visual layout mode:
     * - `separate` (default) — one cell per character
     * - `grouped`  — cells within a group fused into one input, groups separated
     * - `unified`  — all groups fused into one continuous block
     */
    readonly mode = input<'separate' | 'grouped' | 'unified'>('separate');

    /**
     * When true and the pattern contains only numeric slots, SMS autofill
     * (`autocomplete="one-time-code"`) is enabled on the first input.
     * Defaults to false — opt in explicitly for OTP use cases.
     */
    readonly autocomplete = input(false, { transform: booleanAttribute });

    // ── Refs ──────────────────────────────────────────────────────────────────

    readonly cellInputs = viewChildren<ElementRef<HTMLInputElement>>('cell');

    // ── Parsed state ──────────────────────────────────────────────────────────

    /** Flat list of slots + separators (used in `separate` mode). */
    entries = computed<SegmentedEntry[]>(() => this._parsePattern(this.pattern()));

    /** Grouped list (used in `grouped`/`unified` modes). */
    groupEntries = computed<GroupEntry[]>(() => this._buildGroupEntries(this.entries()));

    /** Total number of character slots. */
    slotCount = computed<number>(() => this.entries().filter(e => !e.separator).length);

    /** Per-slot character values (indexed by slot index). */
    cells: string[] = [];

    /** Per-group string values (indexed by groupIndex). */
    groupValues: string[] = [];

    /** Whether the whole pattern is numeric-only (for SMS autocomplete). */
    isNumericOnly = computed<boolean>(() =>
        this.entries()
            .filter((e): e is SegmentedSlot => !e.separator)
            .every(e => e.type === 'numeric' || e.type === 'password'),
    );

    /** True when operating in a fused mode. */
    isFused = computed<boolean>(() => this.mode() === 'grouped' || this.mode() === 'unified');

    // ── Position map for separate-mode CSS ───────────────────────────────────

    groupPositions = computed<Map<number, string>>(() => {
        const map = new Map<number, string>();
        const groups: number[][] = [];
        let current: number[] = [];

        for (const e of this.entries()) {
            if (e.separator !== undefined) {
                if (current.length) {
                    groups.push(current);
                    current = [];
                }
            } else {
                current.push(e.index);
            }
        }
        if (current.length) groups.push(current);

        for (const group of groups) {
            if (group.length === 1) {
                map.set(group[0], 'only');
            } else {
                group.forEach((idx, i) => {
                    if (i === 0) map.set(idx, 'first');
                    else if (i === group.length - 1) map.set(idx, 'last');
                    else map.set(idx, 'middle');
                });
            }
        }
        return map;
    });

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    override ngOnInit(): void {
        super.ngOnInit();
        this._resizeCells();
    }

    override ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        if (changes['pattern'] || changes['mode']) {
            this._resizeCells();
        }
    }

    // ── ControlValueAccessor ──────────────────────────────────────────────────

    override writeValue(value: string): void {
        super.writeValue(value ?? '');
        this._distributeValue(value ?? '');
    }

    // ── Template helpers ──────────────────────────────────────────────────────

    // ·· Separate mode ·······················································

    onCellInput(event: Event, slotIndex: number): void {
        const input = event.target as HTMLInputElement;
        const char = input.value.slice(-1);
        const slot = this._slotAt(slotIndex);

        if (char && slot && this._charAllowed(char, slot.type)) {
            this.cells[slotIndex] = char;
            input.value = char;
            this._focusCellNext(slotIndex);
        } else {
            input.value = this.cells[slotIndex] ?? '';
        }
        this._emitFromCells();
    }

    onCellKeydown(event: KeyboardEvent, slotIndex: number): void {
        const input = event.target as HTMLInputElement;
        switch (event.key) {
            case 'Backspace':
                event.preventDefault();
                if (this.cells[slotIndex]) {
                    this.cells[slotIndex] = '';
                    input.value = '';
                    this._emitFromCells();
                } else {
                    this._focusCellPrev(slotIndex);
                }
                break;
            case 'Delete':
                event.preventDefault();
                this.cells[slotIndex] = '';
                input.value = '';
                this._emitFromCells();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this._focusCellPrev(slotIndex);
                break;
            case 'ArrowRight':
                event.preventDefault();
                this._focusCellNext(slotIndex);
                break;
            case 'Home':
                event.preventDefault();
                this._focusCell(0);
                break;
            case 'End':
                event.preventDefault();
                this._focusCell(this.slotCount() - 1);
                break;
        }
    }

    onCellPaste(event: ClipboardEvent, slotIndex: number): void {
        event.preventDefault();
        const stripped = (event.clipboardData?.getData('text') ?? '').replace(/[^a-zA-Z0-9]/g, '');
        const slots = this._inputSlots();
        let ci = 0;
        for (let i = slotIndex; i < slots.length && ci < stripped.length; i++) {
            const char = stripped[ci];
            if (this._charAllowed(char, slots[i].type)) {
                this.cells[i] = char;
                ci++;
            }
        }
        this._syncCellsDom();
        this._emitFromCells();
        const firstEmpty = this.cells.findIndex((c, i) => i >= slotIndex && !c);
        this._focusCell(firstEmpty === -1 ? this.slotCount() - 1 : firstEmpty);
    }

    // ·· Grouped / unified mode ··············································

    onGroupInput(event: Event, groupIndex: number): void {
        const input = event.target as HTMLInputElement;
        const groups = this._groups();
        const group = groups[groupIndex];
        if (!group) return;

        // Filter out non-allowed chars, keep cursor position
        const raw = input.value;
        const selStart = input.selectionStart ?? raw.length;
        const filtered = raw
            .split('')
            .filter(c => this._charAllowed(c, group.type))
            .slice(0, group.maxlength)
            .join('');

        // Only rewrite if filtering actually changed something
        if (filtered !== raw) {
            input.value = filtered;
            // Restore cursor position (clamped to new length)
            const pos = Math.min(selStart, filtered.length);
            input.setSelectionRange(pos, pos);
        }

        // Write back to cells
        group.slotIndices.forEach((slotIdx, i) => {
            this.cells[slotIdx] = filtered[i] ?? '';
        });

        // Auto-advance only when group is full and cursor is at the end
        if (filtered.length >= group.maxlength && (input.selectionStart ?? 0) >= group.maxlength) {
            this._focusGroupNext(groupIndex);
        }

        this._syncGroupValues();
        this._emitFromCells();
    }

    onGroupKeydown(event: KeyboardEvent, groupIndex: number): void {
        const input = event.target as HTMLInputElement;
        const groups = this._groups();

        switch (event.key) {
            case 'Backspace':
                // Move to previous group only when the field is already empty
                if (!input.value) {
                    event.preventDefault();
                    this._focusGroupPrev(groupIndex, 'end');
                }
                break;

            case 'ArrowLeft':
                // Move to previous group when cursor is at position 0
                if ((input.selectionStart ?? 0) === 0 && (input.selectionEnd ?? 0) === 0) {
                    event.preventDefault();
                    this._focusGroupPrev(groupIndex, 'end');
                }
                break;

            case 'ArrowRight': {
                // Move to next group when cursor is at end of current value
                const len = input.value.length;
                if ((input.selectionStart ?? len) === len && (input.selectionEnd ?? len) === len) {
                    event.preventDefault();
                    this._focusGroupNext(groupIndex, 'start');
                }
                break;
            }

            case 'Home':
                // Jump to first group only when already at position 0
                if ((input.selectionStart ?? 0) === 0) {
                    event.preventDefault();
                    this._focusGroupAt(0, 'start');
                }
                break;

            case 'End':
                // Jump to last group only when already at end
                if ((input.selectionStart ?? input.value.length) === input.value.length) {
                    event.preventDefault();
                    this._focusGroupAt(groups.length - 1, 'end');
                }
                break;
        }
    }

    onGroupPaste(event: ClipboardEvent, groupIndex: number): void {
        event.preventDefault();
        const stripped = (event.clipboardData?.getData('text') ?? '').replace(/[^a-zA-Z0-9]/g, '');
        const groups = this._groups();
        let charIdx = 0;

        for (let gi = groupIndex; gi < groups.length && charIdx < stripped.length; gi++) {
            const group = groups[gi];
            const allowed = stripped
                .slice(charIdx)
                .split('')
                .filter(c => this._charAllowed(c, group.type))
                .slice(0, group.maxlength)
                .join('');

            group.slotIndices.forEach((slotIdx, i) => {
                this.cells[slotIdx] = allowed[i] ?? '';
            });
            charIdx += allowed.length;
        }

        this._syncGroupValues();
        this._syncGroupDom();
        this._emitFromCells();
    }

    // ·· Shared ··············································

    onCellFocus(event: FocusEvent): void {
        // In separate mode: select the single char on focus for easy overwrite.
        // In fused mode: do NOT select-all — the user may be clicking mid-word.
        if (!this.isFused()) {
            const input = event.target as HTMLInputElement;
            setTimeout(() => input.select());
        }
    }

    inputModeFor(type: SegmentedSlot['type']): string {
        return type === 'numeric' || type === 'password' ? 'numeric' : 'text';
    }

    inputTypeFor(type: SegmentedSlot['type']): string {
        return type === 'password' ? 'password' : 'text';
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private _parsePattern(pattern: string): SegmentedEntry[] {
        const entries: SegmentedEntry[] = [];
        let slotIdx = 0;
        for (const ch of pattern) {
            switch (ch) {
                case '0':
                    entries.push({ index: slotIdx++, type: 'numeric' });
                    break;
                case '*':
                    entries.push({ index: slotIdx++, type: 'password' });
                    break;
                case 'a':
                case 'A':
                    entries.push({ index: slotIdx++, type: 'alpha' });
                    break;
                case 'x':
                case 'X':
                    entries.push({ index: slotIdx++, type: 'alphanumeric' });
                    break;
                default:
                    entries.push({ index: -1, separator: ch });
            }
        }
        return entries;
    }

    private _buildGroupEntries(entries: SegmentedEntry[]): GroupEntry[] {
        const result: GroupEntry[] = [];
        let index = 0;
        let currentSlots: SegmentedSlot[] = [];

        const flush = () => {
            if (!currentSlots.length) return;
            result.push({
                index: index++,
                slotIndices: currentSlots.map(s => s.index),
                type: currentSlots[0].type,
                maxlength: currentSlots.length,
            });
            currentSlots = [];
        };

        for (const e of entries) {
            if (e.separator !== undefined) {
                flush();
                result.push({ index: -1, separator: e.separator });
            } else {
                currentSlots.push(e as SegmentedSlot);
            }
        }
        flush();
        return result;
    }

    private _groups(): SegmentedGroup[] {
        return this.groupEntries().filter((e): e is SegmentedGroup => e.separator === undefined);
    }

    private _resizeCells(): void {
        const count = this.slotCount();
        if (this.cells.length < count) {
            this.cells.push(...Array(count - this.cells.length).fill(''));
        } else {
            this.cells.splice(count);
        }
        this._syncGroupValues();
    }

    private _syncGroupValues(): void {
        const groups = this._groups();
        this.groupValues = groups.map(g => g.slotIndices.map(i => this.cells[i] ?? '').join(''));
    }

    private _inputSlots(): SegmentedSlot[] {
        return this.entries().filter((e): e is SegmentedSlot => !e.separator);
    }

    private _slotAt(index: number): SegmentedSlot | undefined {
        return this._inputSlots()[index];
    }

    private _charAllowed(char: string, type: SegmentedSlot['type']): boolean {
        switch (type) {
            case 'numeric':
            case 'password':
                return /^\d$/.test(char);
            case 'alpha':
                return /^[a-zA-Z]$/.test(char);
            case 'alphanumeric':
                return /^[a-zA-Z0-9]$/.test(char);
        }
    }

    // ·· Cell focus (separate mode) ··········································

    private _focusCell(index: number): void {
        const clamped = Math.max(0, Math.min(index, this.slotCount() - 1));
        this.cellInputs()[clamped]?.nativeElement.focus();
    }

    private _focusCellNext(from: number): void {
        if (from < this.slotCount() - 1) this._focusCell(from + 1);
    }

    private _focusCellPrev(from: number): void {
        if (from > 0) this._focusCell(from - 1);
    }

    // ·· Group focus (grouped/unified mode) ··································

    private _focusGroupAt(groupIndex: number, position: 'start' | 'end' = 'start'): void {
        const clamped = Math.max(0, Math.min(groupIndex, this._groups().length - 1));
        const el = this.cellInputs()[clamped]?.nativeElement;
        if (!el) return;
        el.focus();
        // Place cursor at start or end after focus
        setTimeout(() => {
            if (position === 'end') {
                el.setSelectionRange(el.value.length, el.value.length);
            } else {
                el.setSelectionRange(0, 0);
            }
        });
    }

    private _focusGroupNext(from: number, position: 'start' | 'end' = 'start'): void {
        if (from < this._groups().length - 1) this._focusGroupAt(from + 1, position);
    }

    private _focusGroupPrev(from: number, position: 'start' | 'end' = 'end'): void {
        if (from > 0) this._focusGroupAt(from - 1, position);
    }

    // ·· DOM sync ····························································

    private _syncCellsDom(): void {
        const refs = this.cellInputs();
        this.cells.forEach((char, i) => {
            if (refs[i]) refs[i].nativeElement.value = char;
        });
    }

    private _syncGroupDom(): void {
        const refs = this.cellInputs();
        this._groups().forEach((group, gi) => {
            if (refs[gi]) {
                refs[gi].nativeElement.value = group.slotIndices.map(i => this.cells[i] ?? '').join('');
            }
        });
    }

    // ·· Value distribution ·················································

    private _distributeValue(value: string): void {
        this._resizeCells();
        const slots = this._inputSlots();
        const chars = (value ?? '').split('');
        let ci = 0;
        for (let i = 0; i < slots.length; i++) {
            const char = chars[ci];
            if (char !== undefined && this._charAllowed(char, slots[i].type)) {
                this.cells[i] = char;
                ci++;
            } else {
                this.cells[i] = '';
            }
        }
        this._syncGroupValues();
        if (this.isFused()) {
            this._syncGroupDom();
        } else {
            this._syncCellsDom();
        }
    }

    private _emitFromCells(): void {
        const value = this.cells.join('');
        this._value = value;
        this.onChange(value);
        this.valueChange.emit(value);
        this.update.emit(value);
    }
}
