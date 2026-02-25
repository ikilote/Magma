import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';

import { Select2Data } from 'ng-select2-component';

import {
    AbstractWindowComponent,
    FormBuilderExtended,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputSelect,
    MagmaInputText,
    MagmaWindow,
    MagmaWindows,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    template: `<div></div>
        <button (click)="close()">Close</button>`,
    styleUrl: './demo-window.component.scss',
    imports: [],
})
export class TestWindowComponent extends AbstractWindowComponent {}

@Component({
    selector: 'demo-window',
    templateUrl: './demo-window.component.html',
    styleUrl: './demo-window.component.scss',
    imports: [
        CodeTabsComponent,
        ReactiveFormsModule,
        MagmaWindow,
        MagmaInput,
        MagmaInputElement,
        MagmaInputSelect,
        MagmaInputCheckbox,
        MagmaInputText,
    ],
})
export class DemoWindowComponent {
    readonly fb = inject(FormBuilderExtended);
    readonly windows = inject(MagmaWindows);

    ctrlForm: FormGroup<{}>;

    ctrlFormZone: FormGroup<{
        position: FormControl<'default' | 'center'>;
        bar: FormControl<boolean>;
        barTitle: FormControl<string>;
        barButtons: FormControl<boolean>;
    }>;

    position: Select2Data = [
        { label: 'default', value: 'default' },
        { label: 'center', value: 'center' },
    ];

    codeHtml = '';
    codeTs = `import { MagmaWindow } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    styleUrl: './my-component.component.scss',
    imports: [
        MagmaWindow
    ],
})
export class DemoBlockComponent { }`;

    constructor() {
        this.ctrlForm = this.fb.groupWithError({});
        this.ctrlFormZone = this.fb.groupWithError({
            position: { default: 'default' as 'default' | 'center' },
            bar: { default: true },
            barTitle: { default: 'Title' },
            barButtons: { default: true },
        });
        this.codeGeneration();
        this.ctrlForm.valueChanges.subscribe(() => {
            this.codeGeneration();
        });
    }

    openWindow() {
        this.windows.openWindow(TestWindowComponent, {
            position: this.ctrlFormZone.value.position,
            bar: {
                active: this.ctrlFormZone.value.bar,
                title: this.ctrlFormZone.value.barTitle,
                buttons: this.ctrlFormZone.value.barButtons,
            },
        });
    }

    codeGeneration() {
        // tag root

        const json: Json2htmlRef = {
            tag: 'mg-window',
            attrs: { '#window': null },
            body: [
                {
                    tag: 'p',
                    body: 'Content window',
                },
                {
                    tag: 'p',
                    body: {
                        tag: 'button',
                        attrs: { '(click)': 'window.close()' },
                        body: 'Close',
                    },
                },
            ],
        };
        const attrs: Json2htmlAttr = json.attrs!;

        // tag attr

        this.codeHtml = new Json2html(json).toString();
    }
}
