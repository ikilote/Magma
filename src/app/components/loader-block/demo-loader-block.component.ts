import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlRef } from '@ikilote/json2html';

import { Select2Data } from 'ng-select2-component';

import {
    FormBuilderExtended,
    MagmaInput,
    MagmaInputElement,
    MagmaInputSelect,
    MagmaLoaderBlock,
    MagmaLoaderTile,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-loader-block',
    templateUrl: './demo-loader-block.component.html',
    styleUrls: ['./demo-loader-block.component.scss'],
    imports: [
        CodeTabsComponent,
        ReactiveFormsModule,
        MagmaInput,
        MagmaInputElement,
        MagmaInputSelect,
        MagmaLoaderBlock,
        MagmaLoaderTile,
    ],
})
export class DemoLoaderBlockComponent {
    readonly fb = inject(FormBuilderExtended);

    ctrlForm: FormGroup<{
        example: FormControl<string>;
    }>;

    examples: Select2Data = [
        { label: 'example 1', value: 'example-1' },
        { label: 'example 2', value: 'example-2' },
    ];

    codeHtml = '';

    codeTs = `import { MagmaLoaderBlock, MagmaLoaderTile } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    styleUrls: ['./my-component.component.scss'],
    imports: [
        MagmaLoaderBlock,
        MagmaLoaderTile
    ],
})
export class DemoLoaderBlockComponent {
}`;

    constructor() {
        this.ctrlForm = this.fb.groupWithErrorNonNullable({
            example: { default: 'example-1' },
        });
        this.codeGeneration();
        this.ctrlForm.valueChanges.subscribe(() => {
            this.codeGeneration();
        });
    }

    codeGeneration() {
        // tag root
        let json: Json2htmlRef = {
            tag: 'mg-loader-block',
            body: [],
        };

        switch (this.ctrlForm.value?.example) {
            case 'example-1':
                json.body = [
                    {
                        tag: 'mg-loader-tile',
                    },
                    {
                        tag: 'mg-loader-tile',
                    },
                ];

                break;
            case 'example-2':
                json.body = [
                    {
                        tag: 'mg-loader-tile',
                        attrs: { size: '70px / 70px' },
                    },
                    {
                        tag: 'mg-loader-tile',
                        attrs: { size: '70px / 70px' },
                    },
                    {
                        tag: 'mg-loader-tile',
                        attrs: { size: 'flex / 70px' },
                    },
                    {
                        tag: 'mg-loader-tile',
                        attrs: { size: '100% / 70px' },
                    },
                ];

                break;
        }

        if (json) {
            this.codeHtml = new Json2html(json).toString();
        }
    }
}
