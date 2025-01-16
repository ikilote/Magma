import { Directive, OnChanges, OnInit, SimpleChanges, computed, inject, input, output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

import { MagmaInput } from './input.component';

import { Logger } from '../../services/logger';

@Directive({
    selector: 'mg-input-common',
})
export class MagmaInputCommon implements ControlValueAccessor, OnInit, OnChanges {
    protected readonly host = inject(MagmaInput, { optional: false, host: true });
    protected readonly logger = inject(Logger);

    readonly value = input();

    protected _baseValue = 'value';

    readonly formControlName = input<string>();
    readonly name = input<string>();
    readonly id = input<string>();

    readonly update = output<any>();

    readonly componentName: string = 'input-common';
    protected counter = 0;
    protected readonly uid = computed<string>(() => `${this.componentName}-${this.counter}`);

    _name = computed<string>(() => this.formControlName() || this.name() || this.id() || this.uid());
    _id = computed<string>(() => this.id() || this.uid());

    protected _value = '';

    protected onError = false;

    ngOnInit(): void {
        if (!this.host) {
            this.onError = true;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes[this._baseValue]) {
            this.writeValue(changes[this._baseValue].currentValue);
        }
    }

    onChange: (value: any) => void = () => {};
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
