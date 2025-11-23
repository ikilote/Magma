import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Json2html, Json2htmlRef } from '@ikilote/json2html';

import {
    FormBuilderExtended,
    MagmaInput,
    MagmaInputElement,
    MagmaInputText,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

type MyArrayItem = FormGroup<{
    id: FormControl<string>;
}>;

@Component({
    selector: 'demo-form-builder-extended',
    templateUrl: './demo-form-builder-extended.component.html',
    styleUrls: ['./demo-form-builder-extended.component.scss'],
    imports: [
        FormsModule,
        MagmaInput,
        MagmaInputElement,
        MagmaInputText,
        ReactiveFormsModule,
        JsonPipe,
        CodeTabsComponent,
        RouterLink,
    ],
})
export class DemoFormBuilderExtended {
    readonly fb = inject(FormBuilderExtended);

    ctrlForm: FormGroup<{
        id: FormControl<string>;
        group: FormControl<string>;
        sub: FormGroup<{
            id: FormControl<string>;
        }>;
        array: FormArray<MyArrayItem>;
    }>;

    constructor() {
        this.ctrlForm = this.fb.groupWithError({
            id: {
                default: 'string',
                control: {
                    required: { state: true, message: 'error required' },
                    minlength: { state: 5, message: 'error minLength : [{minlength}, {maxlength}]' },
                    maxlength: { state: 50, message: 'error maxLength : [{minlength}, {maxlength}]' },
                },
            },
            group: { default: 'test' },
            sub: this.fb.groupWithError({
                id: { default: '' },
            }),
            array: this.fb.array<MyArrayItem>([]),
        });
    }

    remove(index: number) {
        this.ctrlForm.controls.array.removeAt(index);
    }

    add() {
        this.ctrlForm.controls.array.push(
            this.fb.groupWithError({
                id: { default: '' },
            }),
        );
    }

    submit() {
        this.fb.validateForm(this.ctrlForm);
    }

    form: Json2htmlRef = {
        tag: 'form',
        attrs: { '[formGroup]': 'ctrlForm1', '(submit)': 'submit()' },
        body: [
            {
                tag: 'div',
                body: [
                    {
                        tag: 'mg-input',
                        body: [
                            { tag: 'mg-input-label', body: ['Id'], inline: true },
                            { tag: 'mg-input-text', attrs: { formControlName: 'id' } },
                        ],
                    },
                    {
                        tag: 'mg-input',
                        body: [
                            { tag: 'mg-input-label', body: ['group'], inline: true },
                            { tag: 'mg-input-text', attrs: { formControlName: 'group' } },
                        ],
                    },
                    { emptyLine: 1 },
                    {
                        tag: 'h4',
                        body: ['Group'],
                    },
                    {
                        tag: 'ng-container',
                        attrs: { formGroupName: 'sub' },
                        body: [
                            {
                                tag: 'mg-input',
                                body: [
                                    { tag: 'mg-input-label', body: ['sub.id'], inline: true },
                                    { tag: 'mg-input-text', attrs: { formControlName: 'id' } },
                                ],
                            },
                        ],
                    },
                    { emptyLine: 1 },
                    {
                        tag: 'h4',
                        body: ['Array'],
                    },
                    {
                        tag: 'ng-container',
                        attrs: { formArrayName: 'array' },
                        body: [
                            {
                                annotation: 'for',
                                conditional:
                                    'control of ctrlForm1.controls.array.controls; track $index; let index = $index',
                                body: [
                                    {
                                        tag: 'ng-container',
                                        attrs: { '[formGroupName]': 'index' },
                                        body: [
                                            {
                                                tag: 'mg-input',
                                                attrs: { class: 's-10' },
                                                body: [
                                                    { tag: 'mg-input-label', body: ['array.{{ index }}.id'] },
                                                    { tag: 'mg-input-text', attrs: { formControlName: 'id' } },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        tag: 'div',
                                        attrs: { class: 's-2' },
                                        body: [
                                            {
                                                tag: 'button',
                                                attrs: { '(click)': 'remove($index)' },
                                                body: ['Remove'],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        tag: 'div',
                        body: [
                            {
                                tag: 'button',
                                attrs: { '(click)': 'add()' },
                                body: ['Add'],
                            },
                        ],
                    },
                ],
            },
        ],
    };

    code = {
        html: new Json2html(this.form, { spaceLength: 2 }).toString(),
        ts: `import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
    FormBuilderExtended,
    MagmaInput,
    MagmaInputElement,
    MagmaInputText,
} from '@ikilote/magma';

type MyArrayItem = FormGroup<{
    id: FormControl<string>;
}>;

@Component({
    selector: 'demo-form',
    templateUrl: './demo-form.component.html',
    styleUrls: ['./demo-form.component.scss'],
    imports: [
        FormsModule,
        MagmaInput,
        MagmaInputElement,
        MagmaInputText,
        ReactiveFormsModule
    ],
})
export class DemoFormBuilderExtended {
    readonly fb = inject(FormBuilderExtended);

    ctrlForm1: FormGroup<{
        id: FormControl<string>;
        group: FormControl<string>;
        sub: FormGroup<{
            id: FormControl<string>;
        }>;
        array: FormArray<MyArrayItem>;
    }>;

    constructor() {
        this.ctrlForm = this.fb.groupWithError({
            id: {
                default: 'string',
                control: {
                    required: { state: true, message: 'error required' },
                    minlength: { state: 5, message: 'error minLength : [{minlength}, {maxlength}]' },
                    maxlength: { state: 50, message: 'error maxLength : [{minlength}, {maxlength}]' },
                },
            },
            group: { default: 'test' },
            sub: this.fb.groupWithError({
                id: { default: '' },
            }),
            array: this.fb.array<MyArrayItem>([]),
        });
    }

    remove(index: number) {
        this.ctrlForm.controls.array.removeAt(index);
    }

    add() {
        this.ctrlForm.controls.array.push(
            this.fb.groupWithError({
                id: { default: '' },
            }),
        );
    }

    submit() {
        this.fb.validateForm(this.ctrlForm);
    }
}`,
    };
}
