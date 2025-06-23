import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2Js, Json2html, Json2htmlAttr, Json2htmlBody, Json2htmlRef } from '@ikilote/json2html';

import { Select2Data } from 'ng-select2-component';

import { MagmaInputCheckbox } from '../../../../projects/ikilote/magma/src/lib/components/input/input-checkbox.component';
import {
    FileSizePipeParams,
    FormBuilderExtended,
    MagmaInput,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputSelect,
    MagmaInputText,
    MagmaLoader,
    MagmaLoaderMessage,
    MagmaProgress,
    MagmaSpinner,
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
        MagmaLoaderMessage,
        MagmaSpinner,
        MagmaProgress,
        MagmaInput,
        MagmaInputElement,
        MagmaInputNumber,
        MagmaInputText,
        MagmaInputSelect,
        MagmaInputCheckbox,
    ],
})
export class DemoLoaderComponent {
    readonly fb = inject(FormBuilderExtended);

    ctrlForm: FormGroup<{
        message: FormControl<string>;
        loading: FormControl<boolean>;
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
            loading: { default: false },
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
        const value = this.ctrlForm.value;
        // tag root

        const body: Json2htmlBody = [];

        const json: Json2htmlRef = {
            tag: 'mg-loader',
            attrs: { '[loading]': value.loading ? 'true' : 'false' },
            body,
        };
        const attrs: Json2htmlAttr = json.attrs!;

        // tag attr

        body.push({
            tag: 'mg-spiner',
        });
        if (value.message) {
            body.push({
                tag: 'mg-loader-message',
                body: value.message,
            });
        }

        if (value.progressLoaded || value.progressTotal) {
            const attrsProgress: Json2htmlAttr = {};

            body.push({
                tag: 'mg-progress',
                attrs: attrsProgress,
                body: value.message,
            });

            if (value.progressLoaded || value.progressTotal === 0) {
                attrsProgress['loaded'] = value.progressLoaded;
            }
            if (value.progressTotal) {
                attrsProgress['total'] = value.progressTotal;
            }
            if (
                value.progressSizeFormat &&
                ('format' in value.progressSizeFormat || 'language' in value.progressSizeFormat)
            ) {
                attrsProgress['sizeFormat'] = new Json2Js(value.progressSizeFormat).toString().replaceAll('"', "'");
            }
        }

        console.log(attrs['progressSizeFormat']);

        this.codeHtml = new Json2html(json).toString();
    }
}
