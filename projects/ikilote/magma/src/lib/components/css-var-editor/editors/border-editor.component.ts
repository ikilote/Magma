import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { clipboardWrite } from '../../../utils/clipboard';
import { MagmaInputElement } from '../../input/input-element.component';
import { MagmaInputRange } from '../../input/input-range.component';
import { MagmaInputText } from '../../input/input-text.component';
import { MagmaInput } from '../../input/input.component';
import { BorderEditorLabels, DEFAULT_BORDER_LABELS } from '../css-var-editor.labels';

export type BorderStyle = 'none' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';

const LENGTH_UNITS = ['px', 'em', 'rem', 'vh', 'vw', '%'] as const;

@Component({
    selector: 'mg-border-editor',
    templateUrl: './border-editor.component.html',
    styleUrl: './border-editor.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, MagmaInput, MagmaInputElement, MagmaInputRange, MagmaInputText],
})
export class MagmaBorderEditor {
    readonly valueChange = output<string>();
    readonly labels = input<BorderEditorLabels>(DEFAULT_BORDER_LABELS);

    readonly width = signal(1);
    readonly style = signal<BorderStyle>('solid');
    readonly color = signal('var(--primary500)');
    readonly radius = signal(3);
    readonly widthUnit = signal('px');
    readonly radiusUnit = signal('px');
    readonly lengthUnits = LENGTH_UNITS;

    readonly styles: BorderStyle[] = [
        'none',
        'solid',
        'dashed',
        'dotted',
        'double',
        'groove',
        'ridge',
        'inset',
        'outset',
    ];

    readonly borderValue = computed(() => `${this.width()}${this.widthUnit()} ${this.style()} ${this.color()}`);
    readonly radiusValue = computed(() => `${this.radius()}${this.radiusUnit()}`);

    setStyle(style: BorderStyle): void {
        this.style.set(style);
        this.emit();
    }

    setWidth(value: number): void {
        this.width.set(value);
        this.emit();
    }

    setColor(value: string): void {
        this.color.set(value);
        this.emit();
    }

    setRadius(value: number): void {
        this.radius.set(value);
        this.emit();
    }

    setWidthUnit(unit: string): void {
        this.widthUnit.set(unit);
        this.emit();
    }

    setRadiusUnit(unit: string): void {
        this.radiusUnit.set(unit);
        this.emit();
    }

    copyBorder(): void {
        clipboardWrite(this.borderValue());
    }

    copyRadius(): void {
        clipboardWrite(this.radiusValue());
    }

    private emit(): void {
        setTimeout(() => this.valueChange.emit(this.borderValue()));
    }
}
