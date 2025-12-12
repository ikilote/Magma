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
import { Logger } from '../../services/logger';
import { DurationTime, addDuration } from '../../utils/date';
import { MagmaInputSelect } from '../input/input-select.component';
import { MagmaInput } from '../input/input.component';

export type DateInfo = {
    date: Date;
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
};

let index = 0;

export type MagmaDatetimePickerDays = 'Monday' | 'Sunday' | 'Saturday' | undefined;

@Component({
    selector: 'datetime-picker',
    templateUrl: './datetime-picker.component.html',
    styleUrls: ['./datetime-picker.component.scss'],
    imports: [CommonModule, FormsModule, MagmaInput, MagmaInputSelect, MagmaClickEnterDirective],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.embedded]': 'embedded()',
    },
})
export class MagmaDatetimePickerComponent {
    // inject

    readonly logger = inject(Logger);
    readonly cd = inject(ChangeDetectorRef);
    readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

    // input

    readonly value = input<string | undefined>('');
    readonly lang = input<string | undefined>();
    readonly min = input<string | number | Date | undefined>();
    readonly max = input<string | number | Date | undefined>();
    readonly embedded = input(false, { transform: booleanAttribute });
    readonly readonly = input(false, { transform: booleanAttribute });
    readonly firstDayOfWeek = input<MagmaDatetimePickerDays>();

    // output

    readonly datetimeChange = output<string>();

    // internal signals

    protected readonly date = signal<Date>(new Date());
    protected readonly selected = signal<boolean>(false);
    protected readonly year = computed<number>(() => this.date().getFullYear());
    protected readonly month = computed<number>(() => this.date().getMonth() + 1);
    protected readonly day = computed<number>(() => this.date().getDate());
    protected readonly past = signal(10);
    protected readonly futur = signal(10);

    protected readonly uid = `datetime-picker-${index++}`;
    protected onscroll = false;

    protected yearsList = computed<Select2Option[]>(() => {
        let year = new Date(this.date()).getFullYear() - this.past();
        const l = year + this.past() + this.futur();
        const yearsList: Select2Option[] = [];
        for (; year <= l; year++) {
            yearsList.push({ id: `${this.uid}-${year}`, label: `${year}`, value: year });
        }
        return yearsList;
    });

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
        const date = this.date();
        const year = date.getFullYear();
        const month = date.getMonth();

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

    protected scroll(event: Select2ScrollEvent) {
        if (this.onscroll) {
            return;
        }

        this.onscroll = true;

        setTimeout(() => {
            console.log(event.way);
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
        this.updateDate(date.date);
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
            console.log(event.key, index, move);
            const pos = index + move;
            if (list[pos]) {
                list[pos].click();
            } else {
                this.updateDate(addDuration(move < 0 ? -1 : 1, DurationTime.DAY, this.date()));
            }
        }
    }

    protected updateMonth(value: number) {
        const date = this.date();
        date.setMonth(value - 1);
        this.updateDate(date);
    }

    protected updateYear(value: number) {
        const date = this.date();
        date.setFullYear(value);
        this.updateDate(date);
    }

    protected left() {
        const date = this.date();
        date.setMonth(date.getMonth() - 1);
        this.updateDate(date);
    }

    protected right() {
        const date = this.date();
        date.setMonth(date.getMonth() + 1);
        this.updateDate(date);
    }

    protected updateDate(date: Date) {
        this.date.set(new Date(date));
        this.datetimeChange.emit(date.toISOString().replace(/T.*/, ''));
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
}
