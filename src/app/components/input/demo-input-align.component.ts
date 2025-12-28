import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Select2Data } from 'ng-select2-component';

import {
    FormBuilderExtended,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputColor,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputPassword,
    MagmaInputRadio,
    MagmaInputSelect,
    MagmaInputText,
    MagmaInputTextarea,
} from '../../../../projects/ikilote/magma/src/public-api';

@Component({
    selector: 'demo-input-align',
    templateUrl: './demo-input-align.component.html',
    styleUrl: './demo-input-align.component.scss',
    imports: [
        MagmaInput,
        MagmaInputText,
        MagmaInputColor,
        MagmaInputRadio,
        MagmaInputElement,
        MagmaInputCheckbox,
        MagmaInputPassword,
        MagmaInputNumber,
        MagmaInputSelect,
        FormsModule,
        ReactiveFormsModule,
        MagmaInputTextarea,
    ],
})
export class DemoInputAlignComponent {
    readonly fbe = inject(FormBuilderExtended);

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
    data2: Select2Data = [
        { label: 'value1', value: 'value1' },
        { label: 'value2', value: 'value2' },
        { label: 'value3', value: 'value3' },
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
    formTest: FormGroup<{
        text: FormControl<string>;
        password: FormControl<string>;
        textarea: FormControl<string>;
        radio: FormControl<string>;
        checkbox: FormControl<boolean>;
        checkboxMultiple: FormControl<string[]>;
        select: FormControl<string>;
        color: FormControl<string>;
    }>;

    constructor() {
        this.formText = this.fbe.groupWithError({
            test: {
                default: 'form',
                control: {
                    required: { state: true, message: 'error required' },
                    minlength: { state: 5, message: 'error minLength : [{minlength}, {maxlength}]' },
                    maxlength: { state: 50, message: 'error maxLength : [{minlength}, {maxlength}]' },
                },
            },
        });
        this.formColor = this.fbe.groupWithError({
            test: {
                default: '',
                control: {
                    required: { state: true, message: 'error required' },
                    pattern: { state: /^\#(?:[0-9a-f]{3,4}|[0-9a-f]{6}(?:[0-9a-f]{2})?)$/, message: 'error pattern' },
                },
            },
        });
        this.formNumber = this.fbe.groupWithError({
            test: {
                default: 53.15,
                control: {
                    required: { state: true, message: 'error required' },
                    min: { state: 5, message: 'error min' },
                    max: { state: 50, message: 'error max' },
                },
            },
        });
        this.formSelect = this.fbe.groupWithError({
            test: {
                default: 'test2',
                control: {
                    pattern: { state: /.*2$/, message: 'error pattern' },
                },
            },
        });

        this.formTest = this.fbe.groupWithError({
            text: {
                default: 'text',
                control: { required: { state: true, message: 'Required field' } },
            },
            password: { default: 'password', control: { required: { state: true, message: 'Required field' } } },
            textarea: { default: 'textarea', control: { required: { state: true, message: 'Required field' } } },
            radio: { default: 'value2', control: { required: { state: true, message: 'Required field' } } },
            checkbox: { default: true, control: { inlist: { state: [true], message: 'Required field' } } },
            checkboxMultiple: {
                default: ['value2', 'value3'],
                control: { required: { state: true, message: 'Required field' } },
            },
            select: { default: 'value2', control: { required: { state: true, message: 'Required field' } } },
            color: { default: 'blue', control: { required: { state: true, message: 'Required field' } } },
        });
    }

    validate() {
        this.fbe.validateForm(this.formTest);
    }

    clear() {
        this.formTest.setValue({
            text: '',
            password: '',
            textarea: '',
            radio: '',
            checkbox: false,
            checkboxMultiple: [],
            select: '',
            color: '',
        });
    }

    set() {
        this.formTest.setValue({
            text: 'text',
            password: 'password',
            textarea: 'textarea',
            radio: 'value2',
            checkbox: true,
            checkboxMultiple: ['value2', 'value3'],
            select: 'value2',
            color: 'blue',
        });
    }
}
