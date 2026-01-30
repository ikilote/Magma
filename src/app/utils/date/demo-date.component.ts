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
    MagmaInputRadio,
    MagmaInputText,
    addDuration,
    getWeek,
    isISODate,
    toISODate,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-date',
    templateUrl: './demo-date.component.html',
    styleUrl: './demo-date.component.scss',
    imports: [
        ReactiveFormsModule,
        CodeTabsComponent,
        MagmaInput,
        MagmaInputText,
        MagmaInputCheckbox,
        MagmaInputNumber,
        MagmaInputText,
        MagmaInputRadio,
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
    codeTsTest = `import { isISODate } from '@ikilote/magma';

@Component({ ... })
export class TestComponent {
    testStringDate(value: string): boolean {
        return isISODate(value);
    }
}`;

    codeTsDate = `import { toISODate } from '@ikilote/magma';

@Component({ ... })
export class TestComponent {
    addDuration(number: number, duration: DurationTime): Date {
        return addDuration(number, duration);
    }
}`;
    codeTsWeek = `import { getWeek } from '@ikilote/magma';

@Component({ ... })
export class TestComponent {
    getWeek(
        date: string,
        dowOffset: 'Monday' | 'Sunday' | 'Saturday' | undefined,
        firstWeekContainsDay: 1 | 4 | undefined,
    ): number {
        return getWeek(new Date(date), { dowOffset, firstWeekContainsDay });
    }
}`;

    ctrlForm: FormGroup<{
        date: FormControl<string>;
        newDate: FormControl<boolean>;
    }>;

    ctrlFormTest: FormGroup<{
        test: FormControl<string>;
    }>;

    ctrlFormDate: FormGroup<{
        number: FormControl<number>;
    }>;

    ctrlFormWeek: FormGroup<{
        date: FormControl<string>;
        dowOffset: FormControl<'Monday' | 'Sunday' | 'Saturday'>;
        firstWeekContainsDay: FormControl<1 | 4>;
    }>;

    duration = DurationTime;

    constructor() {
        this.ctrlForm = this.fb.groupWithError({
            date: { default: '2012-12-06' },
            newDate: { default: false },
        });
        this.ctrlFormTest = this.fb.groupWithError({
            test: { default: '2012-12-06T00:00:00.000Z' },
        });
        this.ctrlFormDate = this.fb.groupWithError({
            number: { default: 15 },
        });
        this.ctrlFormWeek = this.fb.groupWithError({
            date: { default: '2015-01-01' },
            dowOffset: { default: 'Monday' as 'Monday' | 'Sunday' | 'Saturday' },
            firstWeekContainsDay: { default: 4 as 1 | 4 },
        });
    }

    getDate(value: string | undefined, newDate: boolean): string | undefined {
        return toISODate(value ? new Date(value) : undefined, newDate);
    }

    testStringDate(value: string): boolean {
        return isISODate(value);
    }

    addDuration(number: number | undefined, duration: DurationTime): Date {
        return addDuration(number || 0, duration);
    }

    getWeek(
        date: string,
        dowOffset: 'Monday' | 'Sunday' | 'Saturday' | undefined,
        firstWeekContainsDay: 1 | 4 | undefined,
    ): number {
        return getWeek(new Date(date), { dowOffset, firstWeekContainsDay });
    }
}
