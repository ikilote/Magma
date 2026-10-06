import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';
import {
    FormBuilderExtended,
    MagmaBadge,
    MagmaBadgeLabel,
    MagmaInput,
    MagmaInputColor,
    MagmaInputElement,
    MagmaInputSelect,
    MagmaInputText,
    MagmaTableModule,
    MagmaTabsModule,
} from '@ikilote/magma';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-badge',
    templateUrl: './demo-badge.component.html',
    styleUrl: './demo-badge.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ReactiveFormsModule,
        CodeTabsComponent,
        MagmaBadge,
        MagmaBadgeLabel,
        MagmaInput,
        MagmaInputColor,
        MagmaInputElement,
        MagmaInputSelect,
        MagmaInputText,
        MagmaTabsModule,
        MagmaTableModule,
    ],
})
export class DemoBadgeComponent {
    readonly fb = inject(FormBuilderExtended);

    ctrlForm: FormGroup<{
        theme: FormControl<string>;
        size: FormControl<string>;
        luminosity: FormControl<string>;
        content: FormControl<string>;
        label: FormControl<string>;
        color: FormControl<string>;
    }>;

    readonly shapeOptions = [
        { value: 'pill', label: 'Pill' },
        { value: 'circle', label: 'Circle' },
        { value: 'dot', label: 'Dot' },
    ];

    readonly themeOptions = [
        { value: 'neutral', label: 'Neutral' },
        { value: 'primary', label: 'Primary' },
        { value: 'success', label: 'Success' },
        { value: 'warning', label: 'Warning' },
        { value: 'alert', label: 'Alert' },
        { value: 'info', label: 'Info' },
    ];

    readonly sizeOptions = [
        { value: 'small', label: 'Small' },
        { value: 'large', label: 'Large' },
    ];

    readonly luminosityOptions = [
        { value: 'dark', label: 'Dark' },
        { value: 'light', label: 'Light' },
    ];

    codeHtml = '';
    codeTs = `import { MagmaBadge } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    imports: [MagmaBadge],
})
export class MyComponent {}`;

    codeCss = [
        { name: '--mg-badge-radius', value: '12px' },
        { name: '--mg-badge-padding', value: '2px 10px' },
        { name: '--mg-badge-small-font-size', value: 'var(--mg-font-very-small)' },
        { name: '--mg-badge-small-padding', value: '1px 6px' },
        { name: '--mg-badge-large-font-size', value: 'var(--mg-font-small)' },
        { name: '--mg-badge-large-padding', value: '2px 10px' },
        { name: '--mg-badge-font-size-small', value: 'var(--mg-font-very-small)' },
        { name: '--mg-badge-neutral-background', value: 'var(--mg-neutral300)' },
        { name: '--mg-badge-neutral-color', value: 'contrast-color(var(--mg-neutral300))' },
        { name: '--mg-badge-primary-background', value: 'var(--mg-primary500)' },
        { name: '--mg-badge-primary-color', value: 'contrast-color(var(--mg-primary500))' },
        { name: '--mg-badge-success-background', value: 'var(--mg-success500)' },
        { name: '--mg-badge-success-color', value: 'contrast-color(var(--mg-success500))' },
        { name: '--mg-badge-warning-background', value: 'var(--mg-warn500)' },
        { name: '--mg-badge-warning-color', value: 'contrast-color(var(--mg-warn500))' },
        { name: '--mg-badge-alert-background', value: 'var(--mg-alert500)' },
        { name: '--mg-badge-alert-color', value: 'contrast-color(var(--mg-alert500))' },
        { name: '--mg-badge-info-background', value: 'var(--mg-primary200)' },
        { name: '--mg-badge-info-color', value: 'contrast-color(var(--mg-primary200))' },
        { name: '--mg-badge-background-label-dark', value: 'black 50%' },
        { name: '--mg-badge-background-label-light', value: 'white 50%' },
    ];

    constructor() {
        this.ctrlForm = this.fb.groupWithError({
            theme: { default: 'neutral' },
            size: { default: 'large' },
            luminosity: { default: 'dark' },
            content: { default: 'content' },
            label: { default: '' },
            color: { default: '' },
        });
        this.codeGeneration();
        this.ctrlForm.valueChanges.subscribe(() => {
            this.codeGeneration();
        });
    }

    codeGeneration() {
        const json: Json2htmlRef = {
            tag: 'mg-badge',
            attrs: {},
            body: [] as (string | Json2htmlRef)[],
        };
        const attrs: Json2htmlAttr = json.attrs!;
        const body = json.body as (string | Json2htmlRef)[];

        if (this.ctrlForm.value.theme !== 'neutral') {
            attrs['theme'] = this.ctrlForm.value.theme;
        }
        if (this.ctrlForm.value.size !== 'large') {
            attrs['size'] = this.ctrlForm.value.size;
        }
        if (this.ctrlForm.value.label && this.ctrlForm.value.luminosity !== 'dark') {
            attrs['luminosity'] = this.ctrlForm.value.luminosity;
        }

        if (this.ctrlForm.value.label) {
            body.push({ tag: 'mg-badge-label', body: this.ctrlForm.value.label });
        }
        body.push(this.ctrlForm.value.content || '');

        if (this.ctrlForm.value.color) {
            attrs['color'] = this.ctrlForm.value.color;
        }

        this.codeHtml = new Json2html(json).toString();
    }
}
