import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    booleanAttribute,
    computed,
    inject,
    input,
    output,
    signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Select2Data, Select2Option, Select2ScrollEvent } from 'ng-select2-component';

import { MagmaClickEnterDirective } from '../../directives/click-enter.directive';
import { RepeatForPipe } from '../../pipes/repeat-for.pipe';
import { StringPipe } from '../../pipes/string.pipe';
import { Logger } from '../../services/logger';
import { DurationTime, WeekDay, addDuration, getWeek } from '../../utils/date';
import { MagmaInputSelect } from '../input/input-select.component';
import { MagmaInput } from '../input/input.component';

export type DateInfo = {
    date: Date;
    day: number;
    month: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    disabled: boolean;
    weekend: boolean;
    weekNumber: number | null;
};

let index = 0;

export type MagmaDatetimePickerDays = 'Monday' | 'Sunday' | 'Saturday' | undefined;
export type MagmaDatetimeType = 'date' | 'datetime-local' | 'datetime-seconds' | 'datetime-milli' | 'time' | undefined;

const WEEK: WeekDay[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

@Component({
    selector: 'datetime-picker',
    templateUrl: './datetime-picker.component.html',
    styleUrls: ['./datetime-picker.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        MagmaInput,
        MagmaInputSelect,
        MagmaClickEnterDirective,
        RepeatForPipe,
        StringPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.embedded]': 'embedded()',
        '[class.only-date]': 'type() === "date" || !type()',
        '[class.only-time]': 'type() === "time"',
    },
})
export class MagmaDatetimePickerComponent {
    // inject

    readonly logger = inject(Logger);
    readonly cd = inject(ChangeDetectorRef);
    readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

    // input

    readonly value = input<string | number | Date | undefined>('');
    readonly type = input<MagmaDatetimeType | undefined>();
    readonly lang = input<string | undefined>();
    readonly min = input<string | number | Date | undefined>();
    readonly max = input<string | number | Date | undefined>();
    readonly embedded = input(false, { transform: booleanAttribute });
    readonly readonly = input(false, { transform: booleanAttribute });
    readonly firstDayOfWeek = input<MagmaDatetimePickerDays>();
    readonly weekend = input<WeekDay[]>(['Sunday', 'Saturday']);
    readonly hideWeekend = input(false, { transform: booleanAttribute });
    readonly hideWeekNumber = input(false, { transform: booleanAttribute });

    // output

    readonly datetimeChange = output<string>();

    // internal signals

    protected readonly dateValue = signal<Date>(new Date());
    protected readonly date = computed<Date>(() => this.getDateValue());
    protected readonly selected = signal<boolean>(false);
    protected readonly year = computed<number>(() => this.getDate().getUTCFullYear());
    protected readonly month = computed<number>(() => this.getDate().getUTCMonth() + 1);
    protected readonly day = computed<number>(() => this.getDate().getUTCDate());
    protected readonly hours = computed<number>(() => this.getDate().getUTCHours());
    protected readonly minutes = computed<number>(() => this.getDate().getUTCMinutes());
    protected readonly seconds = computed<number>(() => this.getDate().getUTCSeconds());
    protected readonly past = signal(10);
    protected readonly futur = signal(10);

    protected readonly uid = `datetime-picker-${index++}`;
    protected onscroll = false;

    protected yearsList = computed<Select2Option[]>(() => {
        const min = this.minDate()?.getUTCFullYear();
        const max = this.maxDate()?.getUTCFullYear();

        let year = new Date(this.date()).getUTCFullYear() - this.past();
        if (min) {
            year = Math.max(min, year);
        }

        let end = year + this.past() + this.futur();
        if (max) {
            end = Math.min(max, end);
        }

        const yearsList: Select2Option[] = [];
        for (; year <= end; year++) {
            yearsList.push({ id: `${this.uid}-${year}`, label: `${year}`, value: year });
        }
        return yearsList;
    });

