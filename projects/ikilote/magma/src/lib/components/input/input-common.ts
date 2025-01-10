import { Directive, OnChanges, OnInit, SimpleChanges, inject, input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

import { MagmaInput } from './input.component';

@Directive({
    selector: 'mg-input-common',
})
export class MagmaInputCommon implements ControlValueAccessor, OnInit, OnChanges {
    readonly host = inject(MagmaInput, { optional: false, host: true });

    readonly value = input();

    protected _value = '';

    protected onError = false;

    ngOnInit(): void {
        if (!this.host) {
            this.onError = true;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['value']) {
            this.writeValue(changes['value'].currentValue);
        }
    }

    onChange: (value: string) => void = () => {};
    onTouched: () => void = () => {};

    writeValue(value: any): void {
        this._value = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
}
