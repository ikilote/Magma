import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MagmaInputRange } from '../../input/input-range.component';
import { MagmaInput } from '../../input/input.component';
import { DEFAULT_FILTER_LABELS, FilterEditorLabels } from '../css-var-editor.labels';

export interface FilterLayer {
    type: FilterType;
    value: number;
}

export type FilterType =
    | 'brightness'
    | 'contrast'
    | 'saturate'
    | 'grayscale'
    | 'sepia'
    | 'hue-rotate'
    | 'invert'
    | 'blur'
    | 'opacity';

export interface FilterDef {
    type: FilterType;
    label: string;
    min: number;
    max: number;
    step: number;
    unit: string;
    default: number;
}

@Component({
    selector: 'mg-filter-editor',
    templateUrl: './filter-editor.component.html',
    styleUrl: './filter-editor.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, MagmaInput, MagmaInputRange, CdkDropList, CdkDrag, CdkDragHandle],
})
export class MagmaFilterEditor {
    readonly valueChange = output<string>();
    readonly labels = input<FilterEditorLabels>(DEFAULT_FILTER_LABELS);

    readonly availableFilters = computed<FilterDef[]>(() => {
        const l = this.labels();
        return [
            { type: 'brightness', label: l.brightness, min: 0, max: 300, step: 1, unit: '%', default: 100 },
            { type: 'contrast', label: l.contrast, min: 0, max: 300, step: 1, unit: '%', default: 100 },
            { type: 'saturate', label: l.saturate, min: 0, max: 300, step: 1, unit: '%', default: 100 },
            { type: 'grayscale', label: l.grayscale, min: 0, max: 100, step: 1, unit: '%', default: 0 },
            { type: 'sepia', label: l.sepia, min: 0, max: 100, step: 1, unit: '%', default: 0 },
            { type: 'hue-rotate', label: l.hueRotate, min: 0, max: 360, step: 1, unit: 'deg', default: 0 },
            { type: 'invert', label: l.invert, min: 0, max: 100, step: 1, unit: '%', default: 0 },
            { type: 'blur', label: l.blur, min: 0, max: 20, step: 0.5, unit: 'px', default: 0 },
            { type: 'opacity', label: l.opacity, min: 0, max: 100, step: 1, unit: '%', default: 100 },
        ];
    });

    readonly layers = signal<FilterLayer[]>([]);

    readonly cssValue = computed(() => {
        const active = this.layers();
        if (active.length === 0) return 'none';
        return active
            .map(l => {
                const def = this.getDef(l.type);
                return `${l.type}(${l.value}${def.unit})`;
            })
            .join(' ');
    });

    getDef(type: FilterType): FilterDef {
        return this.availableFilters().find(f => f.type === type)!;
    }

    addFilter(type: FilterType): void {
        const def = this.getDef(type);
        this.layers.update(layers => [...layers, { type, value: def.default }]);
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

    drop(event: CdkDragDrop<FilterLayer[]>): void {
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
