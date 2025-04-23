import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlRef } from '@ikilote/json2html';
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
            selector: { default: '#btn-1' },
            name: { default: 'first' },
            previousStep: { default: '' },
            nextStep: { default: 'second' },
            showElement: { default: true },
            close: { default: false },
            clickElementActive: { default: false },
            clickElementOrigin: { default: false },
        });
        this.generator();

        this.ctrlForm.valueChanges.subscribe(() => {
            this.generator();
        });
    }

    generator() {
        const json: Json2htmlRef = {
            tag: 'mg-walkthrough',
            attrs: { '#walk': 'walkthrough' },

            body: [
                {
                    tag: 'ng-template',
                    attrs: {
                        'mg-walkthrough-step': null,
                        selector: this.ctrlForm.value.selector,
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
            ],
        };

        this.html = new Json2html(json).toString();
    }
}
