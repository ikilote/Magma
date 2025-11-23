import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';

import {
    FormBuilderExtended,
    MagmaInput,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaSpinner,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-spinner',
    templateUrl: './demo-spinner.component.html',
    styleUrls: ['./demo-spinner.component.scss'],
    imports: [CodeTabsComponent, ReactiveFormsModule, MagmaSpinner, MagmaInput, MagmaInputElement, MagmaInputNumber],
})
export class DemoSpinnerComponent {
    readonly fb = inject(FormBuilderExtended);

    ctrlForm: FormGroup<{
        size: FormControl<number>;
        tickWidth: FormControl<number>;
        radius: FormControl<number>;
    }>;

    codeHtml = '';

    codeTs = `import { MagmaSpinner } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    styleUrls: ['./my-component.component.scss'],
    imports: [
        MagmaSpinner
    ],
})
export class DemoSpinnerComponent {
}`;

    constructor() {
        this.ctrlForm = this.fb.groupWithError({
            size: { default: 0, emptyOnInit: true },
            tickWidth: { default: 0, emptyOnInit: true },
            radius: { default: 0, emptyOnInit: true },
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

        if (value.size) {
            attrs['size'] = value.size;
        }
        if (value.tickWidth) {
            attrs['tickWidth'] = value.tickWidth;
        }
        if (value.radius || value.radius === 0) {
            attrs['radius'] = value.radius;
        }

        this.codeHtml = new Json2html(json).toString();
    }
}
