import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';

import { Select2Data } from 'ng-select2-component';

import {
    AbstractWindowComponent,
    FormBuilderExtended,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputSelect,
    MagmaInputText,
    MagmaWindow,
    MagmaWindows,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    template: `<p><button (click)="close()">Close</button></p>`,
    styles: [``],
})
export class TestWindowComponent extends AbstractWindowComponent {}

@Component({
    template: `<p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
    </p>`,
    styles: [
        `
            :host {
                overflow: auto;
            }
        `,
    ],
})
export class Test2WindowComponent extends AbstractWindowComponent {}

@Component({
    selector: 'demo-window',
    templateUrl: './demo-window.component.html',
    styleUrl: './demo-window.component.scss',
    imports: [
        CodeTabsComponent,
        ReactiveFormsModule,
        MagmaWindow,
        MagmaInput,
        MagmaInputElement,
        MagmaInputSelect,
        MagmaInputCheckbox,
        MagmaInputText,
        MagmaInputNumber,
    ],
})
export class DemoWindowComponent {
    readonly fb = inject(FormBuilderExtended);
    readonly windows = inject(MagmaWindows);

    ctrlForm: FormGroup<{}>;

    ctrlFormZone: FormGroup<{
        component: FormControl<any>;
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
    }>;

    position: Select2Data = [
        { label: 'default', value: 'default' },
        { label: 'center', value: 'center' },
        { label: '{x, y}', value: 'define' },
    ];

    component: Select2Data = [
        { label: 'TestWindowComponent', value: TestWindowComponent },
        { label: 'Test2WindowComponent', value: Test2WindowComponent },
    ];

    codeHtml = '';
    codeTs = `import { MagmaWindow } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    styleUrl: './my-component.component.scss',
    imports: [
        MagmaWindow
    ],
})
export class DemoBlockComponent { }`;

    constructor() {
        this.ctrlForm = this.fb.groupWithError({});
        this.ctrlFormZone = this.fb.groupWithError({
            component: { default: TestWindowComponent },
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
        });
        this.codeGeneration();
        this.ctrlForm.valueChanges.subscribe(() => {
            this.codeGeneration();
        });
    }

    openWindow() {
        this.windows.openWindow(this.ctrlFormZone.value.component, {
            position:
                this.ctrlFormZone.value.position === 'define'
                    ? { x: this.ctrlFormZone.value.posX ?? 0, y: this.ctrlFormZone.value.posY ?? 0 }
                    : this.ctrlFormZone.value.position,
            bar: {
                active: this.ctrlFormZone.value.bar,
                title: this.ctrlFormZone.value.barTitle,
                buttons: this.ctrlFormZone.value.barButtons,
            },
            size: {
                width: {
                    min: this.ctrlFormZone.value.minWidth || undefined,
                    max: this.ctrlFormZone.value.maxWidth || undefined,
                    init: this.ctrlFormZone.value.width || undefined,
                },
                height: {
                    min: this.ctrlFormZone.value.minHeight || undefined,
                    max: this.ctrlFormZone.value.maxHeight || undefined,
                    init: this.ctrlFormZone.value.height || undefined,
                },
            },
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
