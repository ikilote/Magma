import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CssVariable } from './css-var-editor.component';
import { CssVarItemLabels, DEFAULT_ITEM_LABELS } from './css-var-editor.labels';

import { MagmaInputElement } from '../input/input-element.component';
import { MagmaInputNumber } from '../input/input-number.component';
import { MagmaInputRange } from '../input/input-range.component';
import { MagmaInputText } from '../input/input-text.component';
import { MagmaInput } from '../input/input.component';

export type CssVarType = 'color' | 'percentage' | 'length' | 'number' | 'text';

export const LENGTH_UNITS = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'ch', '%', 'pt'] as const;

/** Detects the type of a CSS variable value. */
export function detectCssVarType(value: string): CssVarType {
    const v = value.trim();

    if (/^(#|rgb|hsl|hwb|lab|lch|oklch|oklab|color-mix)/.test(v)) return 'color';
    if (/^(transparent|currentcolor|inherit)$/i.test(v)) return 'color';
    if (/^-?[\d.]+%$/.test(v)) return 'percentage';
    if (/^-?[\d.]+(px|em|rem|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc|svh|svw|dvh|dvw|lvh|lvw)$/.test(v)) return 'length';
    if (/^-?[\d.]+$/.test(v)) return 'number';

    return 'text';
}

@Component({
    selector: 'mg-css-var-item',
    templateUrl: './css-var-item.component.html',
    styleUrl: './css-var-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, MagmaInput, MagmaInputElement, MagmaInputText, MagmaInputNumber, MagmaInputRange],
    host: {
        '[class.modified]': 'modified()',
    },
})
export class MagmaCssVarItem {
    readonly variable = input.required<CssVariable>();
    readonly labels = input<CssVarItemLabels>(DEFAULT_ITEM_LABELS);
    readonly valueChange = output<string>();
    readonly reset = output<void>();

    readonly textMode = signal(false);
    readonly lengthUnits = LENGTH_UNITS;

    /** Mutable unit for length type — initialized from the original value. */
    readonly selectedUnit = signal('px');

    readonly detectedType = computed<CssVarType>(() => detectCssVarType(this.variable().originalValue));
    readonly varType = computed<CssVarType>(() => (this.textMode() ? 'text' : this.detectedType()));
    readonly showToggle = computed(() => this.detectedType() !== 'text');
    readonly modified = computed(() => this.variable().value !== this.variable().originalValue);
    readonly displayName = computed(() => this.variable().name.replace(/^--/, ''));
    readonly numericValue = computed(() => parseFloat(this.variable().value) || 0);

    constructor() {
        // Initialize selectedUnit from the original value's unit
        effect(() => {
            const match = this.variable().originalValue.match(
                /(px|em|rem|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc|svh|svw|dvh|dvw|lvh|lvw|%)$/,
            );
            if (match) {
                this.selectedUnit.set(match[1]);
            }
        });
    }

    toggleTextMode(): void {
        this.textMode.update(v => !v);
    }

    onTextChange(value: string): void {
        this.valueChange.emit(value);
    }

    onPercentageChange(value: number): void {
        this.valueChange.emit(`${value}%`);
    }

    onNumberChange(value: number): void {
        this.valueChange.emit(`${value}`);
    }

    onLengthChange(value: number): void {
        this.valueChange.emit(`${value}${this.selectedUnit()}`);
    }

    onUnitChange(unit: string): void {
        this.selectedUnit.set(unit);
        this.valueChange.emit(`${this.numericValue()}${unit}`);
    }

    onReset(): void {
        this.reset.emit();
    }
}
