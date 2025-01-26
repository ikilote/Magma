import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlRef } from '@ikilote/json2html';

import {
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputText,
    MagmaInputTextarea,
    MagmaTabsModule,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-tabs',
    templateUrl: './demo-tabs.component.html',
    styleUrls: ['./demo-tabs.component.scss'],
    imports: [
        MagmaTabsModule,
        FormsModule,
        CodeTabsComponent,
        ReactiveFormsModule,
        MagmaInput,
        MagmaInputText,
        MagmaInputTextarea,
        MagmaInputElement,
        MagmaInputCheckbox,
    ],
})
export class DemoTabsComponent {
    tabs: {
        id: string;
        title: string;
        content: string;
        selected: boolean;
    }[] = [];

    ctrlForm: FormGroup<{
        id: FormControl<string>;
        title: FormControl<string>;
        content: FormControl<string>;
        selected: FormControl<boolean>;
    }>;

    codeHtml = '';

    constructor(fb: NonNullableFormBuilder) {
        this.ctrlForm = fb.group({
            id: new FormControl<string>('', { nonNullable: true }),
            title: new FormControl<string>('', { nonNullable: true }),
            content: new FormControl<string>('', { nonNullable: true }),
            selected: new FormControl<boolean>(false, { nonNullable: true }),
        });
        this.codeGeneration();
    }

    addTab() {
        this.tabs.forEach(e => (e.selected = false));
        this.tabs.push({
            id: this.ctrlForm.value.id!,
            title: this.ctrlForm.value.title!,
            content: this.ctrlForm.value.content!,
            selected: this.ctrlForm.value.selected!,
        });
        this.codeGeneration();
    }

    codeGeneration() {
        // tag root

        const json: Json2htmlRef = {
            tag: 'mg-tabs',
            attrs: {},
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
