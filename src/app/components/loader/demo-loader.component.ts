import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2Js, Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';

import { Select2Data } from 'ng-select2-component';

import {
    FileSizePipeParams,
    FormBuilderExtended,
    MagmaInput,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputSelect,
    MagmaInputText,
    MagmaLoader,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-loader',
    templateUrl: './demo-loader.component.html',
    styleUrls: ['./demo-loader.component.scss'],
    imports: [
        CodeTabsComponent,
        ReactiveFormsModule,
        MagmaLoader,
        MagmaInput,
        MagmaInputElement,
        MagmaInputNumber,
        MagmaInputText,
        MagmaInputSelect,
    ],
})
export class DemoLoaderComponent {
    readonly fb = inject(FormBuilderExtended);

    ctrlForm: FormGroup<{
        message: FormControl<string>;
        progressLoaded: FormControl<number>;
        progressTotal: FormControl<number>;
        progressSizeFormat: FormControl<FileSizePipeParams>;
    }>;

    progressSizeFormatData: Select2Data = [
        { label: 'undefined', value: {} },
        { label: "{ format: 'decimal' }", value: { format: 'decimal' } },
        {
            label: "{ language: 'fr', translate: { unitTableBinary: [' o', ' Kio', ' Mio', ' Gio', ' Tio'] }",
            value: { language: 'fr', translate: { unitTableBinary: [' o', ' Kio', ' Mio', ' Gio', ' Tio'] } },
        },
    ];

    codeHtml = '';

    constructor() {
        this.ctrlForm = this.fb.groupWithErrorNonNullable({
            message: { default: undefined },
            progressLoaded: { default: undefined },
            progressTotal: { default: undefined },
            progressSizeFormat: { default: undefined },
        });
        this.codeGeneration();
        this.ctrlForm.valueChanges.subscribe(() => {
            this.codeGeneration();
        });
    }

    codeGeneration() {
        // tag root

        const json: Json2htmlRef = {
            tag: 'mg-loader',
            attrs: {},
        };
        const attrs: Json2htmlAttr = json.attrs!;

        // tag attr

        const value = this.ctrlForm.value;

        if (value.message) {
            attrs['message'] = value.message;
        }
        if (value.progressLoaded || value.progressTotal === 0) {
            attrs['progressLoaded'] = value.progressLoaded;
        }
        if (value.progressTotal) {
            attrs['progressTotal'] = value.progressTotal;
        }
        if (
            value.progressSizeFormat &&
            ('format' in value.progressSizeFormat || 'language' in value.progressSizeFormat)
        ) {
            attrs['progressSizeFormat'] = new Json2Js(value.progressSizeFormat).toString().replaceAll('"', "'");
        }

        console.log(attrs['progressSizeFormat']);

        this.codeHtml = new Json2html(json).toString();
    }
}
