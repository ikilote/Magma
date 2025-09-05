import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';

import {
    FormBuilderExtended,
    MagmaDialog,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputText,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-dialog',
    templateUrl: './demo-dialog.component.html',
    styleUrls: ['./demo-dialog.component.scss'],
    imports: [
        CodeTabsComponent,
        ReactiveFormsModule,
        MagmaDialog,
        MagmaInput,
        MagmaInputElement,
        MagmaInputCheckbox,
        MagmaInputText,
    ],
})
export class DemoDialogComponent {
    readonly fb = inject(FormBuilderExtended);

    ctrlForm: FormGroup<{
        closeButton: FormControl<boolean>;
        closeBackdrop: FormControl<boolean>;
        title: FormControl<string>;
        label: FormControl<string>;
    }>;

    codeHtml = '';
    codeTs = `import { MagmaDialog } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    styleUrls: ['./my-component.component.scss'],
    imports: [
        MagmaDialog
    ],
})
export class DemoBlockComponent { }`;

    constructor() {
        this.ctrlForm = this.fb.groupWithErrorNonNullable({
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

    codeGeneration() {
        // tag root

        const json: Json2htmlRef = {
            tag: 'mg-dialog',
            attrs: { '#dialog': null },
            body: [
                {
                    tag: 'p',
                    body: 'Content dialog',
                },
                {
                    tag: 'p',
                    body: {
                        tag: 'button',
                        attrs: { '(click)': 'dialog.close()' },
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
