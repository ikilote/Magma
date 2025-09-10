import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import {
    DurationTime,
    FormBuilderExtended,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputText,
    addDuration,
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
        MagmaInputNumber,
        MagmaInputElement,
        DatePipe,
    ],
})
export class DemoDateComponent {
    readonly fb = inject(FormBuilderExtended);

    codeTs = `import { toISODate } from '@ikilote/magma';

@Component({ ... })
export class TestComponent {
    getDate(value: string | undefined, newDate: boolean): string | undefined {
        return toISODate(value ? new Date(value) : undefined, newDate);
    }
}`;

    codeTsDate = `import { toISODate } from '@ikilote/magma';

@Component({ ... })
export class TestComponent {
    addDuration(number: number, duration: DurationTime): Date {
        return addDuration(number, duration);
    }
}`;

    ctrlForm: FormGroup<{
        date: FormControl<string>;
        newDate: FormControl<boolean>;
    }>;

    ctrlFormDate: FormGroup<{
        number: FormControl<number>;
    }>;

    duration = DurationTime;

    constructor() {
        this.ctrlForm = this.fb.groupWithErrorNonNullable({
            date: { default: '2012-12-06' },
            newDate: { default: false },
        });
        this.ctrlFormDate = this.fb.groupWithErrorNonNullable({
            number: { default: 15 },
        });
    }

    getDate(value: string | undefined, newDate: boolean): string | undefined {
        return toISODate(value ? new Date(value) : undefined, newDate);
    }

    addDuration(number: number | undefined, duration: DurationTime): Date {
        return addDuration(number || 0, duration);
    }
}