    protected monthsList = computed<Select2Data>(() => {
        const currentDate = this.date();
        const minDate = this.minDate();
        const maxDate = this.maxDate();

        let minMonth = 1;
        let maxMonth = 12;

        if (minDate && currentDate.getUTCFullYear() === minDate.getUTCFullYear()) {
            minMonth = minDate.getUTCMonth() + 1;
        }

        if (maxDate && currentDate.getUTCFullYear() === maxDate.getUTCFullYear()) {
            maxMonth = maxDate.getUTCMonth() + 1;
        }

        return Array.from({ length: 12 }, (_, i) => {
            const monthValue = i + 1;
            return {
                id: `${i}`,
                value: monthValue,
                label: new Date(2024, i, 1).toLocaleString(this.lang() || 'en', { month: 'long' }),
                hide: monthValue < minMonth || monthValue > maxMonth,
            };
        }).filter(e => !e.hide);
    });

    protected prevMonth = computed(() => {
        const currentDate = this.date();
        const minDate = this.minDate();

        return (
            minDate &&
            currentDate.getUTCFullYear() === minDate.getUTCFullYear() &&
            minDate.getUTCMonth() === currentDate.getUTCMonth()
        );
    });

    protected nextMonth = computed(() => {
        const currentDate = this.date();
        const maxDate = this.maxDate();

        return (
            maxDate &&
            currentDate.getUTCFullYear() === maxDate.getUTCFullYear() &&
            maxDate.getUTCMonth() === currentDate.getUTCMonth()
        );
    });

    protected computedDays = computed(() =>
        Array.from({ length: 7 }, (_, i) =>
            new Date(2024, 0, this.getFirstGet(this.firstDayOfWeek()) + i + 1).toLocaleString(this.lang() || 'en', {
                weekday: 'narrow',
            }),
        ),
    );

    protected h = computed(() =>
        Array.from({ length: 7 }, (_, i) =>
            new Date(2024, 0, this.getFirstGet(this.firstDayOfWeek()) + i + 1).toLocaleString(this.lang() || 'en', {
                weekday: 'narrow',
            }),
        ),
    );

    protected computedDaysOfMonth = computed<DateInfo[][]>(() => {
        const date = this.getDate();
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth();

        let startOfWeek = 1;
        if (this.firstDayOfWeek() === 'Saturday') {
            startOfWeek = 6;
        } else if (this.firstDayOfWeek() === 'Sunday') {
            startOfWeek = 0;
        }

        const firstDayOfMonth = new Date(Date.UTC(year, month, 1));
        const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0));
        console.log(firstDayOfMonth);

        const startDay = firstDayOfMonth.getUTCDay();

        const diff = (startDay - startOfWeek + 7) % 7;

        const currentLoopDate = new Date(firstDayOfMonth);
        currentLoopDate.setUTCDate(firstDayOfMonth.getUTCDate() - diff);
        const today = new Date();

        const days: DateInfo[] = [];

        const min = this.minDate()?.getTime();
        const max = this.maxDate()?.getTime();

        while (currentLoopDate <= lastDayOfMonth || currentLoopDate.getUTCDay() !== startOfWeek) {
            const date = new Date(currentLoopDate);
            const datetime = date.getTime();
            days.push({
                date,
                day: date.getUTCDate(),
                month: date.getUTCMonth() + 1,
                isCurrentMonth: currentLoopDate.getUTCMonth() === month,
                isToday: today.toDateString() === currentLoopDate.toDateString(),
                disabled: (min ? datetime < min : false) || (max ? datetime > max : false),
                weekend: !this.hideWeekend() ? this.weekend().includes(WEEK[date.getUTCDay()]) : false,
                weekNumber: !this.hideWeekNumber() ? getWeek(date, { dowOffset: this.firstDayOfWeek() }) : null,
            });

            currentLoopDate.setUTCDate(currentLoopDate.getUTCDate() + 1);
        }

