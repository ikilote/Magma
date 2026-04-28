import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MagmaInputElement } from '../../input/input-element.component';
import { MagmaInputRange } from '../../input/input-range.component';
import { MagmaInput } from '../../input/input.component';
import { DEFAULT_TRANSFORM_LABELS, TransformEditorLabels } from '../css-var-editor.labels';

const LENGTH_UNITS = ['px', 'em', 'rem', 'vh', 'vw', '%'] as const;

@Component({
    selector: 'mg-transform-editor',
    templateUrl: './transform-editor.component.html',
    styleUrl: './transform-editor.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, MagmaInput, MagmaInputElement, MagmaInputRange],
})
export class MagmaTransformEditor {
    readonly valueChange = output<string>();
    readonly labels = input<TransformEditorLabels>(DEFAULT_TRANSFORM_LABELS);

    readonly translateX = signal(0);
    readonly translateY = signal(0);
    readonly translateUnit = signal('px');
    readonly lengthUnits = LENGTH_UNITS;
    readonly scaleX = signal(1);
    readonly scaleY = signal(1);
    readonly rotate = signal(0);
    readonly skewX = signal(0);
    readonly skewY = signal(0);

    readonly cssValue = computed(() => {
        const parts: string[] = [];
        const tx = this.translateX();
        const ty = this.translateY();
        const sx = this.scaleX();
        const sy = this.scaleY();
        const r = this.rotate();
        const skx = this.skewX();
        const sky = this.skewY();

        if (tx !== 0 || ty !== 0) parts.push(`translate(${tx}${this.translateUnit()}, ${ty}${this.translateUnit()})`);
        if (sx !== 1 || sy !== 1) parts.push(`scale(${sx}, ${sy})`);
        if (r !== 0) parts.push(`rotate(${r}deg)`);
        if (skx !== 0 || sky !== 0) parts.push(`skew(${skx}deg, ${sky}deg)`);

        return parts.length > 0 ? parts.join(' ') : 'none';
    });

    update(field: string, value: number): void {
        (this as any)[field].set(value);
        setTimeout(() => this.valueChange.emit(this.cssValue()));
    }

    copyValue(): void {
        navigator.clipboard.writeText(this.cssValue());
    }

    resetAll(): void {
        this.translateX.set(0);
        this.translateY.set(0);
        this.scaleX.set(1);
        this.scaleY.set(1);
        this.rotate.set(0);
        this.skewX.set(0);
        this.skewY.set(0);
        setTimeout(() => this.valueChange.emit(this.cssValue()));
    }
}
