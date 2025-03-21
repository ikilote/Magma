import {
    ChangeDetectorRef,
    Directive,
    Injector,
    OnChanges,
    OnInit,
    SimpleChanges,
    booleanAttribute,
    computed,
    inject,
    input,
    output,
    signal,
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl, ValidationErrors } from '@angular/forms';

import { Select2 } from 'ng-select2-component';

import { MagmaInput } from './input.component';

import { ParamsMessagesControlMessage } from '../../services/form-builder-extended';
import { Logger } from '../../services/logger';
import { Timing } from '../../utils/timing';

@Directive({})
export class MagmaInputCommon<T = any[]> implements ControlValueAccessor, OnInit, OnChanges, ControlValueAccessor {
    protected readonly host = inject(MagmaInput, { optional: false, host: true });
    protected readonly logger = inject(Logger);
    readonly cd = inject(ChangeDetectorRef);
    private injector = inject(Injector);

    readonly value = input();

    protected _baseValue = 'value';

    readonly formControlName = input<string>();
    readonly name = input<string>();
    readonly id = input<string>();
    readonly placeholder = input<string>();
    readonly placeholderAnimated = input<string>();
    readonly datalist = input<T>();

    /** Whether the element is disabled. */
    readonly disabled = input(false, { transform: booleanAttribute });

    /** Whether the element is readonly. */
    readonly readonly = input(false, { transform: booleanAttribute });

    readonly update = output<any>();

    readonly componentName: string = 'input-common';
    protected counter = 0;
    protected readonly uid = computed<string>(() => `${this.componentName}-${this.counter}`);

    _name = computed<string>(() => this.formControlName() || this.name() || this.id() || this.uid());
    _id = computed<string>(() => this.id() || this.uid());

    get inputElement(): HTMLInputElement | HTMLTextAreaElement | Select2 | undefined {
        return undefined;
    }

    protected _value: any = '';

    protected onError = false;

    protected placeholderTimer: undefined | number = undefined;

    placeholderDisplay = signal<string>('');

    ngControl: NgControl | null = null;

    ngOnInit(): void {
        if (!this.host) {
            this.onError = true;
        }
        this.ngControl = this.injector.get(NgControl, null, { self: true, optional: true });
        this.host.ngControl ??= this.ngControl;
        this.setHostLabelId();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes[this._baseValue]) {
            this.writeValue(changes[this._baseValue].currentValue);
        }
        if (changes['id']) {
            this.setHostLabelId();
        }
        if (changes['placeholder']) {
            this.initAnimation();
        }
        if (
            changes['placeholderAnimated'] &&
            changes['placeholderAnimated'].currentValue !== changes['placeholderAnimated'].previousValue
        ) {
            if (changes['placeholderAnimated'].currentValue) {
                this.initAnimation();
            } else {
                const [, , , separator] = this.infoPlaceholderAnimation(this.placeholderAnimated()!);
                this.stopPlaceholderAnimation(separator);
            }
        }
    }

    getValue() {
        return this._value;
    }

    onChange: (value: any) => void = () => {};
    onTouched: () => void = () => {};

    writeValue(value: any): void {
        this._value = value;
        this.cd.detectChanges();
        setTimeout(() => {
            this.initAnimation();
        });
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
                    const paramsData = (control as any).controlParamsData;
                    const defaultMessage = (control as any).controlData?.message;

                    if (data || defaultMessage) {
                        const message = (data as ParamsMessagesControlMessage<any>)?.message ?? defaultMessage;
                        errorMessage =
                            typeof message === 'function'
                                ? message({
                                      type: key as any,
                                      errorData: control.errors[key],
                                      state: data?.state,
                                      data: data?.data,
                                      params: paramsData,
                                  })
                                : message;

                        if (data && errorMessage?.includes('{')) {
                            [...errorMessage.matchAll(/\{([^}]+)\}/g)].forEach(([tag, keyName]) => {
                                errorMessage = errorMessage!.replace(
                                    tag,
                                    (control as any)[keyName]?.state ??
                                        control.errors?.[key]?.[keyName] ??
                                        paramsData[keyName],
                                );
                            });
                        }
                    }
                }
                this.host._errorMessage.set(errorMessage ?? null);
            });
        }
        return null;
    }

    protected setHostLabelId() {
        this.host.forId = `${this._id()}-input`;
        this.host.cd.detectChanges();
    }

    protected initAnimation() {
        const [, , , separator] = this.infoPlaceholderAnimation(this.placeholderAnimated()!);
        if (this.getValue() === null || this.getValue() === undefined || this.getValue() === '') {
            this.stopPlaceholderAnimation(separator);
            if (this.placeholderAnimated()) {
                this.startPlaceholderAnimation(this.placeholderAnimated()!);
            }
        } else {
            this.stopPlaceholderAnimation(separator);
        }
    }

    protected infoPlaceholderAnimation(info: string) {
        const [baseDelayValue, repeatValue, intervaleValue, separator] = (info ?? '').split(/\s+/);
        const baseDelay = Math.max(+baseDelayValue || 30, 1);
        const repeat = Math.max(+repeatValue || 1, 1);
        const intervale = Math.max(+intervaleValue || baseDelay, 1);
        return [baseDelay, repeat, intervale, separator] as [number, number, number, string];
    }

    protected startPlaceholderAnimation(info: string) {
        const [baseDelay, repeat, intervale, separator] = this.infoPlaceholderAnimation(info);
        this.inPlaceholderAnimation(baseDelay, repeat, intervale, separator);
    }

    protected inPlaceholderAnimation(baseDelay: number, repeat: number, intervale: number, separator: string = '|') {
        const text = this.placeholder()!.split('');
        let i = 0;
        this.placeholderDisplay.set('');
        this.placeholderTimer = Timing.start(() => {
            Timing.change(this.placeholderTimer!, baseDelay);
            let value = text[i++];
            if (value === undefined) {
                if (repeat === 1) {
                    this.stopPlaceholderAnimation(separator);
                } else {
                    Timing.stop(this.placeholderTimer!);
                    setTimeout(() => {
                        this.inPlaceholderAnimation(baseDelay, repeat - 1, intervale);
                    }, intervale);
                }
                return;
            }
            if (value === separator) {
                Timing.change(this.placeholderTimer!, intervale);
                setTimeout(
                    () => {
                        this.placeholderDisplay.set('');
                    },
                    Math.max(intervale - baseDelay, 0),
                );
            } else {
                this.placeholderDisplay.update(e => e + value);

                while (value === ' ') {
                    value = text[i++];
                    this.placeholderDisplay.update(e => e + value);
                }
            }
        }, baseDelay);
    }

    protected stopPlaceholderAnimation(separator: string = '') {
        Timing.stop(this.placeholderTimer!);
        this.placeholderTimer = undefined;
        this.placeholderDisplay.set(
            (separator ? this.placeholder?.()?.split(separator).pop() : (this.placeholder?.() ?? '')) ?? '',
        );
    }
}
