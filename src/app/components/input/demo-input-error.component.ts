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
    MagmaInputRadio,
    MagmaInputSelect,
    MagmaInputText,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-input-error',
    templateUrl: './demo-input-error.component.html',
    styleUrls: ['./demo-input-error.component.scss'],
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
        CodeTabsComponent,
    ],
})
export class DemoInputErrorComponent {
    private readonly fbe = inject(FormBuilderExtended);

    readonly codeTsText = `export class DemoInputErrorComponent {
    private readonly fbe = inject(FormBuilderExtended);

    readonly formText: FormGroup<{
        test: FormControl<string>;
    }>;

    constructor() {
        this.formText = this.fbe.groupWithErrorNonNullable({
            test: {
                default: 'form',
                  control: {
                    required: { state: true, message: 'Field is required' },
                    minlength: {
                        state: 5,
                        message: params => 'Minimal length: ' + params.errorData.requiredLength,
                        // or 'Minimal length: {requiredLength}'
                    },
                    maxlength: {
                        state: 50,
                        message: params => \`\${params.data} length: \${params.errorData.requiredLength}\`,
                        data: 'Maximal',
                    },
                    pattern: { state: /.*a.*/, message: 'Do include the “a” letter' },
                    email: { message: 'This email is not valid' },
                },
            },
        });
    }
}`;

    readonly codeTsList = `export class DemoInputErrorComponent {
    private readonly fbe = inject(FormBuilderExtended);

    readonly data: Select2Data = [
        { label: 'test1', value: 'test1' },
        { label: 'test2', value: 'test2' },
    ];

    readonly formList: FormGroup<{
        oneValue: FormControl<string>;
        listValue: FormControl<string[]>;
        boolean: FormControl<boolean>;
        select: FormControl<string>;
    }>;

    constructor() {
        this.formList = this.fbe.groupWithErrorNonNullable({
            oneValue: {
                default: 'blue',
                control: {
                    required: { state: true, message: 'Field is required' },
                    inlist: { state: ['red'], message: 'Only {list}' },
                },
            },
            listValue: {
                default: ['blue'],
                control: {
                    required: { state: true },
                    inlist: { state: ['blue', 'red', 'yellow'], message: 'Accept value: {list}' },
                    minlength: { state: 2, message: 'Minimal list {requiredLength}' },
                    message: 'Field is required',
                },
            },
            boolean: {
                default: false,
                control: {
                    inlist: { state: [true], message: 'This field must be checked' },
                },
            },
            select: {
                default: 'blue',
                control: {
                    inlist: { state: ['blue', 'red'], message: 'Only {list}' },
                },
            },
        });
    }
}`;

    readonly codeTsNumber = `export class DemoInputErrorComponent {
    private readonly fbe = inject(FormBuilderExtended);

    readonly formNumber: FormGroup<{
        test: FormControl<number>;
    }>;

    constructor() {
        this.formNumber = this.fbe.groupWithErrorNonNullable({
            test: {
                default: 53.15,
                control: {
                    required: { state: true, message: 'Field is required' },
                    min: { state: 5, message: 'min value is {min}, currently {actual}' },
                    max: { state: 50, message: 'max value is {max}, currently {actual}' },
                },
            },
        });
    }
}`;

    readonly data: Select2Data = [
        { label: 'red', value: 'red' },
        { label: 'blue', value: 'blue' },
        { label: 'yellow', value: 'yellow' },
    ];

    readonly formText: FormGroup<{
        test: FormControl<string>;
    }>;
    readonly formColor: FormGroup<{
        test: FormControl<string>;
    }>;
    readonly formList: FormGroup<{
        oneValue: FormControl<string>;
        listValue: FormControl<string[]>;
        boolean: FormControl<boolean>;
        select: FormControl<string>;
    }>;
    readonly formNumber: FormGroup<{
        test: FormControl<number>;
    }>;
    readonly formSelect: FormGroup<{
        test: FormControl<string>;
    }>;

    constructor() {
        this.formText = this.fbe.groupWithErrorNonNullable({
            test: {
                default: 'form',
                control: {
                    required: { state: true, message: 'Field is required' },
                    minlength: {
                        state: 5,
                        message: params => 'Minimal length: ' + params.errorData.requiredLength,
                    },
                    maxlength: {
                        state: 50,
                        message: params => `${params.data} length: ${params.errorData.requiredLength}`,
                        data: 'Maximal',
                    },
                    pattern: { state: /.*a.*/, message: 'Do include the “a” letter' },
                    email: { message: 'This email is not valid' },
                },
            },
        });
        this.formColor = this.fbe.groupWithErrorNonNullable({
            test: {
                default: 'null',
                control: {
                    required: { state: true, message: 'Field is required' },
                    pattern: { state: /^\#(?:[0-9a-f]{3,4}|[0-9a-f]{6}(?:[0-9a-f]{2})?)$/, message: 'error pattern' },
                },
            },
        });
        this.formList = this.fbe.groupWithErrorNonNullable({
            oneValue: {
                default: 'blue',
                control: {
                    required: { state: true, message: 'Field is required' },
                    inlist: { state: ['red'], message: 'Only {list}' },
                },
            },
            listValue: {
                default: ['blue'],
                control: {
                    required: { state: true },
                    inlist: { state: ['blue', 'red', 'yellow'], message: 'Accept value: {list}' },
                    minlength: { state: 2, message: 'Minimal list {requiredLength}' },
                    message: 'Field is required',
                },
            },
            boolean: {
                default: false,
                control: {
                    inlist: { state: [true], message: 'This field must be checked' },
                },
            },
            select: {
                default: 'blue',
                control: {
                    inlist: { state: ['blue', 'red'], message: 'Only {list}' },
                },
            },
        });
        this.formNumber = this.fbe.groupWithErrorNonNullable({
            test: {
                default: 53.15,
                control: {
                    required: { state: true, message: 'Field is required' },
                    min: { state: 5, message: 'min value is {min}, currently {actual}' },
                    max: { state: 50, message: 'max value is {max}, currently {actual}' },
                },
            },
        });
        this.formSelect = this.fbe.groupWithErrorNonNullable({
            test: {
                default: 'test2',
                control: {
                    pattern: { state: /.*2$/, message: 'error pattern' },
                },
            },
        });
    }
}
