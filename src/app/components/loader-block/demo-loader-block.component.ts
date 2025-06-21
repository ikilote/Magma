import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';

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

    examples: Select2Data = [{ label: 'example 1', value: 'example-1' }];

    codeHtml = '';

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

        switch (this.ctrlForm.value?.example) {
            case 'example-1':
                const json: Json2htmlRef = {
                    tag: 'mg-loader-block',

                    body: [
                        {
                            tag: 'mg-loader-tile',
                        },
                        {
                            tag: 'mg-loader-tile',
                        },
                    ],
                };
                const attrs: Json2htmlAttr = json.attrs!;

                this.codeHtml = new Json2html(json).toString();

                break;
        }
    }
}
