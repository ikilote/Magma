import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';

import { MagmaDialog } from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-dialog',
    templateUrl: './demo-dialog.component.html',
    styleUrls: ['./demo-dialog.component.scss'],
    imports: [MagmaDialog, FormsModule, CodeTabsComponent, ReactiveFormsModule],
})
export class DemoDialogComponent {
    ctrlForm: FormGroup<{
        closeButton: FormControl<boolean>;
        closeBackdrop: FormControl<boolean>;
    }>;

    codeHtml = '';

    constructor(fb: NonNullableFormBuilder) {
        this.ctrlForm = fb.group({
            closeButton: new FormControl<boolean>(true, { nonNullable: true }),
            closeBackdrop: new FormControl<boolean>(false, { nonNullable: true }),
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
