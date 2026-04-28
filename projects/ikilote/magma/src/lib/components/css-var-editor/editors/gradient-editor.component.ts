import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MagmaInputElement } from '../../input/input-element.component';
import { MagmaInputRange } from '../../input/input-range.component';
import { MagmaInputText } from '../../input/input-text.component';
import { MagmaInput } from '../../input/input.component';
import { DEFAULT_GRADIENT_LABELS, GradientEditorLabels } from '../css-var-editor.labels';

export interface GradientStop {
    color: string;
    position: number;
}

export type GradientType = 'linear' | 'radial' | 'conic' | 'repeating-linear' | 'repeating-radial' | 'repeating-conic';

@Component({
    selector: 'mg-gradient-editor',
    templateUrl: './gradient-editor.component.html',
    styleUrl: './gradient-editor.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, MagmaInput, MagmaInputElement, MagmaInputRange, MagmaInputText],
})
export class MagmaGradientEditor {
    readonly valueChange = output<string>();
    readonly labels = input<GradientEditorLabels>(DEFAULT_GRADIENT_LABELS);

    readonly type = signal<GradientType>('linear');
    readonly angle = signal(90);
    readonly stops = signal<GradientStop[]>([
        { color: '#ffffff', position: 0 },
        { color: '#000000', position: 100 },
    ]);

    readonly cssValue = computed(() => {
        const stopsStr = this.stops()
            .map(s => `${s.color} ${s.position}%`)
            .join(', ');

        switch (this.type()) {
            case 'radial':
            case 'repeating-radial':
                return `${this.type()}-gradient(circle, ${stopsStr})`;
            case 'conic':
            case 'repeating-conic':
                return `${this.type()}-gradient(from ${this.angle()}deg, ${stopsStr})`;
            default:
                return `${this.type()}-gradient(${this.angle()}deg, ${stopsStr})`;
        }
    });

    setType(type: GradientType): void {
        this.type.set(type);
        this.emit();
    }

    setAngle(value: number): void {
        this.angle.set(value);
        this.emit();
    }

    updateStop(index: number, field: keyof GradientStop, value: any): void {
        this.stops.update(stops => stops.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
        this.emit();
    }

    addStop(): void {
        this.stops.update(stops => [...stops, { color: '#888888', position: 50 }]);
        this.emit();
    }

    removeStop(index: number): void {
        this.stops.update(stops => stops.filter((_, i) => i !== index));
        this.emit();
    }

    copyValue(): void {
        navigator.clipboard.writeText(this.cssValue());
    }

    private emit(): void {
        setTimeout(() => this.valueChange.emit(this.cssValue()));
    }
}
