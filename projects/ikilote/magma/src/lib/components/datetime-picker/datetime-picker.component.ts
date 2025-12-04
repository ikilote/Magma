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

import { Logger } from '../../services/logger';
import { MagmaInputSelect } from '../input/input-select.component';
import { MagmaInput } from '../input/input.component';

export type Dates = {
    date: Date;
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
};

@Component({
    selector: 'datetime-picker',
    templateUrl: './datetime-picker.component.html',
    styleUrls: ['./datetime-picker.component.scss'],
    imports: [FormsModule, MagmaInput, MagmaInputSelect],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {},
})
export class MagmaDatetimePickerComponent {
    readonly logger = inject(Logger);
    readonly cd = inject(ChangeDetectorRef);

    readonly lang = input<string | undefined>();

    readonly value = input<string | undefined>('');
    readonly readonly = input(false, { transform: booleanAttribute });

    protected year: number;
    protected month: number;
    protected day: number;

    protected yearsList = [];
    protected monthsList = [];
    protected daysList = [];

    datetimeChange = output<string>();

    firstDayOfWeek = input<'Monday' | 'Sunday' | 'Saturday' | undefined>();

    constructor() {
        const date = new Date();
        this.year ??= date.getFullYear();
        this.month ??= date.getMonth() + 1;
        this.day ??= date.getDate();
    }

    protected computedDays = computed(() =>
        Array.from({ length: 7 }, (_, i) => {
            const date = new Date(2024, 0, this.getFirstGet(this.firstDayOfWeek()) + i + 1);
            return date.toLocaleString(this.lang() || 'en', { weekday: 'narrow' });
        }),
    );

    protected computedDaysOfMonth = computed<Dates[]>(() => {
        const year = this.year;
        const month = this.month;

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

        const days: Dates[] = [];

        while (currentLoopDate <= lastDayOfMonth || currentLoopDate.getDay() !== startOfWeek) {
            const isCurrentMonth = currentLoopDate.getMonth() === month;
            const date = new Date(currentLoopDate);
            days.push({
                date,
                day: date.getDate(),
                isCurrentMonth: isCurrentMonth,
                isToday: new Date().toDateString() === currentLoopDate.toDateString(),
            });

            currentLoopDate.setDate(currentLoopDate.getDate() + 1);
        }

        return days;
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
