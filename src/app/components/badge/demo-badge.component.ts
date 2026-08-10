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
        { name: '--badge-radius', value: '12px' },
        { name: '--badge-padding', value: '2px 10px' },
        { name: '--badge-small-font-size', value: 'var(--font-very-small)' },
        { name: '--badge-small-padding', value: '1px 6px' },
        { name: '--badge-large-font-size', value: 'var(--font-small)' },
        { name: '--badge-large-padding', value: '2px 10px' },
        { name: '--badge-font-size-small', value: 'var(--font-very-small)' },
        { name: '--badge-neutral-background', value: 'var(--neutral300)' },
        { name: '--badge-neutral-color', value: 'contrast-color(var(--neutral300))' },
        { name: '--badge-primary-background', value: 'var(--primary500)' },
        { name: '--badge-primary-color', value: 'contrast-color(var(--primary500))' },
        { name: '--badge-success-background', value: 'var(--success500)' },
        { name: '--badge-success-color', value: 'contrast-color(var(--success500))' },
        { name: '--badge-warning-background', value: 'var(--warn500)' },
        { name: '--badge-warning-color', value: 'contrast-color(var(--warn500))' },
        { name: '--badge-alert-background', value: 'var(--alert500)' },
        { name: '--badge-alert-color', value: 'contrast-color(var(--alert500))' },
        { name: '--badge-info-background', value: 'var(--primary200)' },
        { name: '--badge-info-color', value: 'contrast-color(var(--primary200))' },
        { name: '--badge-background-label-dark', value: 'black 50%' },
        { name: '--badge-background-label-light', value: 'white 50%' },
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
        if (this.ctrlForm.value.luminosity !== 'dark') {
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
