import { Injectable, inject } from '@angular/core';
import {
    AbstractControlOptions,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    FormRecord,
    ValidatorFn,
    Validators,
    ɵElement,
} from '@angular/forms';

declare type ɵNullableFormControls<T> = {
    [K in keyof T]: ɵElement<T[K], null>;
};

export type ParamsMessagesControlMessage = { message?: string | ((params: any) => string); data?: any };
export type ParamsMessagesControlRequired = { state?: boolean } & ParamsMessagesControlMessage;
export type ParamsMessagesControlMinLength = { state?: number } & ParamsMessagesControlMessage;
export type ParamsMessagesControlMaxLength = { state?: number } & ParamsMessagesControlMessage;
export type ParamsMessagesControlMin = { state?: number } & ParamsMessagesControlMessage;
export type ParamsMessagesControlMax = { state?: number } & ParamsMessagesControlMessage;
export type ParamsMessagesControlPattern = { state?: string | RegExp } & ParamsMessagesControlMessage;
export type ParamsMessagesControlEmail = { state?: boolean } & ParamsMessagesControlMessage;

export interface ParamsMessagesControl {
    required?: ParamsMessagesControlRequired;
    minlength?: ParamsMessagesControlMinLength;
    maxlength?: ParamsMessagesControlMaxLength;
    min?: ParamsMessagesControlMin;
    max?: ParamsMessagesControlMax;
    pattern?: ParamsMessagesControlPattern;
    email?: ParamsMessagesControlEmail;
}

export declare type ParamsMessages<T = any> = {
    default: T;
    controlType?: ɵNullableFormControls<T>;
    options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
        emitModelToViewChange?: boolean;
        emitViewToModelChange?: boolean;
    };
    control?: ParamsMessagesControl;
};

declare type ControlWithError<T> = {
    [K in keyof T]: ParamsMessages<T[K]>;
};

declare type FormMapper<Type extends ControlWithError<any>> = {
    [K in keyof Type]: [
        Type['ParamsMessages']['controlType'] extends ɵElement<Type['ParamsMessages']['default'], any>
            ? Type['ParamsMessages']['controlType']
            : ɵElement<Type['ParamsMessages']['default'], any>,
    ];
};

/**
 * For persistence during the session of use
 */
@Injectable({
    providedIn: 'root',
})
export abstract class FormBuilderExtended {
    fb = inject(FormBuilder);

    groupWithErrorNonNullable<T extends {}>(
        controlsWithError: ControlWithError<T>,
        options?: AbstractControlOptions | null,
    ) {
        const controls: any = {};

        Object.entries<ParamsMessages>(controlsWithError).forEach(([key, value]) => {
            const validators: ValidatorFn[] = [];

            if (value.control && Object.keys(value.control).length) {
                Object.entries(value.control).forEach(([key, control]) => {
                    if (key === 'required' && control.state) {
                        validators.push(Validators.required);
                    } else if (key === 'minlength' && control.state > 0) {
                        validators.push(Validators.minLength(control.state));
                    } else if (key === 'maxlength' && control.state > 0) {
                        validators.push(Validators.maxLength(control.state));
                    } else if (key === 'min' && control.state > 0) {
                        validators.push(Validators.min(control.state));
                    } else if (key === 'max' && control.state > 0) {
                        validators.push(Validators.max(control.state));
                    } else if (key === 'pattern' && control.state) {
                        validators.push(Validators.pattern(control.state));
                    } else if (key === 'email' && control.state) {
                        validators.push(Validators.email);
                    }
                });
            }

            if (value.controlType instanceof FormGroup) {
                controls[key] = new FormGroup(value.default) as any;
            } else if (value.controlType instanceof FormRecord) {
                controls[key] = new FormRecord(value.default) as any;
            } else if (value.controlType instanceof FormArray) {
                controls[key] = new FormArray(value.default) as any;
            } else {
                controls[key] = new FormControl(value.default, {
                    ...value.options,
                    ...{ validators, nonNullable: true },
                }) as any;
            }
            controls[key].controlData = value.control;
        });

        return this.fb.group<FormMapper<ControlWithError<T>>>(controls, options);
    }
}
