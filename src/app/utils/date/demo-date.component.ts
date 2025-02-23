import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import {
    FormBuilderExtended,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputText,
    toISODate,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-date',
    templateUrl: './demo-date.component.html',
    styleUrls: ['./demo-date.component.scss'],
    imports: [
        ReactiveFormsModule,
        CodeTabsComponent,
        MagmaInput,
        MagmaInputText,
        MagmaInputCheckbox,
        MagmaInputElement,
    ],
})
export class DemoDateComponent {
    readonly fb = inject(FormBuilderExtended);

    codeTs = `@Component({
    selector: 'demo-test',
    templateUrl: './demo-test.component.html',
    styleUrls: ['./demo-test.component.scss'],
    imports: [],
})
export class TestComponent {
    getDate(value: string | undefined, newDate: boolean): string | undefined {
        return toISODate(value ? new Date(value) : undefined, newDate);
    }
}`;

    ctrlForm: FormGroup<{
        date: FormControl<string>;
        newDate: FormControl<boolean>;
    }>;

    constructor() {
        this.ctrlForm = this.fb.groupWithErrorNonNullable({
            date: { default: '2012-12-06' },
            newDate: { default: false },
        });
    }

    getDate(value: string | undefined, newDate: boolean): string | undefined {
        return toISODate(value ? new Date(value) : undefined, newDate);
    }
}
