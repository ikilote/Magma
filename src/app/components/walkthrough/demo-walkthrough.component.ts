import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlObject } from '@ikilote/json2html';
import { FormBuilderExtended } from '@ikilote/magma';

import {
    MagmaBlock,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputText,
    MagmaTabsModule,
    MagmaWalkthrough,
    MagmaWalkthroughStep,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-walkthrough',
    templateUrl: './demo-walkthrough.component.html',
    styleUrls: ['./demo-walkthrough.component.scss'],
    imports: [
        ReactiveFormsModule,
        CodeTabsComponent,
        MagmaWalkthrough,
        MagmaWalkthroughStep,
        MagmaBlock,
        MagmaTabsModule,
        MagmaInput,
        MagmaInputText,
        MagmaInputElement,
        MagmaInputCheckbox,
    ],
})
export class DemoWalkthroughComponent {
    readonly fb = inject(FormBuilderExtended);
    html: string = '';

    ctrlForm: FormGroup<{
        selector: FormControl<string>;
        group: FormControl<string>;
        name: FormControl<string>;
        previousStep: FormControl<string>;
        nextStep: FormControl<string>;
        showElement: FormControl<boolean>;
        close: FormControl<boolean>;
        clickElementActive: FormControl<boolean>;
        clickElementOrigin: FormControl<boolean>;
    }>;

    ctrlForm2: FormGroup<{
        selector: FormControl<string>;
        group: FormControl<string>;
        name: FormControl<string>;
        previousStep: FormControl<string>;
        nextStep: FormControl<string>;
        showElement: FormControl<boolean>;
        close: FormControl<boolean>;
        clickElementActive: FormControl<boolean>;
        clickElementOrigin: FormControl<boolean>;
    }>;

    ctrlForm3: FormGroup<{
        selector: FormControl<string>;
        group: FormControl<string>;
        name: FormControl<string>;
        previousStep: FormControl<string>;
        nextStep: FormControl<string>;
        showElement: FormControl<boolean>;
        close: FormControl<boolean>;
        clickElementActive: FormControl<boolean>;
        clickElementOrigin: FormControl<boolean>;
    }>;

    alert(e: string) {
        alert(e);
    }

    codeHtml = '';

    constructor() {
        this.ctrlForm = this.fb.groupWithErrorNonNullable({
            selector: { default: '#btn-a' },
            group: { default: '' },
            name: { default: 'first' },
            previousStep: { default: '' },
            nextStep: { default: 'second' },
            showElement: { default: true },
            close: { default: false },
            clickElementActive: { default: false },
            clickElementOrigin: { default: false },
        });
        this.ctrlForm2 = this.fb.groupWithErrorNonNullable({
            selector: { default: '#btn-b' },
            group: { default: '' },
            name: { default: 'second' },
            previousStep: { default: 'first' },
            nextStep: { default: 'end' },
            showElement: { default: true },
            close: { default: false },
            clickElementActive: { default: false },
            clickElementOrigin: { default: false },
        });
        this.ctrlForm3 = this.fb.groupWithErrorNonNullable({
            selector: { default: '#btn-c' },
            group: { default: '' },
            name: { default: 'end' },
            previousStep: { default: 'second' },
            nextStep: { default: '' },
            showElement: { default: true },
            close: { default: true },
            clickElementActive: { default: false },
            clickElementOrigin: { default: false },
        });
        this.generator();

        this.ctrlForm.valueChanges.subscribe(() => {
            this.generator();
        });
    }

    generator() {
        const json: Json2htmlObject = [
            {
                tag: 'button',
                attrs: {
                    '(click)': `walk.start(${
                        this.ctrlForm.value.group ? `'${this.ctrlForm.value.group.replaceAll("'", "\\'")}'` : ''
                    })`,
                },
                body: 'Start',
            },
            { emptyLine: 1 },
            {
                tag: 'mg-walkthrough',
                attrs: { '#walk': 'walkthrough' },
                body: [
                    {
                        tag: 'ng-template',
                        attrs: {
                            'mg-walkthrough-step': null,
                            selector: this.ctrlForm.value.selector,
                            group: this.ctrlForm.value.group || undefined,
                            name: this.ctrlForm.value.name,
                            previousStep: this.ctrlForm.value.previousStep || undefined,
                            nextStep: this.ctrlForm.value.nextStep || undefined,
                            showElement: this.ctrlForm.value.showElement ? null : undefined,
                            close: this.ctrlForm.value.close ? null : undefined,
                            clickElementActive: this.ctrlForm.value.clickElementActive ? null : undefined,
                            clickElementOrigin: this.ctrlForm.value.clickElementOrigin ? null : undefined,
                            '(clickElement)': this.ctrlForm.value.clickElementActive
                                ? "alert('Click'); walk.close()"
                                : undefined,
                        },
                        body: [
                            {
                                tag: 'p',
                                body: 'TEST 1',
                            },
                        ],
                    },
                    {
                        tag: 'ng-template',
                        attrs: {
                            'mg-walkthrough-step': null,
                            selector: this.ctrlForm2.value.selector,
                            group: this.ctrlForm2.value.group || undefined,
                            name: this.ctrlForm2.value.name,
                            previousStep: this.ctrlForm2.value.previousStep || undefined,
                            nextStep: this.ctrlForm2.value.nextStep || undefined,
                            showElement: this.ctrlForm2.value.showElement ? null : undefined,
                            close: this.ctrlForm2.value.close ? null : undefined,
                            clickElementActive: this.ctrlForm2.value.clickElementActive ? null : undefined,
                            clickElementOrigin: this.ctrlForm2.value.clickElementOrigin ? null : undefined,
                            '(clickElement)': this.ctrlForm2.value.clickElementActive
                                ? "alert('Click'); walk.close()"
                                : undefined,
                        },
                        body: [
                            {
                                tag: 'p',
                                body: 'TEST 2',
                            },
                        ],
                    },
                    {
                        tag: 'ng-template',
                        attrs: {
                            'mg-walkthrough-step': null,
                            selector: this.ctrlForm3.value.selector,
                            group: this.ctrlForm3.value.group || undefined,
                            name: this.ctrlForm3.value.name,
                            previousStep: this.ctrlForm3.value.previousStep || undefined,
                            nextStep: this.ctrlForm3.value.nextStep || undefined,
                            showElement: this.ctrlForm3.value.showElement ? null : undefined,
                            close: this.ctrlForm3.value.close ? null : undefined,
                            clickElementActive: this.ctrlForm3.value.clickElementActive ? null : undefined,
                            clickElementOrigin: this.ctrlForm3.value.clickElementOrigin ? null : undefined,
                            '(clickElement)': this.ctrlForm3.value.clickElementActive
                                ? "alert('Click'); walk.close()"
                                : undefined,
                        },
                        body: [
                            {
                                tag: 'p',
                                body: 'TEST 3',
                            },
                        ],
                    },
                ],
            },
        ];

        this.html = new Json2html(json).toString();
    }
}
