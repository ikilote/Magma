import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { clipboardWrite } from '../../../utils/clipboard';
import { MagmaInputElement } from '../../input/input-element.component';
import { MagmaInputRange } from '../../input/input-range.component';
import { MagmaInputText } from '../../input/input-text.component';
import { MagmaInput } from '../../input/input.component';
import { DEFAULT_TYPOGRAPHY_LABELS, TypographyEditorLabels } from '../css-var-editor.labels';

export type FontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

const LENGTH_UNITS = ['px', 'em', 'rem', 'vh', 'vw', '%'] as const;

@Component({
    selector: 'mg-typography-editor',
    templateUrl: './typography-editor.component.html',
    styleUrl: './typography-editor.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, MagmaInput, MagmaInputElement, MagmaInputRange, MagmaInputText],
})
export class MagmaTypographyEditor {
    readonly valueChange = output<string>();
    readonly labels = input<TypographyEditorLabels>(DEFAULT_TYPOGRAPHY_LABELS);

    readonly fontFamily = signal("'Roboto', sans-serif");
    readonly fontSize = signal(16);
    readonly fontSizeUnit = signal('px');
    readonly fontSizeComputed = computed(() => this.fontSize() + this.fontSizeUnit());
    readonly fontWeight = signal<FontWeight>('400');
    readonly lineHeight = signal(1.5);
    readonly letterSpacing = signal(0);
    readonly letterSpacingUnit = signal('px');
    readonly letterSpacingComputed = computed(() => this.letterSpacing() + this.letterSpacingUnit());
    readonly lengthUnits = LENGTH_UNITS;
    readonly color = signal('var(--text-color)');

    readonly weights: { value: FontWeight; label: string }[] = [
        { value: '100', label: 'Thin' },
        { value: '200', label: 'Extra Light' },
        { value: '300', label: 'Light' },
        { value: '400', label: 'Regular' },
        { value: '500', label: 'Medium' },
        { value: '600', label: 'Semi Bold' },
        { value: '700', label: 'Bold' },
        { value: '800', label: 'Extra Bold' },
        { value: '900', label: 'Black' },
    ];

    readonly cssProperties = computed(() => [
        `font-family: ${this.fontFamily()}`,
        `font-size: ${this.fontSizeComputed()}`,
        `font-weight: ${this.fontWeight()}`,
        `line-height: ${this.lineHeight()}`,
        `letter-spacing: ${this.letterSpacingComputed()}`,
        `color: ${this.color()}`,
    ]);

    readonly cssValue = computed(() => this.cssProperties().join(';\n') + ';');

    setFontFamily(value: string): void {
        this.fontFamily.set(value);
        this.emit();
    }

    setFontSize(value: number): void {
        this.fontSize.set(value);
        this.emit();
    }

    setFontWeight(value: FontWeight): void {
        this.fontWeight.set(value);
        this.emit();
    }

    setLineHeight(value: number): void {
        this.lineHeight.set(value);
        this.emit();
    }

    setLetterSpacing(value: number): void {
        this.letterSpacing.set(value);
        this.emit();
    }

    setColor(value: string): void {
        this.color.set(value);
        this.emit();
    }

    copyValue(): void {
        clipboardWrite(this.cssValue());
    }

    private emit(): void {
        setTimeout(() => this.valueChange.emit(this.cssValue()));
    }
}
