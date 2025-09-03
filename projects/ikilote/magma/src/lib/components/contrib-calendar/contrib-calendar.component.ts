import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface ContribCalendarDay<date = string | Date> {
    date: date;
    value: number;
}

export type ContribCalendar<date = string | Date> = ContribCalendarDay<date>[];

@Component({
    selector: 'mg-contrib-calendar',
    templateUrl: './contrib-calendar.component.html',
    styleUrls: ['./contrib-calendar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePipe],
})
export class MagmaContribCalendar {
    lang = input<undefined | string>('en');

    calendar = input.required<ContribCalendar>();

    protected computedDays = computed(() =>
        Array.from({ length: 7 }, (_, i) => {
            const date = new Date(2024, 0, i + 1);
            return date.toLocaleString(this.lang() || 'en', { weekday: 'narrow' });
        }),
    );

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
        let day = this.sortedCalendar()[0].date.getDay();
        return day === 0 ? 7 : day;
    });

    protected mouths = computed(() => {
        return this.listOfMonths(this.sortedCalendar());
    });

    private createListDates(map: ContribCalendar<Date>) {
        const minDate = map[0].date;
        const maxDate = map[map.length - 1].date;

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

        const firstMonday = new Date(map[0].date);
        const day = (firstMonday.getUTCDay() || 7) - 1;
        if (day) {
            firstMonday.setUTCDate(firstMonday.getUTCDate() - day);
        }

        // first mouth

        const firstDayOfMonth = new Date(map[0].date);
        firstDayOfMonth.setUTCDate(1);

        // max date

        const maxDate = map[map.length - 1].date;

        const months: { name: string; pos: number }[] = [];

        // Generate the months and calculate the number of cumulative weeks since the 1st day of the first month
        for (let d = firstDayOfMonth; d <= maxDate; d.setUTCMonth(d.getUTCMonth() + 1)) {
            const year = d.getUTCFullYear();
            const month = d.getUTCMonth();
            const firstDayOfCurrentMonth = new Date(Date.UTC(year, month, 1));

            // Calculate the number of weeks between the 1st day of the first month and the 1st day of the current month
            const diffTime = firstDayOfCurrentMonth.getTime() - firstMonday.getTime();
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
}
