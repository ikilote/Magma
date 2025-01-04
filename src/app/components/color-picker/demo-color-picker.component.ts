import { Component } from '@angular/core';
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
    ctrlForm: FormGroup<{
        contextMenuDisabled: FormControl<boolean>;
    }>;

    codeHtml = '';
    codeTs = ` `;

    color = '';

    constructor(fb: NonNullableFormBuilder) {
        this.ctrlForm = fb.group({
            contextMenuDisabled: new FormControl<boolean>(false, { nonNullable: true }),
        });
        this.codeGeneration();
        this.ctrlForm.valueChanges.subscribe(() => {
            this.codeGeneration();
        });
    }

    test(data: string, action: string) {
        console.log(data, action);
    }

    codeGeneration() {
        // tag root

        const json: Json2htmlRef = {
            tag: 'div',
            attrs: {
                '[contextMenu]': 'contextMenu',
            },
            body: ['Right-click here to display the context menu.'],
        };
        const attrs: Json2htmlAttr = json.attrs!;

        // tag attr

        if (this.ctrlForm.value.contextMenuDisabled) {
            attrs['contextMenuDisabled'] = null;
        }

        this.codeHtml = new Json2html(json).toString();
    }

    updateColor(color: string) {
        this.color = color;
    }
}
