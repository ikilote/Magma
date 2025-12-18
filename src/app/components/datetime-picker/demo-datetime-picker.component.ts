import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';

import {
    FormBuilderExtended,
    MagmaDatetimePicker,
    MagmaDatetimePickerComponent,
    MagmaDatetimePickerDays,
    MagmaDatetimeType,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputDate,
    MagmaInputElement,
    MagmaInputSelect,
} from '../../../../projects/ikilote/magma/src/public-api';
import { dateTypes, days, langues } from '../../common/const';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-datetime-picker',
    templateUrl: './demo-datetime-picker.component.html',
    styleUrls: ['./demo-datetime-picker.component.scss'],
    imports: [
        CodeTabsComponent,
        ReactiveFormsModule,
        MagmaDatetimePickerComponent,
        MagmaDatetimePicker,
        MagmaInput,
        MagmaInputElement,
        MagmaInputCheckbox,
        MagmaInputDate,
        MagmaInputSelect,
    ],
})
export class DemoDatetimePickerComponent {
    readonly fb = inject(FormBuilderExtended);

    langues = langues;
    types = dateTypes;
    days = days;

    ctrlForm: FormGroup<{
        datetime: FormControl<string>;
        readonly: FormControl<boolean>;
        type: FormControl<MagmaDatetimeType>;
        lang: FormControl<string>;
        min: FormControl<string>;
        max: FormControl<string>;
        day: FormControl<MagmaDatetimePickerDays>;
    }>;
    ctrlFormPopup: FormGroup<{
        datetime: FormControl<string>;
        disabled: FormControl<boolean>;
        readonly: FormControl<boolean>;
        type: FormControl<MagmaDatetimeType>;
        lang: FormControl<string>;
        min: FormControl<string>;
        max: FormControl<string>;
        day: FormControl<MagmaDatetimePickerDays>;
    }>;

    datetimeChangeValue = '';
    datetimeCloseValue = '';

    codeHtml = '';
    codeTs = `import { MagmaDatetimePickerComponent } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    styleUrls: ['./my-component.component.scss'],
    imports: [
        MagmaDatetimePickerComponent
    ],
})
export class DemoBlockComponent { }`;

    codeHtmlPopup = '';
    codeTsPopup = `import { MagmaDatetimePicker } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    styleUrls: ['./my-component.component.scss'],
    imports: [
        MagmaDatetimePicker
    ],
})
export class DemoBlockComponent { }`;

    constructor() {
        this.ctrlForm = this.fb.groupWithError({
            datetime: { default: '' },
            readonly: { default: false },
            type: { default: '' as MagmaDatetimeType },
            lang: { default: '' },
            min: { default: '' },
            max: { default: '' },
            day: { default: '' as MagmaDatetimePickerDays },
        });
        this.ctrlFormPopup = this.fb.groupWithError({
            datetime: { default: '' },
            disabled: { default: false },
            readonly: { default: false },
            type: { default: '' as MagmaDatetimeType },
            lang: { default: '' },
            min: { default: '' },
            max: { default: '' },
            day: { default: '' as MagmaDatetimePickerDays },
        });
        this.codeGeneration();
        this.codeGenerationPopup();
        this.ctrlForm.valueChanges.subscribe(() => {
            this.codeGeneration();
        });
        this.ctrlFormPopup.valueChanges.subscribe(() => {
            this.codeGenerationPopup();
        });
    }

    test(data: string, action: string) {
        console.log(data, action);
    }

    codeGeneration() {
        console.log(this.ctrlForm.value);
        // tag root

        const json: Json2htmlRef = {
            tag: 'datetime-picker',
            attrs: {},
        };
        const attrs: Json2htmlAttr = json.attrs!;

        // tag attr

        if (this.ctrlForm.value.datetime) {
            attrs['datetime'] = this.ctrlForm.value.datetime;
        }
        if (this.ctrlForm.value.readonly) {
            attrs['readonly'] = null;
        }
        if (this.ctrlForm.value.min) {
            attrs['min'] = this.ctrlForm.value.min;
        }
        if (this.ctrlForm.value.max) {
            attrs['max'] = this.ctrlForm.value.max;
        }
        if (this.ctrlForm.value.lang) {
            attrs['lang'] = this.ctrlForm.value.lang;
        }
        if (this.ctrlForm.value.day) {
            attrs['firstDayOfWeek'] = this.ctrlForm.value.day;
        }

        attrs['(datetimeChange)'] = 'datetimeChange($event)';

        this.codeHtml = new Json2html(json).toString();
    }

    codeGenerationPopup() {
        // tag root

        const json: Json2htmlRef = {
            tag: 'button',
            attrs: {},
            body: ['Click me'],
        };
        const attrs: Json2htmlAttr = json.attrs!;

        // tag attr

        attrs['datetimePicker'] = this.ctrlFormPopup.value.datetime ? this.ctrlFormPopup.value.datetime : null;

        if (this.ctrlFormPopup.value.disabled) {
            attrs['disabled'] = null;
        }
        if (this.ctrlFormPopup.value.readonly) {
            attrs['datetimePickerReadonly'] = null;
        }
        if (this.ctrlFormPopup.value.min) {
            attrs['datetimePickerMin'] = this.ctrlFormPopup.value.min;
        }
        if (this.ctrlFormPopup.value.max) {
            attrs['datetimePickerMax'] = this.ctrlFormPopup.value.max;
        }
        if (this.ctrlFormPopup.value.lang) {
            attrs['datetimePickerLang'] = this.ctrlFormPopup.value.lang;
        }
        if (this.ctrlFormPopup.value.day) {
            attrs['datetimeFirstDayOfWeek'] = this.ctrlFormPopup.value.day;
        }

        attrs['(datetimeChange)'] = 'datetimeChange($event)';
        attrs['(datetimeClose)'] = 'datetimeClose($event)';

        this.codeHtmlPopup = new Json2html(json).toString();
    }

    datetimeChangeComponent(datetime: string) {
        this.ctrlForm.get('datetime')?.setValue(datetime);
    }

    datetimeChange(datetime: string) {
        this.datetimeChangeValue = datetime;
    }

    datetimeClose(datetime: string) {
        this.datetimeCloseValue = datetime;
        this.ctrlFormPopup.get('datetime')?.setValue(datetime);
    }
}
