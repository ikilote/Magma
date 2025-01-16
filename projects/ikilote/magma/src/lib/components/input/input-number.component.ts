import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnInit,
    booleanAttribute,
    forwardRef,
    input,
    numberAttribute,
    viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { MagmaInputCommon } from './input-common';

let counter = 0;

@Component({
    selector: 'mg-input-number',
    templateUrl: './input-number.component.html',
    styleUrls: ['./input-number.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: MagmaInputCommon, useExisting: MagmaInputNumber },
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MagmaInputNumber), multi: true },
    ],
    host: {
        '[id]': '_id()',
        '[class.show-arrows]': 'showArrows()',
    },
})
export class MagmaInputNumber extends MagmaInputCommon implements OnInit {
    override readonly componentName = 'input-number';
    protected override counter = counter++;

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

    readonly step = input(1, { transform: numberAttribute });
    readonly showArrows = input(false, { transform: booleanAttribute });

    readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');

    get inputElement(): HTMLInputElement {
        return this.input()?.nativeElement;
    }

    changeValue(event: Event) {
        const value = ((event as InputEvent).target as HTMLInputElement).value;
        this.onChange(value);
        this.update.emit(value);
    }

    inputValue(event: Event) {
        const value = ((event as InputEvent).target as HTMLInputElement).value;
        this.onChange(value);
    }

    focus(value: boolean) {
        if (!value) {
            this.onTouched();
        }
    }

    keydown(event: KeyboardEvent) {
        console.log('key', event.key, this.inputElement.value, this.inputElement.value.includes(event.key));
        if (MagmaInputNumber.acceptKeys.includes(event.key)) {
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
}
