import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';
import {
    FormBuilderExtended,
    MagmaInput,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputSelect,
    MagmaSpinner,
    MagmaTableModule,
    MagmaTabsModule,
    SpinnerType,
} from '@ikilote/magma';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-spinner',
    templateUrl: './demo-spinner.component.html',
    styleUrl: './demo-spinner.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        CodeTabsComponent,
        ReactiveFormsModule,
        MagmaSpinner,
        MagmaInput,
        MagmaInputElement,
        MagmaInputNumber,
        MagmaInputSelect,
        MagmaTabsModule,
        MagmaTableModule,
    ],
})
export class DemoSpinnerComponent {
    readonly fb = inject(FormBuilderExtended);

    ctrlForm: FormGroup<{
        type: FormControl<SpinnerType>;
        size: FormControl<number>;
        tickWidth: FormControl<number>;
        strokeWidth: FormControl<number>;
        dotSize: FormControl<number>;
        barWidth: FormControl<number>;
        barHeight: FormControl<number>;
        radius: FormControl<number>;
    }>;

    readonly typeOptions = [
        { value: 'ticks', label: 'Ticks' },
        { value: 'ring', label: 'Ring' },
        { value: 'dots', label: 'Dots' },
        { value: 'bar', label: 'Bar' },
        { value: 'pulse', label: 'Pulse' },
    ];

    get currentType(): SpinnerType {
        return this.ctrlForm?.value.type ?? 'ticks';
    }

    get isTicks(): boolean {
        return this.currentType === 'ticks';
    }
    get isRing(): boolean {
        return this.currentType === 'ring';
    }
    get isDots(): boolean {
        return this.currentType === 'dots';
    }
    get isBar(): boolean {
        return this.currentType === 'bar';
    }
    get isPulse(): boolean {
        return this.currentType === 'pulse';
    }

    codeHtml = '';

    codeTs = `import { MagmaSpinner } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    styleUrl: './my-component.component.scss',
    imports: [MagmaSpinner],
})
export class MyComponent {}`;

    constructor() {
        this.ctrlForm = this.fb.groupWithError({
            type: { default: 'ticks' as SpinnerType },
            size: { default: 0, emptyOnInit: true },
            tickWidth: { default: 0, emptyOnInit: true },
            strokeWidth: { default: 0, emptyOnInit: true },
            dotSize: { default: 0, emptyOnInit: true },
            barWidth: { default: 0, emptyOnInit: true },
            barHeight: { default: 0, emptyOnInit: true },
            radius: { default: 0, emptyOnInit: true },
        });
        this.codeGeneration();
        this.ctrlForm.valueChanges.subscribe(() => this.codeGeneration());
    }

    codeGeneration() {
        const json: Json2htmlRef = { tag: 'mg-spinner', attrs: {} };
        const attrs: Json2htmlAttr = json.attrs!;
        const value = this.ctrlForm.value;

        if (value.type && value.type !== 'ticks') {
            attrs['type'] = value.type;
        }

        switch (value.type) {
            case 'ticks':
                if (value.size) {
                    attrs['size'] = value.size;
                }
                if (value.tickWidth) {
                    attrs['tickWidth'] = value.tickWidth;
                }
                if (value.radius) {
                    attrs['radius'] = value.radius;
                }
                break;
            case 'ring':
                if (value.size) {
                    attrs['size'] = value.size;
                }
                if (value.strokeWidth) {
                    attrs['strokeWidth'] = value.strokeWidth;
                }
                break;
            case 'dots':
                if (value.size) {
                    attrs['size'] = value.size;
                }
                if (value.dotSize) {
                    attrs['dotSize'] = value.dotSize;
                }
                break;
            case 'bar':
                if (value.barWidth) {
                    attrs['barWidth'] = value.barWidth;
                }
                if (value.barHeight) {
                    attrs['barHeight'] = value.barHeight;
                }
                if (value.radius) {
                    attrs['radius'] = value.radius;
                }
                break;
            case 'pulse':
                if (value.size) {
                    attrs['size'] = value.size;
                }
                break;
        }

        this.codeHtml = new Json2html(json).toString();
    }
}
