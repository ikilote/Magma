import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';

import {
    AbstractWindowComponent,
    FormBuilderExtended,
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
        // MagmaInput,
        // MagmaInputElement,
        // MagmaInputCheckbox,
        // MagmaInputText,
    ],
})
export class DemoWindowComponent {
    readonly fb = inject(FormBuilderExtended);
    readonly windows = inject(MagmaWindows);

    ctrlForm: FormGroup<{
        closeButton: FormControl<boolean>;
        closeBackdrop: FormControl<boolean>;
        title: FormControl<string>;
        label: FormControl<string>;
    }>;

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
        this.ctrlForm = this.fb.groupWithError({
            closeButton: { default: true },
            closeBackdrop: { default: false },
            title: { default: '' },
            label: { default: '' },
        });
        this.codeGeneration();
        this.ctrlForm.valueChanges.subscribe(() => {
            this.codeGeneration();
        });
    }

    openWindow() {
        this.windows.openWindow(TestWindowComponent);
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

        if (this.ctrlForm.value.closeButton) {
            attrs['closeButton'] = null;
        }

        if (this.ctrlForm.value.closeBackdrop) {
            attrs['closeBackdrop'] = null;
        }

        if (this.ctrlForm.value.title) {
            attrs['title'] = this.ctrlForm.value.title;
        }

        if (this.ctrlForm.value.label) {
            attrs['label'] = this.ctrlForm.value.label;
        }

        this.codeHtml = new Json2html(json).toString();
    }
}
