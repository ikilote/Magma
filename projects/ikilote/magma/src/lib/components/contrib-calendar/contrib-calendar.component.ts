import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, computed, input } from '@angular/core';

import { RepeatForPipe } from '../../pipes/repeat-for.pipe';

export interface ContribCalendarDay<date = string | Date> {
    date: date;
    value: number;
}

export type ContribCalendar<date = string | Date> = ContribCalendarDay<date>[];
export type MagmaContribCalendarSteps = { value: number; color: string }[];

export type MagmaContribCalendarDays = 'Monday' | 'Sunday' | 'Saturday' | undefined;

@Directive({ selector: 'mg-contrib-calendar-desc' })
export class MagmaContribCalendarDesc {}

@Component({
    selector: 'mg-contrib-calendar',
    templateUrl: './contrib-calendar.component.html',
    styleUrl: './contrib-calendar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePipe, RepeatForPipe],
    host: {
        '[style.--size]': 'size()',
    },
})
export class MagmaContribCalendar {
    readonly lang = input<string | undefined>();

    readonly min = input<string | number | Date | undefined>();

    readonly max = input<string | number | Date | undefined>();

    readonly calendar = input.required<ContribCalendar>();

    readonly steps = input<MagmaContribCalendarSteps>([
        { value: 1, color: 'var(--contrib-calendar-tile-color-lvl1)' },
        { value: 6, color: 'var(--contrib-calendar-tile-color-lvl2)' },
        { value: 11, color: 'var(--contrib-calendar-tile-color-lvl3)' },
        { value: 16, color: 'var(--contrib-calendar-tile-color-lvl4)' },
    ]);

    readonly firstDayOfWeek = input<MagmaContribCalendarDays>();

    protected computedDays = computed(() =>
        Array.from({ length: 7 }, (_, i) => {
            const date = new Date(2024, 0, this.getFirstGet(this.firstDayOfWeek()) + i + 1);
            return date.toLocaleString(this.lang() || 'en', { weekday: 'narrow' });
        }),
    );

    private getFirstGet(day: MagmaContribCalendarDays) {
        switch (day) {
            case 'Sunday':
                return -1;
            case 'Saturday':
                return -2;
            default:
                return 0;
        }
    }

    protected sortedCalendar = computed(() => {
        const map = this.calendar()
            .map(e => {
                if (typeof e.date === 'string') {
                    e.date = new Date(e.date);
                }
                return e as ContribCalendarDay<Date>;
            })
            .filter(e => e.date instanceof Date && typeof e.value === 'number');
        map.sort((a, b) => a.date.getTime() - b.date.getTime());
        return map;
    });

    protected computedCalendar = computed(() => {
        return this.createListDates(this.sortedCalendar());
    });

    protected firstPos = computed(() => {
        let day = (this.minDate(this.sortedCalendar()).getDay() - this.getFirstGet(this.firstDayOfWeek())) % 7;
        return day === 0 ? 7 : day;
    });

    protected mouths = computed(() => {
        return this.listOfMonths(this.sortedCalendar());
    });

    protected size = computed(() => {
        return this.numberWeek(this.sortedCalendar());
    });

    protected getColor(value: number) {
        const t = this.steps();
        if (value < t[0].value) {
            return undefined;
        }
        const l = t.length - 1;
        if (value < t[l].value) {
            for (let i = 0; i <= l - 1; i++) {
                if (i < l && value >= t[i].value && value < t[i + 1].value) {
                    return t[i].color;
                }
            }
        }
        return t[l].color;
    }

    private createListDates(map: ContribCalendar<Date>) {
        const minDate = this.minDate(map);
        const maxDate = this.maxDate(map);

        const allDates: Date[] = [];
        for (let d = new Date(minDate); d <= maxDate; d.setUTCDate(d.getUTCDate() + 1)) {
            allDates.push(new Date(d));
        }

        const dateValueMap = new Map<number, number>();
        map.forEach(e => {
            dateValueMap.set(e.date.getTime(), e.value);
        });

        return allDates.map(date => {
            const time = date.getTime();
            return {
                date,
                value: dateValueMap.has(time) ? dateValueMap.get(time)! : 0,
                odd: (date.getUTCMonth() + 1) % 2,
            } as ContribCalendarDay<Date> & { odd: number };
        });
    }

    private listOfMonths(map: ContribCalendar<Date>) {
        // first Monday

        const firstDayWeek = this.minDate(map);
        const day = (firstDayWeek.getUTCDay() || 7) - 1 + this.getFirstGet(this.firstDayOfWeek());
        if (day) {
            firstDayWeek.setUTCDate(firstDayWeek.getUTCDate() - day);
        }

        // first mouth

        const firstDayOfMonth = this.minDate(map);
        firstDayOfMonth.setUTCDate(1);

        // max date

        const maxDate = this.maxDate(map);

        const months: { name: string; pos: number }[] = [];

        // Generate the months and calculate the number of cumulative weeks since the 1st day of the first month
        for (let d = firstDayOfMonth; d <= maxDate; d.setUTCMonth(d.getUTCMonth() + 1)) {
            const year = d.getUTCFullYear();
            const month = d.getUTCMonth();
            const firstDayOfCurrentMonth = new Date(Date.UTC(year, month, 1));

            // Calculate the number of weeks between the 1st day of the first month and the 1st day of the current month
            const diffTime = firstDayOfCurrentMonth.getTime() - firstDayWeek.getTime();
            const pos = diffTime > 0 ? Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000)) : 0; // + 1 for grid-column

            months.push({
                name: firstDayOfCurrentMonth.toLocaleString(this.lang() || 'en', { month: 'short' }),
                pos,
            });
        }

        // Deletion of the first month if there is an overlap

        if (months.length > 1 && months[0].pos === months[1].pos) {
            months.shift();
        }

        return months;
    }

    private numberWeek(map: ContribCalendar<Date>) {
        // first day of the week

        const firstDayWeek = this.minDate(map);
        const day = (firstDayWeek.getUTCDay() || 7) - 1 + this.getFirstGet(this.firstDayOfWeek());
        if (day) {
            firstDayWeek.setUTCDate(firstDayWeek.getUTCDate() - day);
        }

        // number of weeks

        const diffTime = this.maxDate(map).getTime() - firstDayWeek.getTime();
        return Math.ceil(diffTime / (7 * 24 * 60 * 60 * 1000));
    }

    private minDate(map: ContribCalendar<Date>): Date {
        return (this.min() ? new Date(this.min()!) : null) || new Date(map[0].date);
    }

    private maxDate(map: ContribCalendar<Date>): Date {
        return (this.max() ? new Date(this.max()!) : null) || new Date(map[map.length - 1].date);
    }
}
