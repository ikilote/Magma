import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Json2Js, Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';

import { Select2Data } from 'ng-select2-component';

import {
    FormBuilderExtended,
    MagmaContribCalendar,
    MagmaInput,
    MagmaInputDate,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputSelect,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-contrib-calendar',
    templateUrl: './demo-contrib-calendar.component.html',
    styleUrls: ['./demo-contrib-calendar.component.scss'],
    imports: [
        ReactiveFormsModule,
        CodeTabsComponent,
        MagmaContribCalendar,
        MagmaInput,
        MagmaInputSelect,
        MagmaInputElement,
        MagmaInputNumber,
        MagmaInputDate,
    ],
})
export class DemoContribCalendarComponent {
    private readonly fbe = inject(FormBuilderExtended);
    private readonly fb = inject(FormBuilder);

    langues: Select2Data = [
        { value: '', label: '(empty)' },
        { value: 'en', label: 'English' },
        { value: 'fr', label: 'French' },
        { value: 'es', label: 'Spanish' },
        { value: 'de', label: 'German' },
        { value: 'it', label: 'Italian' },
        { value: 'pt', label: 'Portuguese' },
        { value: 'ru', label: 'Russian' },
        { value: 'zh', label: 'Chinese' },
        { value: 'ja', label: 'Japanese' },
        { value: 'ar', label: 'Arabic' },
        { value: 'hi', label: 'Hindi' },
        { value: 'nl', label: 'Dutch' },
        { value: 'sv', label: 'Swedish' },
        { value: 'fi', label: 'Finnish' },
        { value: 'da', label: 'Danish' },
        { value: 'no', label: 'Norwegian' },
        { value: 'pl', label: 'Polish' },
        { value: 'tr', label: 'Turkish' },
        { value: 'ko', label: 'Korean' },
        { value: 'vi', label: 'Vietnamese' },
        { value: 'th', label: 'Thai' },
        { value: 'id', label: 'Indonesian' },
    ];

    ctrlForm: FormGroup<{
        lang: FormControl<string>;
    }>;
    formArray: FormGroup;

    codeHtml = '';
    codeTs = '';

    constructor() {
        this.ctrlForm = this.fbe.groupWithErrorNonNullable({
            lang: { default: '' },
        });

        this.ctrlForm.valueChanges.subscribe(() => {
            this.codeGeneration();
        });

        // list

        const initialItems = [
            { date: '2024-12-12', value: 1 },
            { date: '2025-03-10', value: 15 },
            { date: '2025-08-14', value: 6 },
        ];

        this.formArray = this.fb.group({
            items: this.fb.array(initialItems.map(item => this.createItem(item))),
        });

        this.formArray.valueChanges.subscribe(() => {
            this.codeGeneration();
        });

        this.codeGeneration();
    }

    codeGeneration() {
        // tag root

        const json: Json2htmlRef = {
            tag: 'mg-contrib-calendar',
            attrs: {},
        };
        const attrs: Json2htmlAttr = json.attrs!;

        // tag attr

        if (this.ctrlForm.value.lang) {
            attrs['lang'] = this.ctrlForm.value.lang;
        }

        attrs['[calendar]'] = 'calendar';

        this.codeHtml = new Json2html(json).toString();

        this.codeTs = `import { MagmaContribCalendar } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    styleUrls: ['./my-component.component.scss'],
    imports: [
        MagmaContribCalendar
    ],
})
export class DemoContribCalendarComponent {
    calendar = ${new Json2Js(this.items.value, { tabAdded: 1 }).toString().replaceAll('T00:00:00.000Z', '')};
}`;
    }

    createItem(item?: { date: string; value: number }): FormGroup {
        return this.fb.group({
            date: [item?.date || '', [Validators.required]],
            value: [item?.value || '', [Validators.required]],
        });
    }

    get items(): FormArray {
        return this.formArray.get('items') as FormArray;
    }

    addItem(): void {
        this.items.push(this.createItem());
    }

    removeItem(index: number): void {
        this.items.removeAt(index);
    }
}
