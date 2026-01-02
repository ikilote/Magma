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
    MagmaProgress,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-progress',
    templateUrl: './demo-progress.component.html',
    styleUrl: './demo-progress.component.scss',
    imports: [
        CodeTabsComponent,
        ReactiveFormsModule,
        MagmaProgress,
        MagmaInput,
        MagmaInputSelect,
        MagmaInputElement,
        MagmaInputNumber,
    ],
})
export class DemoProgressComponent {
    readonly fb = inject(FormBuilderExtended);

    sizeFormatData: Select2Data = [
        { label: 'undefined', value: {} },
        { label: "{ format: 'decimal' }", value: { format: 'decimal' } },
        {
            label: "{ language: 'fr', translate: { unitTableBinary: [' o', ' Kio', ' Mio', ' Gio', ' Tio'] }",
            value: { language: 'fr', translate: { unitTableBinary: [' o', ' Kio', ' Mio', ' Gio', ' Tio'] } },
        },
    ];

    ctrlForm: FormGroup<{
        loaded: FormControl<number>;
        total: FormControl<number>;
        sizeFormat: FormControl<FileSizePipeParams>;
    }>;

    codeHtml = '';

    codeTs = `import { MagmaProgress } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    styleUrl: './my-component.component.scss',
    imports: [
        MagmaProgress
    ],
})
export class DemoProgressComponent {
}`;

    constructor() {
        this.ctrlForm = this.fb.groupWithError({
            loaded: { default: 0, emptyOnInit: true },
            total: { default: 0, emptyOnInit: true },
            sizeFormat: { default: {} as FileSizePipeParams, emptyOnInit: true },
        });
        this.codeGeneration();
        this.ctrlForm.valueChanges.subscribe(() => {
            this.codeGeneration();
        });
    }

    codeGeneration() {
        // tag root

        const json: Json2htmlRef = {
            tag: 'mg-spinner',
            attrs: {},
        };
        const attrs: Json2htmlAttr = json.attrs!;

        // tag attr

        const value = this.ctrlForm.value;

        if (value.loaded || value.total === 0) {
            attrs['loaded'] = value.loaded;
        }
        if (value.total) {
            attrs['total'] = value.total;
        }
        if (value.sizeFormat && ('format' in value.sizeFormat || 'language' in value.sizeFormat)) {
            attrs['sizeFormat'] = new Json2Js(value.sizeFormat).toString().replaceAll('"', "'");
        }
        this.codeHtml = new Json2html(json).toString();
    }
}
