import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';

import { Select2Data } from 'ng-select2-component';

import {
    FormBuilderExtended,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputColor,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputRadio,
    MagmaInputSelect,
    MagmaInputText,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-input-generator',
    templateUrl: './demo-input-generator.component.html',
    styleUrls: ['./demo-input-generator.component.scss'],
    imports: [
        MagmaInput,
        MagmaInputText,
        MagmaInputColor,
        MagmaInputRadio,
        MagmaInputElement,
        MagmaInputCheckbox,
        MagmaInputNumber,
        MagmaInputSelect,
        FormsModule,
        ReactiveFormsModule,
        CodeTabsComponent,
    ],
})
export class DemoInputGeneratorComponent {
    exampleData: Select2Data = [
        { label: 'test1', value: 'test1' },
        { label: 'test2', value: 'test2' },
    ];

    formGenerator: FormGroup<{
        label: FormControl<string>;
        desc: FormControl<string>;
        type: FormControl<string>;
        prefix: FormControl<string>;
        suffix: FormControl<string>;
        subLabel1: FormControl<string>;
        subValue1: FormControl<string>;
        subLabel2: FormControl<string>;
        subValue2: FormControl<string>;
        subLabel3: FormControl<string>;
        subValue3: FormControl<string>;
    }>;

    codeHtml = '';

    constructor(fbe: FormBuilderExtended, fb: FormBuilder) {
        this.formGenerator = fbe.groupWithErrorNonNullable({
            type: { default: 'text' },
            label: { default: '' },
            desc: { default: '' },
            prefix: { default: '' },
            suffix: { default: '' },
            subLabel1: { default: 'input label 1' },
            subValue1: { default: 'value1' },
            subLabel2: { default: 'input label 2' },
            subValue2: { default: 'value2' },
            subLabel3: { default: 'input label 3' },
            subValue3: { default: 'value3' },
        });
        this.codeGeneration();
        this.formGenerator.valueChanges.subscribe(() => {
            this.codeGeneration();
        });
    }

    codeGeneration() {
        const body: Json2htmlRef[] = [];

        const json: Json2htmlRef = {
            tag: 'mg-input',
            attrs: {},
            body,
        };
        const attrs: Json2htmlAttr = json.attrs!;

        if (this.formGenerator.value.label) {
            const jsonLabel: Json2htmlRef = {
                tag: 'mg-input-label',
                body: this.formGenerator.value.label,
                inline: true,
            };
            body.push(jsonLabel);
        }
        if (this.formGenerator.value.prefix) {
            const jsonLabel: Json2htmlRef = {
                tag: 'mg-input-prefix',
                body: this.formGenerator.value.prefix,
                inline: true,
            };
            body.push(jsonLabel);
        }
        if (this.formGenerator.value.type) {
            this.addType(
                body,
                this.formGenerator.value.type,
                this.formGenerator.value.subLabel1,
                this.formGenerator.value.subValue1,
            );

            if (
                (this.formGenerator.value.type === 'radio' || this.formGenerator.value.type === 'checkbox') &&
                this.formGenerator.value.subLabel1
            ) {
                this.addType(
                    body,
                    this.formGenerator.value.type,
                    this.formGenerator.value.subLabel2,
                    this.formGenerator.value.subValue2,
                );

                this.addType(
                    body,
                    this.formGenerator.value.type,
                    this.formGenerator.value.subLabel3,
                    this.formGenerator.value.subValue3,
                );
            }
        }

        if (this.formGenerator.value.label) {
            attrs['contextMenuDisabled'] = null;
        }

        if (this.formGenerator.value.suffix) {
            const jsonLabel: Json2htmlRef = {
                tag: 'mg-input-suffix',
                body: this.formGenerator.value.suffix,
                inline: true,
            };
            body.push(jsonLabel);
        }

        if (this.formGenerator.value.desc) {
            const jsonDesc: Json2htmlRef = {
                tag: 'mg-input-desc',
                body: this.formGenerator.value.desc,
                inline: true,
            };
            body.push(jsonDesc);
        }

        this.codeHtml = new Json2html(json).toString();
    }

    addType(body: Json2htmlRef[], type: string, label?: string, value?: string) {
        const bodyInput: string[] = [];
        const attrInput: Json2htmlAttr = {};
        const jsonInput: Json2htmlRef = {
            tag: 'mg-input-' + type,
            attrs: attrInput,
            body: bodyInput,
        };

        if ((type === 'radio' || type === 'checkbox') && (value || label)) {
            if (label) {
                bodyInput.push(label);
            }
            attrInput['value'] = value;
        }
        body.push(jsonInput);
    }
}
