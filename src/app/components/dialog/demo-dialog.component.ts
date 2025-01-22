import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';

import {
    FormBuilderExtended,
    MagmaDialog,
    MagmaInput,
    MagmaInputElement,
    MagmaInputRadio,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-dialog',
    templateUrl: './demo-dialog.component.html',
    styleUrls: ['./demo-dialog.component.scss'],
    imports: [
        FormsModule,
        CodeTabsComponent,
        ReactiveFormsModule,
        MagmaDialog,
        MagmaInput,
        MagmaInputElement,
        MagmaInputRadio,
    ],
})
export class DemoDialogComponent {
    readonly fb = inject(FormBuilderExtended);

    ctrlForm: FormGroup<{
        closeButton: FormControl<boolean>;
        closeBackdrop: FormControl<boolean>;
    }>;

    codeHtml = '';

    constructor() {
        this.ctrlForm = this.fb.groupWithErrorNonNullable({
            closeButton: { default: true },
            closeBackdrop: { default: false },
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
            attrs: {},
            body: ['Content dialog'],
        };
        const attrs: Json2htmlAttr = json.attrs!;

        // tag attr

        if (this.ctrlForm.value.closeButton) {
            attrs['closeButton'] = null;
        }

        if (this.ctrlForm.value.closeBackdrop) {
            attrs['contextMenuDisabled'] = null;
        }

        this.codeHtml = new Json2html(json).toString();
    }
}
