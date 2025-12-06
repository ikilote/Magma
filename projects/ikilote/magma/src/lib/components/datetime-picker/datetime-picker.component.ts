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

import { Select2Data } from 'ng-select2-component';

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
    readonly logger = inject(Logger);
    readonly cd = inject(ChangeDetectorRef);
    readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

    readonly lang = input<string | undefined>();
    readonly value = input<string | undefined>('');
    readonly embedded = input(false, { transform: booleanAttribute });
    readonly readonly = input(false, { transform: booleanAttribute });
    readonly firstDayOfWeek = input<'Monday' | 'Sunday' | 'Saturday' | undefined>();

    readonly datetimeChange = output<string>();

    protected date = signal<Date>(new Date());
    protected selected = signal<boolean>(false);
    protected year = computed<number>(() => this.date().getFullYear());
    protected month = computed<number>(() => this.date().getMonth() + 1);
    protected day = computed<number>(() => this.date().getDate());

    protected yearsList: Select2Data = [
        { value: 2023, label: '2023' },
        { value: 2024, label: '2024' },
        { value: 2025, label: '2025' },
        { value: 2026, label: '2026' },
    ];

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
