import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';

import { Select2Data } from 'ng-select2-component';

import {
    FormBuilderExtended,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputSelect,
    MagmaInputText,
    MagmaWindow,
    MagmaWindows,
    MagmaWindowsContainer,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-window',
    templateUrl: './demo-window.component.html',
    styleUrl: './demo-window.component.scss',
    imports: [
        CodeTabsComponent,
        ReactiveFormsModule,
        MagmaInput,
        MagmaInputCheckbox,
        MagmaInputElement,
        MagmaInputNumber,
        MagmaInputSelect,
        MagmaInputText,
        MagmaWindow,
        MagmaWindowsContainer,
    ],
})
export class DemoWindowComponent {
    protected readonly fb = inject(FormBuilderExtended);
    protected readonly windows = inject(MagmaWindows);

    ctrlForm: FormGroup<{
        position: FormControl<'default' | 'center' | 'define'>;
        posX: FormControl<number>;
        posY: FormControl<number>;
        bar: FormControl<boolean>;
        barTitle: FormControl<string>;
        barButtons: FormControl<boolean>;
        width: FormControl<string>;
        minWidth: FormControl<string>;
        maxWidth: FormControl<string>;
        height: FormControl<string>;
        minHeight: FormControl<string>;
        maxHeight: FormControl<string>;
        lock: FormControl<boolean>;
    }>;

    position: Select2Data = [
        { label: 'default', value: 'default' },
        { label: 'center', value: 'center' },
        { label: '{x, y}', value: 'define' },
    ];

    codeHtml = '';
    codeTs = `import { MagmaWindow, MagmaWindowsContainer } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    styleUrl: './my-component.component.scss',
    imports: [
        MagmaWindow,
        MagmaWindowsContainer,
    ],
})
export class DemoBlockComponent { }`;
    codeTsZone = '';

    constructor() {
        this.ctrlForm = this.fb.groupWithError({
            position: { default: 'default' as 'default' | 'center' | 'define' },
            posX: { default: 0 },
            posY: { default: 0 },
            bar: { default: true },
            barTitle: { default: 'Title' },
            barButtons: { default: true },
            width: { default: '' },
            minWidth: { default: '' },
            maxWidth: { default: '' },
            height: { default: '' },
            minHeight: { default: '' },
            maxHeight: { default: '' },
            lock: { default: false },
        });

        this.codeGeneration();
        this.ctrlForm.valueChanges.subscribe(() => {
            this.codeGeneration();
        });
    }

    codeGeneration() {
        // tag root

        const json: Json2htmlRef = {
            tag: 'mg-window',
            attrs: { '#window': null },
            body: [
                {
                    tag: 'p',
                    body: 'Content window',
                },
                {
                    tag: 'p',
                    body: {
                        tag: 'button',
                        attrs: { '(click)': 'window.close()' },
                        body: 'Close',
                    },
                },
            ],
        };
        const attrs: Json2htmlAttr = json.attrs!;

        // tag attr

        this.codeHtml = new Json2html(json).toString();
    }
}
