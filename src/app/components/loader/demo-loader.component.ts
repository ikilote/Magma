import { Component, inject, viewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    styleUrl: './demo-loader.component.scss',
    imports: [
        CodeTabsComponent,
        FormsModule,
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

    readonly loading = viewChild<MagmaLoader>('loader');

    loadingValue = false;

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
    codeTs = `import {
    MagmaLoader,
    MagmaLoaderMessage,
    MagmaSpinner,
    MagmaProgress
} from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    styleUrl: './my-component.component.scss',
    imports: [
        MagmaLoader,
        MagmaLoaderMessage,
        MagmaSpinner,
        MagmaProgress,
    ],
})
export class DemoMagmaProgressComponent {

    readonly loader = viewChild.required<MagmaLoader>('loader');

    loadingChange(event : boolean) {
        console.log('MagmaProgress loading', event)
    }

    loadingStart() {
        this.loader().start();
    }

    loadingStop() {
        this.loader().stop();
    }

}`;

    constructor() {
        this.ctrlForm = this.fb.groupWithError({
            message: { default: '' },
            progressLoaded: { default: 0, emptyOnInit: true },
            progressTotal: { default: 0, emptyOnInit: true },
            progressSizeFormat: { default: {} as FileSizePipeParams },
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
            attrs: {
                '#loader': null,
                '[loading]': this.loadingValue ? 'true' : 'false',
                '(loadingChange)': 'loadingChange($event)',
            },
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

        this.codeHtml = new Json2html(json).toString();
    }

    loadingChange(event: boolean) {
        console.log('MagmaProgress loading', event);
    }

    loadingStart() {
        this.loading()?.start();
    }

    loadingStop() {
        this.loading()?.stop();
    }
}
