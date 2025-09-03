import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2Js, Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';

import { Select2Data } from 'ng-select2-component';

import {
    ContribCalendar,
    FormBuilderExtended,
    MagmaContribCalendar,
    MagmaInput,
    MagmaInputElement,
    MagmaInputSelect,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-contrib-calendar',
    templateUrl: './demo-contrib-calendar.component.html',
    styleUrls: ['./demo-contrib-calendar.component.scss'],
    imports: [
        MagmaContribCalendar,
        MagmaInput,
        MagmaInputSelect,
        CodeTabsComponent,
        ReactiveFormsModule,
        MagmaInputElement,
    ],
})
export class DemoContribCalendarComponent {
    readonly fb = inject(FormBuilderExtended);

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

    calendar: ContribCalendar = [
        { date: '2024-12-12', value: 1 },
        { date: '2025-03-10', value: 15 },
        { date: '2025-08-14', value: 6 },
    ];

    ctrlForm: FormGroup<{
        lang: FormControl<string>;
    }>;

    codeHtml = '';

    constructor() {
        this.ctrlForm = this.fb.groupWithErrorNonNullable({
            lang: { default: '' },
        });

        this.codeGeneration();
        this.ctrlForm.valueChanges.subscribe(() => {
            this.codeGeneration();
        });
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

        attrs['calendar'] = new Json2Js(this.calendar).toString().replaceAll('T00:00:00.000Z', '');

        this.codeHtml = new Json2html(json).toString();
    }
}
