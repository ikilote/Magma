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

export type ParamsMessageRequired = {
    type: 'required';
    errorData: boolean;
    state: boolean;
    data: any;
};
export type ParamsMessageMinlength = {
    type: 'minlength';
    errorData: { requiredLength: number; actualLength: number };
    state: number;
    data: any;
};
export type ParamsMessageMaxlength = {
    type: 'maxlength';
    errorData: { requiredLength: number; actualLength: number };
    state: number;
    data: any;
};
export type ParamsMessageMin = {
    type: 'min';
    errorData: { min: number; actual: number | string };
    state: number;
    data: any;
};
export type ParamsMessageMax = {
    type: 'max';
    errorData: { max: number; actual: number | string };
    state: number;
    data: any;
};
export type ParamsMessagePattern = {
    type: 'pattern';
    errorData: { requiredPattern: string; actualValue: string };
    state: string | RegExp;
    data: any;
};
export type ParamsMessageEmail = {
    type: 'email';
    errorData: boolean;
    state: undefined;
    data: any;
};
export type ParamsMessagesControlMessage<T> = {
    message?: string | ((params: T) => string);
    data?: any;
};

export type ParamsMessagesControlRequired = { state?: boolean } & ParamsMessagesControlMessage<ParamsMessageRequired>;
export type ParamsMessagesControlMinLength = { state?: number } & ParamsMessagesControlMessage<ParamsMessageMinlength>;
export type ParamsMessagesControlMaxLength = { state?: number } & ParamsMessagesControlMessage<ParamsMessageMaxlength>;
export type ParamsMessagesControlMin = { state?: number } & ParamsMessagesControlMessage<ParamsMessageMin>;
export type ParamsMessagesControlMax = { state?: number } & ParamsMessagesControlMessage<ParamsMessageMax>;
export type ParamsMessagesControlPattern = {
    state?: string | RegExp;
} & ParamsMessagesControlMessage<ParamsMessagePattern>;
export type ParamsMessagesControlEmail = { state?: boolean } & ParamsMessagesControlMessage<ParamsMessageEmail>;

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
                    } else if (key === 'min') {
                        validators.push(Validators.min(control.state));
                    } else if (key === 'max') {
                        validators.push(Validators.max(control.state));
                    } else if (key === 'pattern' && control.state) {
                        validators.push(Validators.pattern(control.state));
                    } else if (key === 'email') {
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
