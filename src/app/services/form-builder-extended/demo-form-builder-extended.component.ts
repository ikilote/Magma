import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
    FormBuilderExtended,
    MagmaInput,
    MagmaInputElement,
    MagmaInputText,
} from '../../../../projects/ikilote/magma/src/public-api';

@Component({
    selector: 'demo-form-builder-extended',
    templateUrl: './demo-form-builder-extended.component.html',
    styleUrls: ['./demo-form-builder-extended.component.scss'],
    imports: [FormsModule, MagmaInput, MagmaInputElement, MagmaInputText, ReactiveFormsModule, JsonPipe],
})
export class DemoFormBuilderExtended {
    readonly fb = inject(FormBuilderExtended);

    ctrlForm1: FormGroup<{
        id: FormControl<string>;
        group: FormControl<string>;
    }>;

    constructor() {
        this.ctrlForm1 = this.fb.groupWithErrorNonNullable({
            id: { default: '' },
            group: { default: 'test' },
        });
    }
}
