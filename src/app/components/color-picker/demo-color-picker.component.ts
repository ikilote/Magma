import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';

import { MagmaInputCheckbox } from '../../../../projects/ikilote/magma/src/lib/components/input/input-checkbox.component';
import {
    FormBuilderExtended,
    MagmaColorPicker,
    MagmaColorPickerComponent,
    MagmaInput,
    MagmaInputElement,
    MagmaInputText,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

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
    }>;
    ctrlFormPopup: FormGroup<{
        color: FormControl<string>;
        alpha: FormControl<boolean>;
        disabled: FormControl<boolean>;
        readonly: FormControl<boolean>;
    }>;

    codeHtml = '';
    codeHtmlPopup = '';

    colorChangeValue = '';
    colorCloseValue = '';

    constructor() {
        this.ctrlForm = this.fb.groupWithErrorNonNullable({
            color: { default: '' },
            alpha: { default: true },
            readonly: { default: false },
        });
        this.ctrlFormPopup = this.fb.groupWithErrorNonNullable({
            color: { default: '' },
            alpha: { default: true },
            disabled: { default: false },
            readonly: { default: false },
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
