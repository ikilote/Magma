import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { MagmaInputSegmented } from './input-segmented.component';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getCell(debugEl: DebugElement, index = 0): HTMLInputElement {
    return debugEl.queryAll(By.css('input.segmented-cell'))[index]?.nativeElement;
}

function getCells(debugEl: DebugElement): HTMLInputElement[] {
    return debugEl.queryAll(By.css('input.segmented-cell')).map(d => d.nativeElement);
}

function dispatchInput(el: HTMLInputElement): void {
    el.dispatchEvent(new Event('input', { bubbles: true }));
}

function dispatchKey(el: HTMLInputElement, key: string, extra: KeyboardEventInit = {}): KeyboardEvent {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, ...extra });
    el.dispatchEvent(event);
    return event;
}

function makePasteEvent(text: string): { clipboardData: { getData: () => string }; preventDefault: () => void } {
    return {
        clipboardData: { getData: () => text },
        preventDefault: vi.fn(),
    };
}

// ── Setup helper ──────────────────────────────────────────────────────────────

async function createFixture(pattern = '000000', mode = 'separate') {
    await TestBed.configureTestingModule({
        imports: [MagmaInputSegmented],
        providers: [
            { provide: NG_VALUE_ACCESSOR, useExisting: MagmaInputSegmented, multi: true },
            { provide: NG_VALIDATORS, useExisting: MagmaInputSegmented, multi: true },
        ],
    }).compileComponents();

    const fixture = TestBed.createComponent(MagmaInputSegmented);
    const component = fixture.componentInstance;
    const debugElement = fixture.debugElement;

    fixture.componentRef.setInput('pattern', pattern);
    fixture.componentRef.setInput('mode', mode);
    fixture.changeDetectorRef.detectChanges();

    return { fixture, component, debugElement };
}

// ─────────────────────────────────────────────────────────────────────────────

