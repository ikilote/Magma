import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MagmaInputElement } from '../../input/input-element.component';
import { MagmaInputRange } from '../../input/input-range.component';
import { MagmaInputText } from '../../input/input-text.component';
import { MagmaInput } from '../../input/input.component';
import { ColorMixEditorLabels, DEFAULT_COLOR_MIX_LABELS } from '../css-var-editor.labels';

export type ColorSpace = 'srgb' | 'hsl' | 'hwb' | 'lch' | 'oklch' | 'lab' | 'oklab';

@Component({
    selector: 'mg-color-mix-editor',
    templateUrl: './color-mix-editor.component.html',
    styleUrl: './color-mix-editor.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, MagmaInput, MagmaInputElement, MagmaInputRange, MagmaInputText],
})
export class MagmaColorMixEditor {
    readonly valueChange = output<string>();
    readonly labels = input<ColorMixEditorLabels>(DEFAULT_COLOR_MIX_LABELS);

    readonly colorSpace = signal<ColorSpace>('hsl');
    readonly color1 = signal('var(--primary050)');
    readonly color2 = signal('transparent');
    readonly percentage = signal(60);

    readonly colorSpaces: ColorSpace[] = ['srgb', 'hsl', 'hwb', 'lch', 'oklch', 'lab', 'oklab'];

    readonly cssValue = computed(
        () => `color-mix(in ${this.colorSpace()}, ${this.color1()} ${this.percentage()}%, ${this.color2()})`,
    );

    setColorSpace(space: ColorSpace): void {
        this.colorSpace.set(space);
        this.emit();
    }

    setColor1(value: string): void {
        this.color1.set(value);
        this.emit();
    }

    setColor2(value: string): void {
        this.color2.set(value);
        this.emit();
    }

    setPercentage(value: number): void {
        this.percentage.set(value);
        this.emit();
    }

    copyValue(): void {
        navigator.clipboard.writeText(this.cssValue());
    }

    private emit(): void {
        setTimeout(() => this.valueChange.emit(this.cssValue()));
    }
}
