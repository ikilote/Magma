import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MagmaInputElement } from '../../input/input-element.component';
import { MagmaInputRange } from '../../input/input-range.component';
import { MagmaInputText } from '../../input/input-text.component';
import { MagmaInput } from '../../input/input.component';
import { DEFAULT_SHADOW_LABELS, ShadowEditorLabels } from '../css-var-editor.labels';

export interface ShadowLayer {
    offsetX: number;
    offsetY: number;
    blur: number;
    spread: number;
    color: string;
    inset: boolean;
    unit: string;
}

const LENGTH_UNITS = ['px', 'em', 'rem', 'vh', 'vw', '%'] as const;

function defaultLayer(): ShadowLayer {
    return { offsetX: 0, offsetY: 4, blur: 12, spread: 0, color: 'rgba(0,0,0,0.15)', inset: false, unit: 'px' };
}

@Component({
    selector: 'mg-shadow-editor',
    templateUrl: './shadow-editor.component.html',
    styleUrl: './shadow-editor.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, MagmaInput, MagmaInputElement, MagmaInputRange, MagmaInputText],
})
export class MagmaShadowEditor {
    readonly valueChange = output<string>();
    readonly labels = input<ShadowEditorLabels>(DEFAULT_SHADOW_LABELS);
    readonly lengthUnits = LENGTH_UNITS;

    readonly layers = signal<ShadowLayer[]>([defaultLayer()]);

    readonly cssValue = computed(() => {
        return this.layers()
            .map(l => {
                const u = l.unit;
                const inset = l.inset ? 'inset ' : '';
                return `${inset}${l.offsetX}${u} ${l.offsetY}${u} ${l.blur}${u} ${l.spread}${u} ${l.color}`;
            })
            .join(', ');
    });

    addLayer(): void {
        this.layers.update(layers => [...layers, defaultLayer()]);
        this.emit();
    }

    removeLayer(index: number): void {
        this.layers.update(layers => layers.filter((_, i) => i !== index));
        this.emit();
    }

    updateLayer(index: number, field: keyof ShadowLayer, value: any): void {
        this.layers.update(layers => layers.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
        this.emit();
    }

    copyValue(): void {
        navigator.clipboard.writeText(this.cssValue());
    }

    private emit(): void {
        // Use setTimeout to let the computed update
        setTimeout(() => this.valueChange.emit(this.cssValue()));
    }
}
