import { ChangeDetectionStrategy, Component, ElementRef, input, viewChildren } from '@angular/core';
import { FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { MagmaInputCommon } from './input-common';

import { MagmaStopPropagationDirective } from '../../directives/stop-propagation.directive';
import { MagmaDatetimeType } from '../datetime-picker/datetime-picker.component';
import { MagmaDatetimePicker } from '../datetime-picker/datetime-picker.directive';

let counter = 0;

@Component({
    selector: 'mg-input-date',
    templateUrl: './input-date.component.html',
    styleUrls: ['./input-date.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, FormsModule, MagmaDatetimePicker, MagmaStopPropagationDirective],
    providers: [
        { provide: MagmaInputCommon, useExisting: MagmaInputDate },
        { provide: NG_VALUE_ACCESSOR, useExisting: MagmaInputDate, multi: true },
        { provide: NG_VALIDATORS, useExisting: MagmaInputDate, multi: true },
    ],
    host: {
        '[id]': '_id()',
    },
})
export class MagmaInputDate extends MagmaInputCommon<(string | { label?: string; value: string })[]> {
    override readonly componentName: string = 'input-date';
    protected override counter = counter++;

    readonly type = input<MagmaDatetimeType | 'month' | 'week'>('date');

    readonly input = viewChildren<ElementRef<HTMLInputElement>>('input');

    override get inputElement(): HTMLInputElement | undefined {
        return this.input()?.[0]?.nativeElement;
    }

    override writeValue(value: any): void {
        super.writeValue(value);
        this.inputElement!.value = value ?? '';
    }

    changeValue(event: Event) {
        const value = ((event as InputEvent).target as HTMLInputElement).value;
        super.writeValue(value);
        this.onChange(value);
        this.update.emit(value);
    }

    inputValue(event: Event) {
        const value = ((event as InputEvent).target as HTMLInputElement).value;
        super.writeValue(value);
        this.onChange(value);
    }

    focus(focus: boolean) {
        if (!focus) {
            this.onTouched();
            if (this.ngControl?.control) {
                this.validate(this.ngControl.control);
            }
        }
    }

    dateClose(date: string) {
        this.onChange(date);
        this.writeValue(date);
        this.onTouched();
        if (this.ngControl?.control) {
            this.validate(this.ngControl.control);
        }
    }
}
