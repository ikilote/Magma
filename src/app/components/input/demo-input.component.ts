import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    MagmaInputTextarea,
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
        MagmaInputTextarea,
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

    constructor(fbe: FormBuilderExtended) {
        console.log(fbe);
        this.formText = fbe.groupWithErrorNonNullable({
            test: {
                default: 'form',
                control: {
                    required: { state: true, message: 'error required' },
                    minlength: { state: 5, message: 'error minLength' },
                    maxlength: { state: 50, message: 'error maxLength' },
                },
            },
        });
        this.formColor = fbe.groupWithErrorNonNullable({
            test: {
                default: null,
                control: {
                    required: { state: true, message: 'error required' },
                    pattern: { state: /^\#(?:[0-9a-f]{3,4}|[0-9a-f]{6}(?:[0-9a-f]{2})?)$/, message: 'error pattern' },
                },
            },
        });
        this.formNumber = fbe.groupWithErrorNonNullable({
            test: {
                default: 53.15,
                control: {
                    required: { state: true, message: 'error required' },
                    min: { state: 5, message: 'error min' },
                    max: { state: 50, message: 'error max' },
                },
            },
        });
        this.formSelect = fbe.groupWithErrorNonNullable({
            test: {
                default: 'test2',
                control: {
                    pattern: { state: /.*2$/, message: 'error pattern' },
                },
            },
        });
    }
}
