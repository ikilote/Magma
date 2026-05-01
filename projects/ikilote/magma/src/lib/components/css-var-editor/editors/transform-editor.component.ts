import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MagmaInputElement } from '../../input/input-element.component';
import { MagmaInputRange } from '../../input/input-range.component';
import { MagmaInput } from '../../input/input.component';
import { DEFAULT_TRANSFORM_LABELS, TransformEditorLabels } from '../css-var-editor.labels';

export type TransformType = 'translateX' | 'translateY' | 'scaleX' | 'scaleY' | 'rotate' | 'skewX' | 'skewY';

export interface TransformLayer {
    type: TransformType;
    value: number;
    unit: string;
}

interface TransformDef {
    type: TransformType;
    label: string;
    min: number;
    max: number;
    step: number;
    unit: string;
    default: number;
}

const LENGTH_UNITS = ['px', 'em', 'rem', 'vh', 'vw', '%'] as const;

@Component({
    selector: 'mg-transform-editor',
    templateUrl: './transform-editor.component.html',
    styleUrl: './transform-editor.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, MagmaInput, MagmaInputElement, MagmaInputRange, CdkDropList, CdkDrag, CdkDragHandle],
})
export class MagmaTransformEditor {
    readonly valueChange = output<string>();
    readonly labels = input<TransformEditorLabels>(DEFAULT_TRANSFORM_LABELS);
    readonly lengthUnits = LENGTH_UNITS;

    readonly availableTransforms = computed<TransformDef[]>(() => {
        const l = this.labels();
        return [
            { type: 'translateX', label: l.translateX, min: -200, max: 200, step: 1, unit: 'px', default: 0 },
            { type: 'translateY', label: l.translateY, min: -200, max: 200, step: 1, unit: 'px', default: 0 },
            { type: 'scaleX', label: l.scaleX, min: 0, max: 3, step: 0.1, unit: '', default: 1 },
            { type: 'scaleY', label: l.scaleY, min: 0, max: 3, step: 0.1, unit: '', default: 1 },
            { type: 'rotate', label: l.rotation, min: -180, max: 180, step: 1, unit: 'deg', default: 0 },
            { type: 'skewX', label: l.skewX, min: -90, max: 90, step: 1, unit: 'deg', default: 0 },
            { type: 'skewY', label: l.skewY, min: -90, max: 90, step: 1, unit: 'deg', default: 0 },
        ];
    });

    readonly layers = signal<TransformLayer[]>([]);

    readonly cssValue = computed(() => {
        const active = this.layers();
        if (active.length === 0) return 'none';
        return active
            .map(l => {
                const suffix = l.unit ? `${l.value}${l.unit}` : `${l.value}`;
                return `${l.type}(${suffix})`;
            })
            .join(' ');
    });

    getDef(type: TransformType): TransformDef {
        return this.availableTransforms().find(d => d.type === type)!;
    }

    addTransform(type: TransformType): void {
        const def = this.getDef(type);
        this.layers.update(layers => [...layers, { type, value: def.default, unit: def.unit }]);
        this.emit();
    }

    removeLayer(index: number): void {
        this.layers.update(layers => layers.filter((_, i) => i !== index));
        this.emit();
    }

    updateValue(index: number, value: number): void {
        this.layers.update(layers => layers.map((l, i) => (i === index ? { ...l, value } : l)));
        this.emit();
    }

    updateUnit(index: number, unit: string): void {
        this.layers.update(layers => layers.map((l, i) => (i === index ? { ...l, unit } : l)));
        this.emit();
    }

    drop(event: CdkDragDrop<TransformLayer[]>): void {
        const items = [...this.layers()];
        moveItemInArray(items, event.previousIndex, event.currentIndex);
        this.layers.set(items);
        this.emit();
    }

    copyValue(): void {
        navigator.clipboard.writeText(this.cssValue());
    }

    resetAll(): void {
        this.layers.set([]);
        this.emit();
    }

    private emit(): void {
        setTimeout(() => this.valueChange.emit(this.cssValue()));
    }
}
