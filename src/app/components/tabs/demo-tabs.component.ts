import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlRef } from '@ikilote/json2html';

import {
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputText,
    MagmaInputTextarea,
    MagmaMessages,
    MagmaTabsModule,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-tabs',
    templateUrl: './demo-tabs.component.html',
    styleUrl: './demo-tabs.component.scss',
    imports: [
        CodeTabsComponent,
        ReactiveFormsModule,
        MagmaTabsModule,
        MagmaInput,
        MagmaInputText,
        MagmaInputTextarea,
        MagmaInputElement,
        MagmaInputCheckbox,
    ],
})
export class DemoTabsComponent {
    readonly mgMessages = inject(MagmaMessages);

    tabs: {
        id: string;
        title: string;
        content: string;
        selected: boolean;
    }[] = [];

    form: FormGroup<{
        compact: FormControl<boolean>;
        returnTabsLabel: FormControl<string>;
    }>;

    ctrlForm: FormGroup<{
        id: FormControl<string>;
        title: FormControl<string>;
        content: FormControl<string>;
        selected: FormControl<boolean>;
    }>;

    codeHtml = '';

    codeTs = `import { MagmaTabsModule } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    styleUrl: './my-component.component.scss',
    imports: [
        MagmaTabsModule
    ],
})
export class DemoTabsComponent {
}`;

    constructor(fb: NonNullableFormBuilder) {
        this.form = fb.group({
            compact: new FormControl<boolean>(false, { nonNullable: true }),
            returnTabsLabel: new FormControl<string>('Return to tabs', { nonNullable: true }),
        });
        this.ctrlForm = fb.group({
            id: new FormControl<string>('', { nonNullable: true }),
            title: new FormControl<string>('', { nonNullable: true }),
            content: new FormControl<string>('', { nonNullable: true }),
            selected: new FormControl<boolean>(false, { nonNullable: true }),
        });
        this.codeGeneration();

        this.form.valueChanges.subscribe(() => {
            this.codeGeneration();
        });
    }

    addTab() {
        if (this.tabs.find(e => e.id === this.ctrlForm.value.id)) {
            this.mgMessages.addMessage(`This ID is already in use`);
        } else if (!this.ctrlForm.value.id) {
            this.mgMessages.addMessage(`no ID`);
        } else {
            this.tabs.forEach(e => (e.selected = false));
            this.tabs.push({
                id: this.ctrlForm.value.id!,
                title: this.ctrlForm.value.title!,
                content: this.ctrlForm.value.content!,
                selected: this.ctrlForm.value.selected!,
            });
            this.codeGeneration();
        }
    }

    codeGeneration() {
        // tag root

        const json: Json2htmlRef = {
            tag: 'mg-tabs',
            attrs: {
                class: this.form.value.compact ? 'compact' : undefined,
                returnTabsLabel:
                    this.form.value.returnTabsLabel !== '' && this.form.value.returnTabsLabel !== 'Return to tabs'
                        ? this.form.value.returnTabsLabel
                        : undefined,
            },
            body: [],
        };
        const body = json.body as Json2htmlRef[];

        // tag attr

        for (const tab of this.tabs) {
            body.push({
                tag: 'mg-tab-title',
                attrs: {
                    id: tab.id,
                    selected: this.ctrlForm.value.id === tab.id && this.ctrlForm.value.selected ? null : undefined,
                },
                body: tab.title,
            });
            body.push({
                tag: 'mg-tab-content',
                attrs: {
                    id: tab.id,
                },
                body: tab.content,
            });
        }

        this.codeHtml = new Json2html(json).toString();
    }
}
