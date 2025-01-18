import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { Select2Data } from 'ng-select2-component';

import {
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputColor,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputRadio,
    MagmaInputSelect,
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
        MagmaInputNumber,
        MagmaInputSelect,
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class DemoInputComponent {
    value = 'ngModel';
    color = 'red';
    radio = 'blue';
    checkboxOne = true;
    checkbox = ['blue'];
    number = 153.15;
    select1 = 'test2';

    data: Select2Data = [
        { label: 'test1', value: 'test1' },
        { label: 'test2', value: 'test2' },
    ];

    formText: FormGroup<{
        test: FormControl<string>;
    }>;
    formColor: FormGroup<{
        test: FormControl<string>;
    }>;
    formNumber: FormGroup<{
        test: FormControl<number>;
    }>;
    formSelect: FormGroup<{
        test: FormControl<string>;
    }>;

    constructor(fb: NonNullableFormBuilder) {
        this.formText = fb.group({
            test: new FormControl<string>('form', { nonNullable: true }),
        });
        this.formColor = fb.group({
            test: new FormControl<string>('#1f7b33', { nonNullable: true }),
        });
        this.formNumber = fb.group({
            test: new FormControl<number>(153.15, { nonNullable: true }),
        });
        this.formSelect = fb.group({
            test: new FormControl<string>('test2', { nonNullable: true }),
        });
    }
}
