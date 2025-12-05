import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    booleanAttribute,
    computed,
    inject,
    input,
    output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Select2Data } from 'ng-select2-component';

import { MagmaClickEnterDirective } from '../../directives/click-enter.directive';
import { Logger } from '../../services/logger';
import { MagmaInputSelect } from '../input/input-select.component';
import { MagmaInput } from '../input/input.component';

export type DateInfo = {
    date: Date;
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
};

@Component({
    selector: 'datetime-picker',
    templateUrl: './datetime-picker.component.html',
    styleUrls: ['./datetime-picker.component.scss'],
    imports: [CommonModule, FormsModule, MagmaInput, MagmaInputSelect, MagmaClickEnterDirective],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {},
})
export class MagmaDatetimePickerComponent {
    readonly logger = inject(Logger);
    readonly cd = inject(ChangeDetectorRef);

    readonly lang = input<string | undefined>();
    readonly value = input<string | undefined>('');
    readonly readonly = input(false, { transform: booleanAttribute });
    readonly firstDayOfWeek = input<'Monday' | 'Sunday' | 'Saturday' | undefined>();

    readonly datetimeChange = output<string>();

    protected year: number;
    protected month: number;
    protected day: number;

    protected yearsList: Select2Data = [{ value: 2025, label: '2025' }];

    constructor() {
        const date = new Date();
        this.year ??= date.getFullYear();
        this.month ??= date.getMonth() + 1;
        this.day ??= date.getDate();
    }

    protected select(date: DateInfo) {}

    protected left() {}
    protected right() {}

    protected monthsList = computed<Select2Data>(() =>
        Array.from({ length: 12 }, (_, i) => {
            const date = new Date(2024, i, 1);
            return date.toLocaleString(this.lang() || 'en', { month: 'long' });
        }).map((name, i) => ({ value: i + 1, label: name })),
    );

    protected computedDays = computed(() =>
        Array.from({ length: 7 }, (_, i) => {
            const date = new Date(2024, 0, this.getFirstGet(this.firstDayOfWeek()) + i + 1);
            return date.toLocaleString(this.lang() || 'en', { weekday: 'narrow' });
        }),
    );

    protected computedDaysOfMonth = computed<DateInfo[][]>(() => {
        const year = this.year;
        const month = this.month - 1;

        let startOfWeek = 1;
        if (this.firstDayOfWeek() === 'Saturday') {
            startOfWeek = 6;
        } else if (this.firstDayOfWeek() === 'Sunday') {
            startOfWeek = 0;
        }

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const startDay = firstDayOfMonth.getDay();

        const diff = (startDay - startOfWeek + 7) % 7;

        const currentLoopDate = new Date(firstDayOfMonth);
        currentLoopDate.setDate(firstDayOfMonth.getDate() - diff);
        const today = new Date();

        const days: DateInfo[] = [];

        while (currentLoopDate <= lastDayOfMonth || currentLoopDate.getDay() !== startOfWeek) {
            const date = new Date(currentLoopDate);
            days.push({
                date,
                day: date.getDate(),
                isCurrentMonth: currentLoopDate.getMonth() === month,
                isToday: today.toDateString() === currentLoopDate.toDateString(),
            });

            currentLoopDate.setDate(currentLoopDate.getDate() + 1);
        }

        return [days];
    });

    private getFirstGet(day: 'Monday' | 'Sunday' | 'Saturday' | undefined) {
        switch (day) {
            case 'Sunday':
                return -1;
            case 'Saturday':
                return -2;
            default:
                return 0;
        }
    }
}
