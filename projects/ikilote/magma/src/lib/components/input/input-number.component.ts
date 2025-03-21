import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnInit,
    booleanAttribute,
    forwardRef,
    input,
    viewChildren,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MagmaInputCommon } from './input-common';

import { NumFormatPipe } from '../../pipes/num-format';
import { numberAttributeOrUndefined } from '../../utils/coercion';

let counter = 0;

@Component({
    selector: 'mg-input-number',
    templateUrl: './input-number.component.html',
    styleUrls: ['./input-number.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: MagmaInputCommon, useExisting: MagmaInputNumber },
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MagmaInputNumber), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => MagmaInputNumber), multi: true },
    ],
    host: {
        '[id]': '_id()',
        '[class.show-arrows]': 'showArrows()',
        '[attr.data-number]': 'numberFormat.transform(_value, formater())',
    },
})
export class MagmaInputNumber
    extends MagmaInputCommon<(number | { label?: string; value: number })[]>
    implements OnInit
{
    override readonly componentName = 'input-number';
    protected override counter = counter++;
    protected numberFormat = new NumFormatPipe();

    static readonly acceptKeys = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '-',
        '.',
        ',',
        'ArrowLeft',
        'ArrowRight',
        'ArrowDown',
        'ArrowUp',
        'Backspace',
        'Delete',
        'Tab',
    ];

    readonly step = input(1, { transform: numberAttributeOrUndefined });
    readonly min = input(undefined, { transform: numberAttributeOrUndefined });
    readonly max = input(undefined, { transform: numberAttributeOrUndefined });
    readonly forceMinMax = input(false, { transform: booleanAttribute });
    readonly showArrows = input(false, { transform: booleanAttribute });
    readonly formater = input<string | Intl.NumberFormatOptions>();
    readonly noDecimal = input(false, { transform: booleanAttribute });
    readonly noNegative = input(false, { transform: booleanAttribute });

    readonly input = viewChildren<ElementRef<HTMLInputElement>>('input');

    override get inputElement(): HTMLInputElement {
        return this.input()?.[0]?.nativeElement;
    }

    override writeValue(value: any): void {
        super.writeValue(value);
        this.inputElement!.value = value ?? '';
    }

    changeValue(event: Event) {
        this.update.emit(this.inputValue(event));
    }

    inputValue(event: Event) {
        const input = this.getInput(event);
        const value = this.forceValue(input.value !== '' ? +input.value : undefined);
        this._value = value;
        this.onChange(value);
        return value;
    }

    focus(event: Event, focus: boolean) {
        if (!focus) {
            const input = this.getInput(event);
            if (input.value !== this._value) {
                input.value = this._value;
            }
            this.onTouched();
            if (!focus) {
                this.onTouched();
                if (this.ngControl?.control) {
                    this.validate(this.ngControl.control);
                }
            }
        }
    }

    keydown(event: KeyboardEvent) {
        if (MagmaInputNumber.acceptKeys.includes(event.key)) {
            if (
                (this.noDecimal() && (event.key === '.' || event.key === ',')) ||
                (this.noNegative() && event.key === '-')
            ) {
                event.preventDefault();
                return;
            }

            if (this.inputElement.value.includes('.') && (event.key === '.' || event.key === ',')) {
                event.preventDefault();
            } else if (event.key === '-') {
                if (`${this.inputElement.value}`.includes('-')) {
                    event.preventDefault();
                } else {
                    this.inputElement.value = `-${this.inputElement.value}`;
                    this.changeValue(event);
                    event.preventDefault();
                }
            }
        } else {
            event.preventDefault();
        }
    }

    private forceValue(value: number | undefined) {
        if (this.forceMinMax()) {
            const min = this.min();
            if (min !== undefined && !Number.isNaN(min)) {
                if ((value || 0) < min) {
                    value = min;
                }
            }
            const max = this.max();
            if (max !== undefined && !Number.isNaN(max)) {
                if ((value || 0) > max) {
                    value = max;
                }
            }
        }
        return value;
    }

    private getInput(event: Event): HTMLInputElement {
        return (event as InputEvent).target as HTMLInputElement;
    }
}