        return [days];
    });

    protected scroll(event: Select2ScrollEvent) {
        if (this.onscroll) {
            return;
        }

        this.onscroll = true;

        setTimeout(() => {
            if (event.way === 'up') {
                this.past.update(value => value + 10);
            } else {
                this.futur.update(value => value + 10);
            }
            this.onscroll = false;
        }, 50);
    }

    protected select(date: DateInfo) {
        this.selected.set(true);

        if (this.date().getUTCMonth() + 1 !== date.month) {
            this.updateMonth(date.month);
            this.updateDay(date.day);
            this.updateDate(this.date());
        } else {
            this.updateDay(date.day);
        }

        setTimeout(() => {
            this.element.nativeElement.querySelector<HTMLDivElement>('.selected')?.focus();
        }, 10);
    }

    protected move(event: KeyboardEvent) {
        if (this.readonly()) {
            return;
        }

        let move = 0;
        switch (event.key) {
            case 'ArrowLeft':
                move = -1;
                break;
            case 'ArrowRight':
                move = +1;
                break;
            case 'ArrowDown':
                move = +7;
                break;
            case 'ArrowUp':
                move = -7;
                break;
        }

        if (move) {
            const list = Array.from(this.element.nativeElement.querySelectorAll<HTMLDivElement>('.day'));
            const index = list.findIndex(e => e.classList.contains('selected'));
            const pos = index + move;
            if (list[pos]) {
                list[pos].click();
            } else {
                this.updateDate(addDuration(move < 0 ? -1 : 1, DurationTime.DAY, this.date()));
            }
        }
    }

    protected updateYear(value: number) {
        const date = this.date();
        date.setUTCFullYear(value);
        this.updateDate(date);
    }

    protected updateMonth(value: number) {
        const date = this.date();
        date.setUTCMonth(value - 1);
        this.updateDate(date);
    }

    protected updateDay(value: number) {
        const date = this.date();
        date.setUTCDate(value);
        this.updateDate(date);
    }

    protected updateHours(value: number) {
        const date = this.date();
        date.setUTCHours(value);
        this.updateDate(date);
    }

    protected updateMinutes(value: number) {
        const date = this.date();
        date.setUTCMinutes(value);
        this.updateDate(date);
    }

    protected updateSeconds(value: number) {
        const date = this.date();
        date.setUTCSeconds(value);
        this.updateDate(date);
    }

    protected updateMilli(value: number) {
        const date = this.date();
        date.setUTCMilliseconds(value);
        this.updateDate(date);
    }

    protected left() {
        const date = this.date();
        date.setUTCMonth(date.getMonth() - 1);
        this.updateDate(date);
    }

    protected right() {
        const date = this.date();
        date.setUTCMonth(date.getMonth() + 1);
        this.updateDate(date);
    }

    protected updateDate(date: Date) {
        this.dateValue.set(new Date(date));

        let value = '';
        switch (this.type()) {
            case 'datetime-local':
                value = date.toISOString().replace(/:..\..*/, '');
                break;
            case 'datetime-seconds':
                value = date.toISOString().replace(/\..*/, '');
                break;
            case 'datetime-milli':
                value = date.toISOString();
                break;
            case 'time':
                value = date.toISOString().replace(/.*T/, '');
                break;
            default:
                value = date.toISOString().replace(/T.*/, '');
                break;
        }
        this.datetimeChange.emit(value);
    }

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

    protected getDate() {
        const minDate = this.minDate();
        const maxDate = this.maxDate();

        if (minDate && this.date().getTime() < minDate.getTime()) {
            return minDate;
        }
        if (maxDate && this.date().getTime() > maxDate.getTime()) {
            return maxDate;
        }
        return this.date();
    }

    private minDate(): Date | null {
        return this.min() ? new Date(this.min()!) : null;
    }

    private maxDate(): Date | null {
        return this.max() ? new Date(this.max()!) : null;
    }

    private getDateValue() {
        let value = this.value();

        if (value) {
            if (value instanceof Date) {
                return value;
            } else if (value === 'number') {
                return new Date(value);
            } else if (typeof value === 'string') {
                return (
                    new Date(
                        Date.UTC(
                            this.valueCacheSubstring(value, 0, 4),
                            Math.max(this.valueCacheSubstring(value, 5, 7) - 1),
                            this.valueCacheSubstring(value, 8, 10),
                            this.valueCacheSubstring(value, 11, 13),
                            this.valueCacheSubstring(value, 14, 16),
                            this.valueCacheSubstring(value, 17, 19),
                            this.valueCacheSubstring(value, 20, 23),
                        ),
                    ) || new Date()
                );
            }
        }
        return new Date();
    }

    private valueCacheSubstring(value: string, a: number, b: number): number {
        return value ? +(value?.substring(a, b) ?? 0) || 0 : 0;
    }
}
