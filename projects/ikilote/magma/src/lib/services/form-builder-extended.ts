import { Injectable, inject } from '@angular/core';
import {
    AbstractControl,
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

import { MagmaValidators } from '../utils/validators';

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
export type ParamsMessageInList = {
    type: 'inList';
    errorData: { list: (string | number | boolean)[]; actualValue: any; strict: boolean };
    state: (string | number | boolean)[];
    data: any;
};
export type ParamsMessageCustom = {
    type: 'custom';
    errorData: any;
    state: any;
    validator: (control: any) => ValidatorFn;
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
export type ParamsMessagesControlInList = {
    state?: (string | number | boolean)[];
} & ParamsMessagesControlMessage<ParamsMessageInList>;
export type ParamsMessagesControlCustom = { state?: any } & ParamsMessagesControlMessage<ParamsMessageCustom>;

export interface ParamsMessagesControl {
    /** required */
    required?: ParamsMessagesControlRequired;
    /** min length for string or array */
    minlength?: ParamsMessagesControlMinLength;
    /** max length for string or array */
    maxlength?: ParamsMessagesControlMaxLength;
    /** min value */
    min?: ParamsMessagesControlMin;
    /** max value */
    max?: ParamsMessagesControlMax;
    /** test pattern on string */
    pattern?: ParamsMessagesControlPattern;
    /** test an email */
    email?: ParamsMessagesControlEmail;
    /** test value(s) present in a list */
    inlist?: ParamsMessagesControlInList;
    /** custom validator */
    custom?: ParamsMessagesControlCustom | ParamsMessagesControlCustom[];
    /** message if not defined in other control */
    message?: string | string | ((params: any) => string);
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
 * For persistence during the session of use.
 *
 * Extension for Angular `FormBuilder`
 */
@Injectable({
    providedIn: 'root',
})
export abstract class FormBuilderExtended {
    fb = inject(FormBuilder);

    /**
     * create group validation for `mg-input` form
     * @param controlsWithError control schemas with validators and error messages
     * @param options validation options
     * @returns
     */
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
                    } else if (key === 'inlist') {
                        validators.push(MagmaValidators.inList(control.state));
                    } else if (key === 'custom') {
                        for (const validator of Array.isArray(control) ? control : [control]) {
                            if (typeof validator === 'function') {
                                validators.push(validator(control.state));
                            }
                        }
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

    /**
     * Mark form touched and display errors
     * @param form form to update error message
     */
    validateForm(form: FormGroup | FormArray) {
        form.markAllAsTouched({ emitEvent: true });
        this.recursiveValidateForm(form.controls);
    }

    private recursiveValidateForm(
        controls: { [key: string]: AbstractControl<any, any> } | AbstractControl<any, any>[],
    ) {
        if (Array.isArray(controls)) {
            controls.forEach(ctrl => {
                if (ctrl instanceof FormGroup || ctrl instanceof FormArray) {
                    this.recursiveValidateForm(ctrl.controls);
                }
                ctrl.updateValueAndValidity();
            });
        } else {
            Object.values(controls).forEach(ctrl => {
                if (ctrl instanceof FormGroup || ctrl instanceof FormArray) {
                    this.recursiveValidateForm(ctrl.controls);
                }
                ctrl.updateValueAndValidity();
            });
        }
    }
}