describe('MagmaInputSegmented', () => {
    let component: MagmaInputSegmented;
    let fixture: ComponentFixture<MagmaInputSegmented>;
    let debugElement: DebugElement;

    beforeEach(async () => {
        ({ fixture, component, debugElement } = await createFixture());
    });

    afterEach(() => {
        fixture?.destroy();
        vi.clearAllTimers();
        vi.useRealTimers();
        TestBed.resetTestingModule();
    });

    // ── Creation ─────────────────────────────────────────────────────────────

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display Error if onError is true', () => {
        component['onError'].set(true);
        fixture.changeDetectorRef.detectChanges();
        expect(fixture.debugElement.nativeElement.textContent).toContain('Error');
    });

    // ── Input properties ──────────────────────────────────────────────────────

    describe('Input properties', () => {
        it('should have default pattern "000000"', () => {
            expect(component.pattern()).toBe('000000');
        });

        it('should set pattern correctly', () => {
            fixture.componentRef.setInput('pattern', '0000-0000');
            expect(component.pattern()).toBe('0000-0000');
        });

        it('should set mode correctly', () => {
            fixture.componentRef.setInput('mode', 'grouped');
            expect(component.mode()).toBe('grouped');
        });

        it('should set autocomplete correctly', () => {
            fixture.componentRef.setInput('autocomplete', true);
            expect(component.autocomplete()).toBe(true);
        });

        it('should set disabled correctly', () => {
            fixture.componentRef.setInput('disabled', true);
            expect(component.disabled()).toBe(true);
        });

        it('should set readonly correctly', () => {
            fixture.componentRef.setInput('readonly', true);
            expect(component.readonly()).toBe(true);
        });
    });

    // ── Pattern parsing ───────────────────────────────────────────────────────

    describe('Pattern parsing', () => {
        it('should compute 6 slots for "000000"', () => {
            expect(component.slotCount()).toBe(6);
        });

        it('should compute 8 slots for "0000-0000"', () => {
            fixture.componentRef.setInput('pattern', '0000-0000');
            expect(component.slotCount()).toBe(8);
        });

        it('should parse all numeric slot types', () => {
            fixture.componentRef.setInput('pattern', '0000');
            const slots = component.entries().filter(e => !e.separator);
            expect(slots.length).toBe(4);
            expect(slots.every(e => e.type === 'numeric')).toBe(true);
        });

        it('should parse password slots (*)', () => {
            fixture.componentRef.setInput('pattern', '****');
            const slots = component.entries().filter(e => !e.separator);
            expect(slots.every(e => e.type === 'password')).toBe(true);
        });

        it('should parse alpha slots (a)', () => {
            fixture.componentRef.setInput('pattern', 'aaaa');
            const slots = component.entries().filter(e => !e.separator);
            expect(slots.every(e => e.type === 'alpha')).toBe(true);
        });

        it('should parse alpha slots (A)', () => {
            fixture.componentRef.setInput('pattern', 'AAAA');
            const slots = component.entries().filter(e => !e.separator);
            expect(slots.every(e => e.type === 'alpha')).toBe(true);
        });

        it('should parse alphanumeric slots (x)', () => {
            fixture.componentRef.setInput('pattern', 'xxxx');
            const slots = component.entries().filter(e => !e.separator);
            expect(slots.every(e => e.type === 'alphanumeric')).toBe(true);
        });

        it('should parse alphanumeric slots (X)', () => {
            fixture.componentRef.setInput('pattern', 'XXXX');
            const slots = component.entries().filter(e => !e.separator);
            expect(slots.every(e => e.type === 'alphanumeric')).toBe(true);
        });

        it('should parse separator characters', () => {
            fixture.componentRef.setInput('pattern', '00-00');
            const seps = component.entries().filter(e => e.separator !== undefined);
            expect(seps.length).toBe(1);
            expect(seps[0].separator).toBe('-');
        });

        it('should treat backslash-escaped char as literal separator', () => {
            // '\\0' in TS string = the two chars \ and 0 passed to the component
            fixture.componentRef.setInput('pattern', '\\0');
            const entries = component.entries();
            expect(entries.length).toBe(1);
            expect(entries[0].separator).toBe('0');
        });

        it('should allow escaping reserved slot chars as separators', () => {
            // pattern: 00\x00 → slot, slot, literal 'x' separator, slot, slot
            fixture.componentRef.setInput('pattern', '00\\x00');
            const slots = component.entries().filter(e => !e.separator);
            const seps = component.entries().filter(e => e.separator !== undefined);
            expect(slots.length).toBe(4);
            expect(seps.length).toBe(1);
            expect(seps[0].separator).toBe('x');
        });

        it('should treat trailing backslash as regular separator', () => {
            // A lone trailing \ has no next char → treated as a separator itself
            fixture.componentRef.setInput('pattern', '00\\');
            const entries = component.entries();
            const seps = entries.filter(e => e.separator !== undefined);
            // The \ at the end is a lone escape with no following char — treated as separator
            expect(seps.length).toBe(1);
            expect(seps[0].separator).toBe('\\');
        });

        it('should split into separate groups when slot types differ without separator', () => {
            // 'a0' → alpha then numeric: _buildGroupEntries flushes on type change → 2 groups
            fixture.componentRef.setInput('pattern', 'a0');
            fixture.componentRef.setInput('mode', 'grouped');
            fixture.changeDetectorRef.detectChanges();
            const groups = component['_groups']();
            expect(groups.length).toBe(2);
            expect(groups[0].type).toBe('alpha');
            expect(groups[1].type).toBe('numeric');
        });

        it('should keep same-type consecutive slots in one group without separator', () => {
            // 'aaa' → all alpha, single group
            fixture.componentRef.setInput('pattern', 'aaa');
            fixture.componentRef.setInput('mode', 'grouped');
            fixture.changeDetectorRef.detectChanges();
            expect(component['_groups']().length).toBe(1);
            expect(component['_groups']()[0].maxlength).toBe(3);
        });

        it('should detect numeric-only pattern', () => {
            expect(component.isNumericOnly()).toBe(true);
        });

        it('should detect password as numeric-only (masked)', () => {
            fixture.componentRef.setInput('pattern', '****');
            expect(component.isNumericOnly()).toBe(true);
        });

        it('should detect non-numeric pattern (alpha)', () => {
            fixture.componentRef.setInput('pattern', 'AAAA');
            expect(component.isNumericOnly()).toBe(false);
        });

        it('should detect non-numeric pattern (alphanumeric)', () => {
            fixture.componentRef.setInput('pattern', 'XXXX');
            expect(component.isNumericOnly()).toBe(false);
        });

        it('should compute isFused false for separate mode', () => {
            expect(component.isFused()).toBe(false);
        });

        it('should compute isFused true for grouped mode', () => {
            fixture.componentRef.setInput('mode', 'grouped');
            expect(component.isFused()).toBe(true);
        });

        it('should compute isFused true for unified mode', () => {
            fixture.componentRef.setInput('mode', 'unified');
            expect(component.isFused()).toBe(true);
        });

        describe('groupPositions', () => {
            it('should mark single group without separator as "only"', () => {
                fixture.componentRef.setInput('pattern', '0');
                const pos = component.groupPositions();
                expect(pos.get(0)).toBe('only');
            });

            it('should mark first/last positions in a group', () => {
                fixture.componentRef.setInput('pattern', '000');
                const pos = component.groupPositions();
                expect(pos.get(0)).toBe('first');
                expect(pos.get(1)).toBe('middle');
                expect(pos.get(2)).toBe('last');
            });

            it('should mark "only" for single-cell groups separated', () => {
                fixture.componentRef.setInput('pattern', '0-0');
                const pos = component.groupPositions();
                expect(pos.get(0)).toBe('only');
                expect(pos.get(1)).toBe('only');
            });
        });
    });

    // ── _charAllowed ──────────────────────────────────────────────────────────

    describe('_charAllowed', () => {
        it('should allow digit in numeric', () => {
            expect(component['_charAllowed']('5', 'numeric')).toBe(true);
        });

        it('should reject letter in numeric', () => {
            expect(component['_charAllowed']('a', 'numeric')).toBe(false);
        });

        it('should allow digit in password', () => {
            expect(component['_charAllowed']('3', 'password')).toBe(true);
        });

        it('should reject letter in password', () => {
            expect(component['_charAllowed']('b', 'password')).toBe(false);
        });

        it('should allow letter in alpha', () => {
            expect(component['_charAllowed']('A', 'alpha')).toBe(true);
        });

        it('should allow lowercase letter in alpha', () => {
            expect(component['_charAllowed']('z', 'alpha')).toBe(true);
        });

        it('should reject digit in alpha', () => {
            expect(component['_charAllowed']('3', 'alpha')).toBe(false);
        });

        it('should allow letter in alphanumeric', () => {
            expect(component['_charAllowed']('B', 'alphanumeric')).toBe(true);
        });

        it('should allow digit in alphanumeric', () => {
            expect(component['_charAllowed']('7', 'alphanumeric')).toBe(true);
        });

        it('should reject special char in alphanumeric', () => {
            expect(component['_charAllowed']('!', 'alphanumeric')).toBe(false);
        });
    });

    // ── writeValue ────────────────────────────────────────────────────────────

    describe('writeValue', () => {
        it('should distribute value across cells', () => {
            component.writeValue('123456');
            expect(component.cells).toEqual(['1', '2', '3', '4', '5', '6']);
        });

        it('should stop at first invalid char (non-advancing write)', () => {
            component.writeValue('1a2b3c');
            // 'a' is invalid for numeric: charIdx does not advance past it,
            // so subsequent slots also get 'a' and are rejected too.
            expect(component.cells[0]).toBe('1');
            expect(component.cells[1]).toBe('');
        });

        it('should pad with empty strings if value is shorter', () => {
            component.writeValue('12');
            expect(component.cells).toEqual(['1', '2', '', '', '', '']);
        });

        it('should handle writeValue with separator pattern', () => {
            fixture.componentRef.setInput('pattern', '0000-0000');
            fixture.changeDetectorRef.detectChanges();
            component.writeValue('12345678');
            expect(component.cells.join('')).toBe('12345678');
        });

        it('should handle writeValue with empty string', () => {
            component.writeValue('123456');
            component.writeValue('');
            expect(component.cells.every(c => c === '')).toBe(true);
        });

        it('should handle writeValue with undefined', () => {
            component.writeValue(undefined as any);
            expect(component.cells.every(c => c === '')).toBe(true);
        });

        it('should handle writeValue with null', () => {
            component.writeValue(null as any);
            expect(component.cells.every(c => c === '')).toBe(true);
        });
    });

    // ── Separate mode — DOM rendering ─────────────────────────────────────────

    describe('separate mode — DOM rendering', () => {
        it('should render 6 cell inputs for default pattern', () => {
            expect(getCells(debugElement).length).toBe(6);
        });

        it('should render 8 cell inputs for "0000-0000"', () => {
            fixture.componentRef.setInput('pattern', '0000-0000');
            fixture.changeDetectorRef.detectChanges();
            expect(getCells(debugElement).length).toBe(8);
        });

        it('should render separators for "0000-0000"', () => {
            fixture.componentRef.setInput('pattern', '0000-0000');
            fixture.changeDetectorRef.detectChanges();
            const seps = debugElement.queryAll(By.css('.segmented-separator'));
            expect(seps.length).toBe(1);
            expect(seps[0].nativeElement.textContent).toBe('-');
        });

        it('should render multiple separators', () => {
            fixture.componentRef.setInput('pattern', '00/00/0000');
            fixture.changeDetectorRef.detectChanges();
            const seps = debugElement.queryAll(By.css('.segmented-separator'));
            expect(seps.length).toBe(2);
        });

        it('should render password inputs for * slots', () => {
            fixture.componentRef.setInput('pattern', '****');
            fixture.changeDetectorRef.detectChanges();
            const cells = getCells(debugElement);
            expect(cells.every(c => c.type === 'password')).toBe(true);
        });

        it('should render text inputs for 0 slots', () => {
            const cells = getCells(debugElement);
            expect(cells.every(c => c.type === 'text')).toBe(true);
        });

        it('should set data-pos "first" on first cell of a multi-cell group', () => {
            fixture.componentRef.setInput('pattern', '000');
            fixture.changeDetectorRef.detectChanges();
            expect(getCells(debugElement)[0].getAttribute('data-pos')).toBe('first');
        });

        it('should set data-pos "last" on last cell of a multi-cell group', () => {
            fixture.componentRef.setInput('pattern', '000');
            fixture.changeDetectorRef.detectChanges();
            const cells = getCells(debugElement);
            expect(cells[2].getAttribute('data-pos')).toBe('last');
        });

        it('should set data-pos "only" for single-cell groups', () => {
            fixture.componentRef.setInput('pattern', '0-0');
            fixture.changeDetectorRef.detectChanges();
            expect(getCells(debugElement)[0].getAttribute('data-pos')).toBe('only');
        });

        it('should apply host class mode-separate', () => {
            expect(fixture.debugElement.nativeElement.classList).toContain('mode-separate');
        });

        it('should not show SMS autofill hidden input by default', () => {
            const hidden = debugElement.query(By.css('.segmented-hidden'));
            expect(hidden).toBeNull();
        });

        it('should show SMS autofill hidden input when autocomplete is true', () => {
            fixture.componentRef.setInput('autocomplete', true);
            fixture.changeDetectorRef.detectChanges();
            const hidden = debugElement.query(By.css('.segmented-hidden'));
            expect(hidden).toBeTruthy();
        });

        it('should not show SMS autofill hidden input for non-numeric pattern', () => {
            fixture.componentRef.setInput('autocomplete', true);
            fixture.componentRef.setInput('pattern', 'AAAA');
            fixture.changeDetectorRef.detectChanges();
            const hidden = debugElement.query(By.css('.segmented-hidden'));
            expect(hidden).toBeNull();
        });
    });

    // ── Separate mode — onCellInput ───────────────────────────────────────────

    describe('separate mode — onCellInput', () => {
        it('should accept valid numeric char', () => {
            const cell = getCell(debugElement, 0);
            cell.value = '5';
            dispatchInput(cell);
            expect(component.cells[0]).toBe('5');
        });

        it('should reject invalid char (letter in numeric slot)', () => {
            const cell = getCell(debugElement, 0);
            cell.value = 'a';
            dispatchInput(cell);
            expect(component.cells[0]).toBe('');
        });

        it('should restore previous value on rejected char', () => {
            component.cells[0] = '3';
            const cell = getCell(debugElement, 0);
            cell.value = 'a';
            dispatchInput(cell);
            expect(cell.value).toBe('3');
        });

        it('should call onChange with joined cells', () => {
            vi.spyOn(component, 'onChange');
            const cell = getCell(debugElement, 0);
            cell.value = '5';
            dispatchInput(cell);
            expect(component.onChange).toHaveBeenCalledWith('5' + ''.repeat(5));
        });

        it('should emit valueChange', () => {
            vi.spyOn(component.valueChange, 'emit');
            const cell = getCell(debugElement, 0);
            cell.value = '7';
            dispatchInput(cell);
            expect(component.valueChange.emit).toHaveBeenCalled();
        });

        it('should emit update', () => {
            vi.spyOn(component.update, 'emit');
            const cell = getCell(debugElement, 0);
            cell.value = '2';
            dispatchInput(cell);
            expect(component.update.emit).toHaveBeenCalled();
        });

        it('should accept alpha char in alpha slot', () => {
            fixture.componentRef.setInput('pattern', 'AAAA');
            fixture.changeDetectorRef.detectChanges();
            const cell = getCell(debugElement, 0);
            cell.value = 'B';
            dispatchInput(cell);
            expect(component.cells[0]).toBe('B');
        });

        it('should reject digit in alpha slot', () => {
            fixture.componentRef.setInput('pattern', 'AAAA');
            fixture.changeDetectorRef.detectChanges();
            const cell = getCell(debugElement, 0);
            cell.value = '5';
            dispatchInput(cell);
            expect(component.cells[0]).toBe('');
        });

        it('should accept digit or letter in alphanumeric slot', () => {
            fixture.componentRef.setInput('pattern', 'XXXX');
            fixture.changeDetectorRef.detectChanges();
            const cell = getCell(debugElement, 0);
            cell.value = 'A';
            dispatchInput(cell);
            expect(component.cells[0]).toBe('A');
        });
    });

    // ── Separate mode — onCellKeydown ─────────────────────────────────────────

    describe('separate mode — onCellKeydown', () => {
        it('should clear cell on Backspace when cell has value', () => {
            component.cells[0] = '5';
            fixture.changeDetectorRef.detectChanges();
            const cell = getCell(debugElement, 0);
            const ev = dispatchKey(cell, 'Backspace');
            expect(component.cells[0]).toBe('');
        });

        it('should preventDefault on Backspace', () => {
            const cell = getCell(debugElement, 0);
            const event = new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true });
            vi.spyOn(event, 'preventDefault');
            cell.dispatchEvent(event);
            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('should clear cell on Delete', () => {
            component.cells[1] = '7';
            fixture.changeDetectorRef.detectChanges();
            const cell = getCell(debugElement, 1);
            dispatchKey(cell, 'Delete');
            expect(component.cells[1]).toBe('');
        });

        it('should emit on Delete', () => {
            vi.spyOn(component, 'onChange');
            component.cells[0] = '9';
            const cell = getCell(debugElement, 0);
            dispatchKey(cell, 'Delete');
            expect(component.onChange).toHaveBeenCalled();
        });

        it('should preventDefault on ArrowLeft', () => {
            const cell = getCell(debugElement, 1);
            const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
            vi.spyOn(event, 'preventDefault');
            cell.dispatchEvent(event);
            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('should preventDefault on ArrowRight', () => {
            const cell = getCell(debugElement, 0);
            const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
            vi.spyOn(event, 'preventDefault');
            cell.dispatchEvent(event);
            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('should preventDefault on Home', () => {
            const cell = getCell(debugElement, 2);
            const event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
            vi.spyOn(event, 'preventDefault');
            cell.dispatchEvent(event);
            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('should preventDefault on End', () => {
            const cell = getCell(debugElement, 0);
            const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
            vi.spyOn(event, 'preventDefault');
            cell.dispatchEvent(event);
            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('should do nothing for unhandled key', () => {
            vi.spyOn(component, 'onChange');
            const cell = getCell(debugElement, 0);
            dispatchKey(cell, 'Tab');
            expect(component.onChange).not.toHaveBeenCalled();
        });
    });

    // ── Separate mode — onCellPaste ───────────────────────────────────────────

    describe('separate mode — onCellPaste', () => {
        it('should distribute pasted digits across cells', () => {
            component.onCellPaste(makePasteEvent('123456') as any, 0);
            expect(component.cells).toEqual(['1', '2', '3', '4', '5', '6']);
        });

        it('should strip non-numeric chars from paste', () => {
            component.onCellPaste(makePasteEvent('1-2 3.4') as any, 0);
            expect(component.cells.slice(0, 4)).toEqual(['1', '2', '3', '4']);
        });

        it('should start paste from the target slot index', () => {
            component.onCellPaste(makePasteEvent('99') as any, 2);
            expect(component.cells[0]).toBe('');
            expect(component.cells[1]).toBe('');
            expect(component.cells[2]).toBe('9');
            expect(component.cells[3]).toBe('9');
        });

        it('should call onChange after paste', () => {
            vi.spyOn(component, 'onChange');
            component.onCellPaste(makePasteEvent('111111') as any, 0);
            expect(component.onChange).toHaveBeenCalled();
        });

        it('should stop at first invalid char during paste (alpha slot)', () => {
            fixture.componentRef.setInput('pattern', 'AAAA');
            fixture.changeDetectorRef.detectChanges();
            // '1B2C' — '1' is rejected in alpha slot, charIdx does not advance,
            // so all slots try '1' and reject it: no cells are filled.
            component.onCellPaste(makePasteEvent('1B2C') as any, 0);
            expect(component.cells[0]).toBe('');
        });
    });

    // ── Separate mode — blur ──────────────────────────────────────────────────

    describe('separate mode — blur', () => {
        it('should call onTouched on blur', () => {
            vi.spyOn(component, 'onTouched');
            const cell = getCell(debugElement, 0);
            cell.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
            expect(component.onTouched).toHaveBeenCalled();
        });
    });

    // ── Grouped mode ──────────────────────────────────────────────────────────

    describe('grouped mode', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('pattern', '0000-0000');
            fixture.componentRef.setInput('mode', 'grouped');
            fixture.changeDetectorRef.detectChanges();
        });

        it('should render 2 group inputs', () => {
            expect(getCells(debugElement).length).toBe(2);
        });

        it('should keep the separator span', () => {
            const seps = debugElement.queryAll(By.css('.segmented-separator'));
            expect(seps.length).toBe(1);
        });

        it('should apply host class mode-grouped', () => {
            expect(fixture.debugElement.nativeElement.classList).toContain('mode-grouped');
        });

        it('should set maxlength attribute to group size', () => {
            const cell = getCell(debugElement, 0);
            expect(cell.getAttribute('maxlength')).toBe('4');
        });

        it('should accept up to maxlength chars', () => {
            vi.spyOn(component, 'onChange');
            const cell = getCell(debugElement, 0);
            cell.value = '1234';
            dispatchInput(cell);
            expect(component.groupValues[0]).toBe('1234');
            expect(component.onChange).toHaveBeenCalled();
        });

        it('should filter out non-allowed chars on group input', () => {
            const cell = getCell(debugElement, 0);
            cell.value = '1a2b';
            dispatchInput(cell);
            expect(component.groupValues[0]).toBe('12');
        });

        it('should sync cells[] from group input', () => {
            const cell = getCell(debugElement, 0);
            cell.value = '1234';
            dispatchInput(cell);
            expect(component.cells[0]).toBe('1');
            expect(component.cells[1]).toBe('2');
            expect(component.cells[2]).toBe('3');
            expect(component.cells[3]).toBe('4');
        });

        it('should emit onChange after group input', () => {
            vi.spyOn(component, 'onChange');
            const cell = getCell(debugElement, 0);
            cell.value = '5678';
            dispatchInput(cell);
            expect(component.onChange).toHaveBeenCalledWith('5678' + ''.repeat(4));
        });

        it('should emit valueChange after group input', () => {
            vi.spyOn(component.valueChange, 'emit');
            const cell = getCell(debugElement, 0);
            cell.value = '1111';
            dispatchInput(cell);
            expect(component.valueChange.emit).toHaveBeenCalled();
        });

        it('should writeValue distributes into groupValues', () => {
            component.writeValue('12345678');
            expect(component.groupValues[0]).toBe('1234');
            expect(component.groupValues[1]).toBe('5678');
        });

        describe('onGroupKeydown', () => {
            it('should move to prev group on Backspace when empty', () => {
                vi.spyOn(component as any, '_focusGroupPrev');
                const cell = getCell(debugElement, 1);
                cell.value = '';
                const event = new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true });
                cell.dispatchEvent(event);
                expect(component['_focusGroupPrev']).toHaveBeenCalledWith(1, 'end');
            });

            it('should NOT move on Backspace when group has value', () => {
                vi.spyOn(component as any, '_focusGroupPrev');
                const cell = getCell(debugElement, 1);
                cell.value = '123';
                const event = new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true });
                cell.dispatchEvent(event);
                expect(component['_focusGroupPrev']).not.toHaveBeenCalled();
            });

            it('should move to next group on ArrowRight at end of value', () => {
                vi.spyOn(component as any, '_focusGroupNext');
                const cell = getCell(debugElement, 0);
                cell.value = '1234';
                // simulate cursor at end
                cell.setSelectionRange(4, 4);
                const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
                cell.dispatchEvent(event);
                expect(component['_focusGroupNext']).toHaveBeenCalledWith(0, 'start');
            });

            it('should move to prev group on ArrowLeft at start', () => {
                vi.spyOn(component as any, '_focusGroupPrev');
                const cell = getCell(debugElement, 1);
                cell.value = '5678';
                cell.setSelectionRange(0, 0);
                const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
                cell.dispatchEvent(event);
                expect(component['_focusGroupPrev']).toHaveBeenCalledWith(1, 'end');
            });

            it('should NOT move on ArrowLeft when cursor is not at start', () => {
                vi.spyOn(component as any, '_focusGroupPrev');
                const cell = getCell(debugElement, 1);
                cell.value = '5678';
                cell.setSelectionRange(2, 2);
                const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
                cell.dispatchEvent(event);
                expect(component['_focusGroupPrev']).not.toHaveBeenCalled();
            });

            it('should jump to first group on Home when at pos 0', () => {
                vi.spyOn(component as any, '_focusGroupAt');
                const cell = getCell(debugElement, 1);
                cell.value = '';
                cell.setSelectionRange(0, 0);
                const event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
                cell.dispatchEvent(event);
                expect(component['_focusGroupAt']).toHaveBeenCalledWith(0, 'start');
            });

            it('should jump to last group on End when at end', () => {
                vi.spyOn(component as any, '_focusGroupAt');
                const cell = getCell(debugElement, 0);
                cell.value = '';
                cell.setSelectionRange(0, 0);
                const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
                cell.dispatchEvent(event);
                expect(component['_focusGroupAt']).toHaveBeenCalledWith(1, 'end');
            });
        });

        describe('onGroupPaste', () => {
            it('should distribute paste across groups', () => {
                component.onGroupPaste(makePasteEvent('12345678') as any, 0);
                expect(component.groupValues[0]).toBe('1234');
                expect(component.groupValues[1]).toBe('5678');
            });

            it('should strip non-numeric chars from paste', () => {
                component.onGroupPaste(makePasteEvent('1234-5678') as any, 0);
                expect(component.groupValues[0]).toBe('1234');
                expect(component.groupValues[1]).toBe('5678');
            });

            it('should start paste from target group', () => {
                component.onGroupPaste(makePasteEvent('9999') as any, 1);
                expect(component.groupValues[0]).toBe('');
                expect(component.groupValues[1]).toBe('9999');
            });

            it('should call onChange after group paste', () => {
                vi.spyOn(component, 'onChange');
                component.onGroupPaste(makePasteEvent('12345678') as any, 0);
                expect(component.onChange).toHaveBeenCalled();
            });
        });

        describe('heterogeneous group (mixed types without separator)', () => {
            // Pattern 'a0': alpha slot + numeric slot → split into 2 groups by _buildGroupEntries
            // But 'aaa-xx-aaa': same issue applies — group.type was used globally before fix

            it('should accept only alpha in alpha position of mixed-adjacent pattern', () => {
                fixture.componentRef.setInput('pattern', 'aaa-xx-aaa');
                fixture.componentRef.setInput('mode', 'grouped');
                fixture.changeDetectorRef.detectChanges();
                vi.spyOn(component, 'onChange');
                // Group 0 = 'aaa' (alpha), group 1 = 'xx' (alphanumeric)
                const fakeInput = { value: 'ABC', selectionStart: 3, setSelectionRange: vi.fn() } as any;
                component.onGroupInput({ target: fakeInput } as any, 0);
                expect(component.groupValues[0]).toBe('ABC');
                expect(component.onChange).toHaveBeenCalled();
            });

            it('should reject digits in alpha group of aaa-xx-aaa', () => {
                fixture.componentRef.setInput('pattern', 'aaa-xx-aaa');
                fixture.componentRef.setInput('mode', 'grouped');
                fixture.changeDetectorRef.detectChanges();
                const fakeInput = { value: '123', selectionStart: 0, setSelectionRange: vi.fn() } as any;
                component.onGroupInput({ target: fakeInput } as any, 0);
                expect(component.groupValues[0]).toBe('');
            });

            it('onGroupPaste: should validate each slot type individually for mixed pattern', () => {
                fixture.componentRef.setInput('pattern', 'aaa-xx-aaa');
                fixture.componentRef.setInput('mode', 'grouped');
                fixture.changeDetectorRef.detectChanges();
                // Paste 'ABC12DEF' — group 0 (alpha): ABC ok, group 1 (alphanumeric): 12 ok, group 2 (alpha): DEF ok
                component.onGroupPaste(makePasteEvent('ABC12DEF') as any, 0);
                expect(component.groupValues[0]).toBe('ABC');
                expect(component.groupValues[1]).toBe('12');
                expect(component.groupValues[2]).toBe('DEF');
            });
        });
    });

    // ── Unified mode ──────────────────────────────────────────────────────────

    describe('unified mode', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('pattern', '0000-0000');
            fixture.componentRef.setInput('mode', 'unified');
            fixture.changeDetectorRef.detectChanges();
        });

        it('should apply host class mode-unified', () => {
            expect(fixture.debugElement.nativeElement.classList).toContain('mode-unified');
        });

        it('should render 2 group inputs (same as grouped)', () => {
            expect(getCells(debugElement).length).toBe(2);
        });

        it('should render separator span', () => {
            const seps = debugElement.queryAll(By.css('.segmented-separator'));
            expect(seps.length).toBe(1);
        });

        it('should accept input correctly in unified mode', () => {
            vi.spyOn(component, 'onChange');
            const cell = getCell(debugElement, 0);
            cell.value = '1234';
            dispatchInput(cell);
            expect(component.groupValues[0]).toBe('1234');
            expect(component.onChange).toHaveBeenCalled();
        });
    });

    // ── autocomplete / SMS OTP ────────────────────────────────────────────────

    describe('autocomplete', () => {
        it('should add autocomplete="one-time-code" on first cell when enabled', () => {
            fixture.componentRef.setInput('autocomplete', true);
            fixture.changeDetectorRef.detectChanges();
            const cell = getCell(debugElement, 0);
            expect(cell.getAttribute('autocomplete')).toBe('one-time-code');
        });

        it('should set autocomplete="off" on subsequent cells', () => {
            fixture.componentRef.setInput('autocomplete', true);
            fixture.changeDetectorRef.detectChanges();
            const cell = getCell(debugElement, 1);
            expect(cell.getAttribute('autocomplete')).toBe('off');
        });

        it('should not add one-time-code for non-numeric pattern', () => {
            fixture.componentRef.setInput('autocomplete', true);
            fixture.componentRef.setInput('pattern', 'AAAA');
            fixture.changeDetectorRef.detectChanges();
            const cell = getCell(debugElement, 0);
            expect(cell.getAttribute('autocomplete')).toBe('off');
        });
    });

    // ── disabled / readonly ───────────────────────────────────────────────────

    describe('disabled / readonly', () => {
        it('should disable all cell inputs when disabled', () => {
            fixture.componentRef.setInput('disabled', true);
            fixture.changeDetectorRef.detectChanges();
            const cells = getCells(debugElement);
            expect(cells.every(c => c.disabled)).toBe(true);
        });

        it('should set readonly on all cell inputs', () => {
            fixture.componentRef.setInput('readonly', true);
            fixture.changeDetectorRef.detectChanges();
            const cells = getCells(debugElement);
            expect(cells.every(c => c.readOnly)).toBe(true);
        });
    });

    // ── ControlValueAccessor ──────────────────────────────────────────────────

    describe('ControlValueAccessor', () => {
        it('should call onTouched on cell blur', () => {
            vi.spyOn(component, 'onTouched');
            const cell = getCell(debugElement, 0);
            cell.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
            expect(component.onTouched).toHaveBeenCalled();
        });

        it('should register onChange and call it on input', () => {
            const fn = vi.fn();
            component.registerOnChange(fn);
            const cell = getCell(debugElement, 0);
            cell.value = '1';
            dispatchInput(cell);
            expect(fn).toHaveBeenCalled();
        });

        it('should register onTouched', () => {
            const fn = vi.fn();
            component.registerOnTouched(fn);
            const cell = getCell(debugElement, 0);
            cell.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
            expect(fn).toHaveBeenCalled();
        });
    });

    // ── ngOnChanges — pattern / mode update ──────────────────────────────────

    describe('ngOnChanges — pattern/mode update', () => {
        it('should resize cells when pattern changes', () => {
            fixture.componentRef.setInput('pattern', '00');
            fixture.changeDetectorRef.detectChanges();
            expect(component.cells.length).toBe(2);
        });

        it('should not lose existing values fitting the new pattern', () => {
            component.writeValue('123456');
            fixture.componentRef.setInput('pattern', '0000');
            fixture.changeDetectorRef.detectChanges();
            expect(component.cells.length).toBe(4);
        });
    });

    // ── Edge cases / boundary branches ───────────────────────────────────────

    describe('boundary branches', () => {
        // _focusGroupNext: from is already the last group → no-op
        it('should not advance focus past the last group', () => {
            fixture.componentRef.setInput('pattern', '0000-0000');
            fixture.componentRef.setInput('mode', 'grouped');
            fixture.changeDetectorRef.detectChanges();
            vi.spyOn(component as any, '_focusGroupAt');
            // index 1 = last group (2 groups total, 0-based)
            component['_focusGroupNext'](1);
            expect(component['_focusGroupAt']).not.toHaveBeenCalled();
        });

        // _focusGroupPrev: from is already the first group → no-op
        it('should not move focus before the first group', () => {
            fixture.componentRef.setInput('pattern', '0000-0000');
            fixture.componentRef.setInput('mode', 'grouped');
            fixture.changeDetectorRef.detectChanges();
            vi.spyOn(component as any, '_focusGroupAt');
            component['_focusGroupPrev'](0);
            expect(component['_focusGroupAt']).not.toHaveBeenCalled();
        });

        // _focusCellNext: from is already the last cell → no-op
        it('should not advance focus past the last cell', () => {
            vi.spyOn(component as any, '_focusCell');
            component['_focusCellNext'](5); // last index of default '000000'
            expect(component['_focusCell']).not.toHaveBeenCalled();
        });

        // _focusCellPrev: from is already the first cell → no-op
        it('should not move focus before the first cell', () => {
            vi.spyOn(component as any, '_focusCell');
            component['_focusCellPrev'](0);
            expect(component['_focusCell']).not.toHaveBeenCalled();
        });

        // writeValue in fused mode triggers _syncGroupDom path
        it('should sync group DOM on writeValue in grouped mode', () => {
            fixture.componentRef.setInput('pattern', '0000-0000');
            fixture.componentRef.setInput('mode', 'grouped');
            fixture.changeDetectorRef.detectChanges();
            vi.spyOn(component as any, '_syncGroupDom');
            component.writeValue('12345678');
            expect(component['_syncGroupDom']).toHaveBeenCalled();
        });

        // writeValue in separate mode triggers _syncCellsDom path
        it('should sync cells DOM on writeValue in separate mode', () => {
            vi.spyOn(component as any, '_syncCellsDom');
            component.writeValue('123456');
            expect(component['_syncCellsDom']).toHaveBeenCalled();
        });

        // _buildGroupEntries: flush called with empty currentSlots
        // (pattern starting with a separator like '-0000')
        it('should handle pattern starting with separator', () => {
            fixture.componentRef.setInput('pattern', '-0000');
            fixture.changeDetectorRef.detectChanges();
            // The leading '-' is a separator with no preceding group → flush is a no-op
            const groups = component['_groups']();
            expect(groups.length).toBe(1);
            expect(groups[0].maxlength).toBe(4);
        });

        // onGroupInput: no group found for index → early return
        it('should handle onGroupInput with invalid group index gracefully', () => {
            fixture.componentRef.setInput('pattern', '0000');
            fixture.componentRef.setInput('mode', 'grouped');
            fixture.changeDetectorRef.detectChanges();
            // index 99 does not exist → should not throw
            expect(() => {
                const fakeEvent = { target: { value: '1', selectionStart: 1 } } as any;
                component.onGroupInput(fakeEvent, 99);
            }).not.toThrow();
        });

        // onCellFocus in fused mode: select() should NOT be called
        it('should not call select() on focus in fused mode', () => {
            fixture.componentRef.setInput('pattern', '0000-0000');
            fixture.componentRef.setInput('mode', 'grouped');
            fixture.changeDetectorRef.detectChanges();
            const input = { select: vi.fn() } as any;
            component.onCellFocus({ target: input } as any);
            // In fused mode onCellFocus is a no-op → select not called
            expect(input.select).not.toHaveBeenCalled();
        });

        // onCellFocus in separate mode: select() should be called (via setTimeout)
        it('should call select() on focus in separate mode', async () => {
            vi.useFakeTimers();
            const input = { select: vi.fn() } as any;
            component.onCellFocus({ target: input } as any);
            vi.runAllTimers();
            expect(input.select).toHaveBeenCalled();
        });

        // groupPositions: pattern with only separators (edge case: no slots)
        it('should return empty map for separator-only pattern', () => {
            fixture.componentRef.setInput('pattern', '---');
            fixture.changeDetectorRef.detectChanges();
            expect(component.groupPositions().size).toBe(0);
        });

        // _focusGroupAt with position='start' sets cursor to 0
        it('should place cursor at start when focusing group with position=start', async () => {
            fixture.componentRef.setInput('pattern', '0000-0000');
            fixture.componentRef.setInput('mode', 'grouped');
            fixture.changeDetectorRef.detectChanges();
            vi.useFakeTimers();
            component['_focusGroupAt'](0, 'start');
            vi.runAllTimers();
            const cell = getCell(debugElement, 0);
            expect(cell.selectionStart).toBe(0);
        });

        // _focusGroupAt with position='end' sets cursor to end
        it('should place cursor at end when focusing group with position=end', async () => {
            fixture.componentRef.setInput('pattern', '0000-0000');
            fixture.componentRef.setInput('mode', 'grouped');
            fixture.changeDetectorRef.detectChanges();
            // pre-fill the first group so value.length > 0
            getCell(debugElement, 0).value = '1234';
            vi.useFakeTimers();
            component['_focusGroupAt'](0, 'end');
            vi.runAllTimers();
            const cell = getCell(debugElement, 0);
            expect(cell.selectionStart).toBe(cell.value.length);
        });

        // onGroupInput: filtering changes value → rewrites input and restores cursor
        it('should rewrite input.value when invalid chars are filtered', () => {
            fixture.componentRef.setInput('pattern', '0000-0000');
            fixture.componentRef.setInput('mode', 'grouped');
            fixture.changeDetectorRef.detectChanges();
            const cell = getCell(debugElement, 0);
            // Simulate typing letters into a numeric group
            const fakeInput = {
                value: 'ab12',
                selectionStart: 4,
                setSelectionRange: vi.fn(),
            } as any;
            const fakeEvent = { target: fakeInput } as any;
            component.onGroupInput(fakeEvent, 0);
            // 'ab' filtered out → '12'
            expect(fakeInput.value).toBe('12');
            expect(fakeInput.setSelectionRange).toHaveBeenCalledWith(2, 2);
        });

        // onGroupInput: auto-advance fires when group is full and cursor at end
        it('should auto-advance to next group when full', () => {
            fixture.componentRef.setInput('pattern', '0000-0000');
            fixture.componentRef.setInput('mode', 'grouped');
            fixture.changeDetectorRef.detectChanges();
            vi.spyOn(component as any, '_focusGroupNext');
            const fakeInput = {
                value: '1234',
                selectionStart: 4,
                setSelectionRange: vi.fn(),
            } as any;
            component.onGroupInput({ target: fakeInput } as any, 0);
            expect(component['_focusGroupNext']).toHaveBeenCalledWith(0);
        });

        // onGroupKeydown: ArrowRight when cursor is NOT at end → no navigation
        it('should NOT navigate on ArrowRight when cursor is not at end', () => {
            fixture.componentRef.setInput('pattern', '0000-0000');
            fixture.componentRef.setInput('mode', 'grouped');
            fixture.changeDetectorRef.detectChanges();
            vi.spyOn(component as any, '_focusGroupNext');
            const cell = getCell(debugElement, 0);
            cell.value = '1234';
            cell.setSelectionRange(2, 2); // cursor in the middle
            const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
            cell.dispatchEvent(event);
            expect(component['_focusGroupNext']).not.toHaveBeenCalled();
        });

        // onGroupKeydown: Home when cursor is NOT at pos 0 → no navigation
        it('should NOT jump to first group on Home when cursor is not at pos 0', () => {
            fixture.componentRef.setInput('pattern', '0000-0000');
            fixture.componentRef.setInput('mode', 'grouped');
            fixture.changeDetectorRef.detectChanges();
            vi.spyOn(component as any, '_focusGroupAt');
            const cell = getCell(debugElement, 0);
            cell.value = '1234';
            cell.setSelectionRange(2, 2);
            const event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
            cell.dispatchEvent(event);
            expect(component['_focusGroupAt']).not.toHaveBeenCalled();
        });

        // _syncGroupValues: cells[i] is undefined → fallback to ''
        it('should use empty string fallback when cells slot is undefined', () => {
            fixture.componentRef.setInput('pattern', '0000-0000');
            fixture.componentRef.setInput('mode', 'grouped');
            fixture.changeDetectorRef.detectChanges();
            // Deliberately set cells to have an undefined hole
            component.cells[0] = undefined as any;
            component['_syncGroupValues']();
            expect(component.groupValues[0]).toBe('');
        });

        // _focusGroupAt: el is null (no rendered inputs yet) → early return, no throw
        it('should not throw when _focusGroupAt target element is absent', () => {
            // Call before any pattern is set so cellInputs() is empty
            expect(() => component['_focusGroupAt'](0)).not.toThrow();
        });

        // _syncCellsDom: refs[i] is absent → skip without throw
        it('should not throw in _syncCellsDom when refs are absent', () => {
            component.cells = ['1', '2'];
            // cellInputs() returns [] when there is no rendered DOM
            expect(() => component['_syncCellsDom']()).not.toThrow();
        });

        // _syncGroupDom: refs[gi] is absent → skip without throw
        it('should not throw in _syncGroupDom when refs are absent', () => {
            fixture.componentRef.setInput('pattern', '0000-0000');
            fixture.componentRef.setInput('mode', 'grouped');
            // Don't call detectChanges → no DOM rendered
            expect(() => component['_syncGroupDom']()).not.toThrow();
        });

        // onGroupKeydown: End when cursor is NOT at end → no navigation
        it('should NOT jump to last group on End when cursor is not at end', () => {
            fixture.componentRef.setInput('pattern', '0000-0000');
            fixture.componentRef.setInput('mode', 'grouped');
            fixture.changeDetectorRef.detectChanges();
            vi.spyOn(component as any, '_focusGroupAt');
            const cell = getCell(debugElement, 0);
            cell.value = '1234';
            cell.setSelectionRange(2, 2);
            const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
            cell.dispatchEvent(event);
            expect(component['_focusGroupAt']).not.toHaveBeenCalled();
        });
    });
});
