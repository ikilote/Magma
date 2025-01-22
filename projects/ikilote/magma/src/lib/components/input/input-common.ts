import { Directive, Injector, OnChanges, OnInit, SimpleChanges, computed, inject, input, output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl, ValidationErrors } from '@angular/forms';

import { MagmaInput } from './input.component';

import { ParamsMessagesControlMessage } from '../../services/form-builder-extended';
import { Logger } from '../../services/logger';

@Directive({})
export class MagmaInputCommon implements ControlValueAccessor, OnInit, OnChanges, ControlValueAccessor {
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

    private injector = inject(Injector);

    ngControl: NgControl | null = null;

    ngOnInit(): void {
        if (!this.host) {
            this.onError = true;
        }
        this.ngControl = this.injector.get(NgControl, null, { self: true, optional: true });
        this.host.ngControl ??= this.ngControl;
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

    validate(control: AbstractControl): ValidationErrors | null {
        if (control.touched) {
            setTimeout(() => {
                let errorMessage: string | undefined = undefined;
                if (control.errors !== null) {
                    const key = Object.keys(control.errors)[0];
                    const data = (control as any).controlData?.[key];

                    if (data) {
                        const message = (data as ParamsMessagesControlMessage)?.message;
                        errorMessage =
                            typeof message === 'function'
                                ? message({
                                      type: key,
                                      errorData: control.errors[key],
                                      state: data.state,
                                  })
                                : message;
                    }
                }
                this.host._errorMessage.set(errorMessage ?? null);
            });
        }
        return null;
    }
}
