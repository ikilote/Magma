import { JsonPipe } from '@angular/common';
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
        JsonPipe,
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
        type: FormControl<'text' | 'color' | 'checkbox' | 'radio' | 'number' | 'select'>;
        prefix: FormControl<string>;
        suffix: FormControl<string>;

        // radio / checkbox
        subLabel1: FormControl<string>;
        subValue1: FormControl<string>;
        subLabel2: FormControl<string>;
        subValue2: FormControl<string>;
        subLabel3: FormControl<string>;
        subValue3: FormControl<string>;
        multiple: FormControl<boolean>;

        // checkbox
        toggle: FormControl<boolean>;
        arrayValue: FormControl<boolean>;

        // number
        showArrows: FormControl<boolean>;
        step: FormControl<number>;

        // color
        alpha: FormControl<boolean>;
    }>;

    valueText = 'Test';
    valueNumber = 20;
    valueCheckbox = ['value2'];
    valueRadio = 'value2';
    valueSelect = 'test2';
    valueColor = 'yellow';

    codeHtml = '';
    codeTs = '';

    constructor(fbe: FormBuilderExtended, fb: FormBuilder) {
        this.formGenerator = fbe.groupWithErrorNonNullable({
            type: { default: 'text' },
            label: { default: '' },
            desc: { default: '' },
            prefix: { default: '' },
            suffix: { default: '' },
            // radio / checkbox
            subLabel1: { default: 'input label 1' },
            subValue1: { default: 'value1' },
            subLabel2: { default: 'input label 2' },
            subValue2: { default: 'value2' },
            subLabel3: { default: 'input label 3' },
            subValue3: { default: 'value3' },
            multiple: { default: false },
            // checkbox
            toggle: { default: false },
            arrayValue: { default: false },
            // number
            showArrows: { default: false },
            step: { default: undefined },
            // color
            alpha: { default: false },
        });
        this.codeGeneration();
        this.formGenerator.valueChanges.subscribe(() => {
            this.codeGeneration();
        });
    }

    codeGeneration() {
        const value = this.formGenerator.value;
        const body: Json2htmlRef[] = [];
        const attrInput: Json2htmlAttr = {};

        const json: Json2htmlRef = {
            tag: 'mg-input',
            attrs: attrInput,
            body,
        };
        const attrs: Json2htmlAttr = json.attrs!;

        if (value.type === 'checkbox') {
            if (value.arrayValue) {
                attrInput['arrayValue'] = null;
            }
        }

        if (value.label) {
            const jsonLabel: Json2htmlRef = {
                tag: 'mg-input-label',
                body: value.label,
                inline: true,
            };
            body.push(jsonLabel);
        }
        if (value.prefix) {
            const jsonLabel: Json2htmlRef = {
                tag: 'mg-input-prefix',
                body: value.prefix,
                inline: true,
            };
            body.push(jsonLabel);
        }
        if (value.type) {
            this.addType(body, value.type, value.subLabel1, value.subValue1);

            if ((value.type === 'radio' || (value.type === 'checkbox' && value.multiple)) && value.subLabel1) {
                this.addType(body, value.type, value.subLabel2, value.subValue2);

                this.addType(body, value.type, value.subLabel3, value.subValue3);
            }
        }

        if (value.label) {
            attrs['contextMenuDisabled'] = null;
        }

        if (value.suffix) {
            const jsonLabel: Json2htmlRef = {
                tag: 'mg-input-suffix',
                body: value.suffix,
                inline: true,
            };
            body.push(jsonLabel);
        }

        if (value.desc) {
            const jsonDesc: Json2htmlRef = {
                tag: 'mg-input-desc',
                body: value.desc,
                inline: true,
            };
            body.push(jsonDesc);
        }

        this.codeHtml = new Json2html(json).toString();

        // ------------------- TS --------------------------------------

        const imports = [];
        let data = '';
        switch (value.type) {
            case 'text':
                imports.push(`MagmaInputText`);
                break;
            case 'color':
                imports.push(`MagmaInputColor`);
                break;
            case 'radio':
                imports.push(`MagmaInputRadio`);
                break;
            case 'checkbox':
                imports.push(`MagmaInputCheckbox`);
                break;
            case 'number':
                imports.push(`MagmaInputNumber`);
                break;
            case 'select':
                imports.push(`MagmaInputSelect`);
                data += `data: Select2Data = [
        { label: 'test1', value: 'test1' },
        { label: 'test2', value: 'test2' },
    ];`;
                break;
        }
        if (value.label || value.desc) {
            imports.push(`MagmaInputElement`);
        }

        this.codeTs = `@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    styleUrls: ['./my-component.component.scss'],
    imports: [
        MagmaInput,
        ${imports.join(',\n        ')}
    ],
})
export class DemoInputGeneratorComponent {
    ${data}
}
`;
    }

    addType(body: Json2htmlRef[], type: string, label?: string, value?: string) {
        const fgValue = this.formGenerator.value;
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
            if (type === 'checkbox' && fgValue.toggle) {
                attrInput['mode'] = 'toggle';
            }
        } else if (type === 'select') {
            attrInput['[data]'] = 'data';
        } else if (type === 'number') {
            if ((fgValue.step || 0) > 0) {
                attrInput['[step]'] = fgValue.step;
            }
            if (fgValue.showArrows) {
                attrInput['showArrows'] = null;
            }
        } else if (type === 'color') {
            if (fgValue.alpha) {
                attrInput['alpha'] = null;
            }
        }
        body.push(jsonInput);
    }
}
