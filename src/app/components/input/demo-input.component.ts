import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import {
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputColor,
    MagmaInputElement,
    MagmaInputRadio,
    MagmaInputText,
} from '../../../../projects/ikilote/magma/src/public-api';

@Component({
    selector: 'demo-input',
    templateUrl: './demo-input.component.html',
    styleUrls: ['./demo-input.component.scss'],
    imports: [
        MagmaInput,
        MagmaInputText,
        MagmaInputColor,
        MagmaInputRadio,
        MagmaInputElement,
        MagmaInputCheckbox,
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class DemoInputComponent {
    value = 'ngModel';
    color = 'red';
    radio = 'blue';

    formText: FormGroup<{
        test: FormControl<string>;
    }>;
    formColor: FormGroup<{
        test: FormControl<string>;
    }>;

    constructor(fb: NonNullableFormBuilder) {
        this.formText = fb.group({
            test: new FormControl<string>('form', { nonNullable: true }),
        });
        this.formColor = fb.group({
            test: new FormControl<string>('#1f7b33', { nonNullable: true }),
        });
    }
}
