import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';

import { MagmaColorPicker, MagmaColorPickerComponent } from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-color-picker',
    templateUrl: './demo-color-picker.component.html',
    styleUrls: ['./demo-color-picker.component.scss'],
    imports: [MagmaColorPickerComponent, MagmaColorPicker, FormsModule, CodeTabsComponent, ReactiveFormsModule],
})
export class DemoColorPickerComponent {
    readonly fb = inject(NonNullableFormBuilder);

    ctrlForm: FormGroup<{
        color: FormControl<string>;
        alpha: FormControl<boolean>;
    }>;
    ctrlFormPopup: FormGroup<{
        color: FormControl<string>;
        alpha: FormControl<boolean>;
        disabled: FormControl<boolean>;
    }>;

    codeHtml = '';
    codeHtmlPopup = '';

    colorChangeValue = '';
    colorCloseValue = '';

    constructor() {
        this.ctrlForm = this.fb.group({
            color: new FormControl<string>('', { nonNullable: true }),
            alpha: new FormControl<boolean>(true, { nonNullable: true }),
        });
        this.ctrlFormPopup = this.fb.group({
            color: new FormControl<string>('', { nonNullable: true }),
            alpha: new FormControl<boolean>(true, { nonNullable: true }),
            disabled: new FormControl<boolean>(false, { nonNullable: true }),
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

        attrs['(colorChange)'] = 'colorChange($event)';

        this.codeHtml = new Json2html(json).toString();
    }

    codeGenerationPopup() {
        // tag root

        const json: Json2htmlRef = {
            tag: 'div',
            attrs: {},
            body: ['Click me'],
        };
        const attrs: Json2htmlAttr = json.attrs!;

        // tag attr

        if (this.ctrlFormPopup.value.color) {
            attrs['colorPicker'] = this.ctrlFormPopup.value.color;
        } else {
            attrs['colorPicker'] = null;
        }

        if (this.ctrlFormPopup.value.alpha) {
            attrs['colorPickerAlpha'] = null;
        }

        if (this.ctrlFormPopup.value.disabled) {
            attrs['colorPickerDisabled'] = null;
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
