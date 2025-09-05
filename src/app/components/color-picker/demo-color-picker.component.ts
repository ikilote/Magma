import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2Js, Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';

import { MagmaInputCheckbox } from '../../../../projects/ikilote/magma/src/lib/components/input/input-checkbox.component';
import {
    FormBuilderExtended,
    MagmaColorPicker,
    MagmaColorPickerComponent,
    MagmaColorPickerTexts,
    MagmaInput,
    MagmaInputElement,
    MagmaInputText,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

export const palette = [
    '#2a1724',
    '#754589',
    '#837389',
    '#c8c4c2',
    '#9f7531',
    '#ffc107',
    '#4caf50',
    '#00bcd4',
    '#2e7d32',
    '#00796b',
    '#ee34d2',
    '#50bfe6',
    '#ccff00',
    '#ffcc33',
    '#fd5b78',
    '#bb00bb',
    '#dd11ee',
    '#bbaadd',
    '#ddaadd',
    '#bbeeee',
    '#b4fdf7',
    '#1981da',
    '#3b55b1',
    '#0d0133',
    '#8696a9',
    '#b26f38',
    '#313690',
    '#020202',
    '#a22581',
    '#c9a56c',
    '#c8640a',
    '#aa320a',
    '#8c8264',
    '#505a64',
    '#283c1e',
    '#c9d6c7',
    '#beccbc',
    '#a6b9a8',
    '#607066',
    '#354f44',
    '#db281c',
    '#06acde',
    '#ffec02',
    '#fe0000',
    '#06acde',
];

export const texts: MagmaColorPickerTexts = {
    hsl: 'TSL',
    palette: 'パレット',
};

@Component({
    selector: 'demo-color-picker',
    templateUrl: './demo-color-picker.component.html',
    styleUrls: ['./demo-color-picker.component.scss'],
    imports: [
        CodeTabsComponent,
        ReactiveFormsModule,
        MagmaColorPickerComponent,
        MagmaColorPicker,
        MagmaInput,
        MagmaInputElement,
        MagmaInputText,
        MagmaInputCheckbox,
    ],
})
export class DemoColorPickerComponent {
    readonly fb = inject(FormBuilderExtended);

    ctrlForm: FormGroup<{
        color: FormControl<string>;
        alpha: FormControl<boolean>;
        readonly: FormControl<boolean>;
        clearButton: FormControl<boolean>;
        palette: FormControl<boolean>;
        texts: FormControl<boolean>;
    }>;
    ctrlFormPopup: FormGroup<{
        color: FormControl<string>;
        alpha: FormControl<boolean>;
        disabled: FormControl<boolean>;
        readonly: FormControl<boolean>;
        clearButton: FormControl<boolean>;
        palette: FormControl<boolean>;
        texts: FormControl<boolean>;
    }>;

    colorChangeValue = '';
    colorCloseValue = '';

    palette = palette;
    texts = texts;

    codeHtml = '';
    codeTs = `import { MagmaColorPickerComponent } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    styleUrls: ['./my-component.component.scss'],
    imports: [
        MagmaColorPickerComponent
    ],
})
export class DemoBlockComponent { }`;

    codeHtmlPopup = '';
    codeTsPopup = `import { MagmaColorPicker } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    styleUrls: ['./my-component.component.scss'],
    imports: [
        MagmaColorPicker
    ],
})
export class DemoBlockComponent { }`;

    constructor() {
        this.ctrlForm = this.fb.groupWithErrorNonNullable({
            color: { default: '' },
            alpha: { default: true },
            readonly: { default: false },
            clearButton: { default: false },
            palette: { default: false },
            texts: { default: false },
        });
        this.ctrlFormPopup = this.fb.groupWithErrorNonNullable({
            color: { default: '' },
            alpha: { default: true },
            disabled: { default: false },
            readonly: { default: false },
            clearButton: { default: false },
            palette: { default: false },
            texts: { default: false },
        });
        this.codeGeneration();
        this.codeGenerationPopup();
        this.ctrlForm.valueChanges.subscribe(() => {
            this.codeGeneration();
        });
        this.ctrlFormPopup.valueChanges.subscribe(() => {
            this.codeGenerationPopup();
        });
    }

    test(data: string, action: string) {
        console.log(data, action);
    }

    codeGeneration() {
        console.log(this.ctrlForm.value);
        // tag root

        const json: Json2htmlRef = {
            tag: 'color-picker',
            attrs: {},
        };
        const attrs: Json2htmlAttr = json.attrs!;

        // tag attr

        if (this.ctrlForm.value.color) {
            attrs['color'] = this.ctrlForm.value.color;
        }
        if (this.ctrlForm.value.alpha) {
            attrs['alpha'] = null;
        }
        if (this.ctrlForm.value.readonly) {
            attrs['readonly'] = null;
        }
        if (this.ctrlForm.value.clearButton) {
            attrs['clearButton'] = null;
        }
        if (this.ctrlForm.value.palette) {
            attrs['[palette]'] = `['${this.palette}']`.replaceAll(',#', "', '#");
        }
        if (this.ctrlForm.value.texts) {
            attrs['[texts]'] = new Json2Js(this.texts).toString();
        }

        attrs['(colorChange)'] = 'colorChange($event)';

        this.codeHtml = new Json2html(json).toString();
    }

    codeGenerationPopup() {
        // tag root

        const json: Json2htmlRef = {
            tag: 'button',
            attrs: {},
            body: ['Click me'],
        };
        const attrs: Json2htmlAttr = json.attrs!;

        // tag attr

        attrs['colorPicker'] = this.ctrlFormPopup.value.color ? this.ctrlFormPopup.value.color : null;

        if (this.ctrlFormPopup.value.alpha) {
            attrs['colorPickerAlpha'] = null;
        }
        if (this.ctrlFormPopup.value.disabled) {
            attrs['colorPickerDisabled'] = null;
        }
        if (this.ctrlFormPopup.value.readonly) {
            attrs['colorPickerReadonly'] = null;
        }
        if (this.ctrlFormPopup.value.clearButton) {
            attrs['colorPickerClearButton'] = null;
        }
        if (this.ctrlFormPopup.value.palette) {
            attrs['[colorPickerPalette]'] = `['${this.palette}']`.replaceAll(',#', "', '#");
        }
        if (this.ctrlFormPopup.value.texts) {
            attrs['[colorPickerTexts]'] = new Json2Js(this.texts).toString();
        }

        attrs['(colorChange)'] = 'colorChange($event)';
        attrs['(colorClose)'] = 'colorClose($event)';

        this.codeHtmlPopup = new Json2html(json).toString();
    }

    colorChange(color: string) {
        this.colorChangeValue = color;
    }

    colorClose(color: string) {
        this.colorCloseValue = color;
        this.ctrlFormPopup.get('color')?.setValue(color);
    }
}
