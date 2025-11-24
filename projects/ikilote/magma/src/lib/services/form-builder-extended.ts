import { Injectable, inject } from '@angular/core';
import {
    AbstractControl,
    AbstractControlOptions,
    AsyncValidatorFn,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';

import { MagmaValidators } from '../utils/validators';

// --- Base Message Types ---

export type ParamsMessageRequired = {
    type: 'required';
    errorData: boolean;
    state: boolean;
    data: any;
    params: Record<string, any>;
};
export type ParamsMessageMinlength = {
    type: 'minlength';
    errorData: { requiredLength: number; actualLength: number };
    state: number;
    data: any;
    params: Record<string, any>;
};
export type ParamsMessageMaxlength = {
    type: 'maxlength';
    errorData: { requiredLength: number; actualLength: number };
    state: number;
    data: any;
    params: Record<string, any>;
};
export type ParamsMessageMin = {
    type: 'min';
    errorData: { min: number; actual: number | string };
    state: number;
    data: any;
    params: Record<string, any>;
};
export type ParamsMessageMax = {
    type: 'max';
    errorData: { max: number; actual: number | string };
    state: number;
    data: any;
    params: Record<string, any>;
};
export type ParamsMessagePattern = {
    type: 'pattern';
    errorData: { requiredPattern: string; actualValue: string };
    state: string | RegExp;
    data: any;
    params: Record<string, any>;
};
export type ParamsMessageEmail = {
    type: 'email';
    errorData: boolean;
    state: undefined;
    data: any;
    params: Record<string, any>;
};
export type ParamsMessageInList = {
    type: 'inList';
    errorData: { list: (string | number | boolean)[]; actualValue: any; strict: boolean };
    state: (string | number | boolean)[];
    data: any;
    params: Record<string, any>;
};
export type ParamsMessageCustom = {
    type: 'custom';
    errorData: any;
    state: any;
    data: any;
    params: Record<string, any>;
};

// --- Control Configuration Types ---

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
export type ParamsMessagesControlCustom = {
    state?: (value: any) => boolean;
} & ParamsMessagesControlMessage<ParamsMessageCustom>;

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
    message?: string | ((params: any) => string);
}

export type ParamsMessages<T = any> = {
    default: T;
    emptyOnInit?: boolean;
    options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
        emitModelToViewChange?: boolean;
        emitViewToModelChange?: boolean;
    };
    control?: ParamsMessagesControl;
};

// --- UTILITY TYPES FOR INFERENCE ---

/**
 * Deduce the control type.
 * If it's ParamsMessages -> it becomes a FormControl.
 * If it's already an AbstractControl -> keep it as is.
 */
export type ControlOf<T> =
    T extends ParamsMessages<infer U> ? FormControl<U> : T extends AbstractControl<infer U> ? T : never;

/**
 * Maps the input object keys to their corresponding Angular Controls
 */
export type FormMapperExtended<T extends Record<string, any>> = {
    [K in keyof T]: ControlOf<T[K]>;
};

// --- SERVICE ---

@Injectable({
    providedIn: 'root',
})
export class FormBuilderExtended {
    private readonly fb = inject(FormBuilder);

    /**
     * Create a FormGroup with validation messages and non-nullable controls.
     * Supports mixed input: Config objects (ParamsMessages) or existing FormGroups/Arrays.
     * @param controlsWithError Control schemas with validators/messages OR existing controls
     * @param options Validation options for the group
     * @returns Strongly typed FormGroup
     */
    groupWithError<T extends Record<string, any>>(
        controlsWithError: T,
        options?: AbstractControlOptions | null,
    ): FormGroup<FormMapperExtended<T>> {
        const controls: any = {};

        Object.entries(controlsWithError).forEach(([key, value]: [string, any]) => {
            const paramsData: Record<string, any> = {};

            // 1. Check if the value is already an Angular Control (Group, Array, Record)
            if (value instanceof AbstractControl) {
                controls[key] = value;
            }
            // 2. Otherwise, treat it as a configuration object to build a FormControl
            else {
                const validators: ValidatorFn[] = [];

                if (value.control && Object.keys(value.control).length) {
                    Object.entries(value.control).forEach(([subKey, control]: [string, any]) => {
                        // Standard Validators
                        if (subKey === 'required' && control.state) {
                            validators.push(Validators.required);
                        } else if (subKey === 'minlength' && control.state > 0) {
                            validators.push(Validators.minLength(control.state));
                        } else if (subKey === 'maxlength' && control.state > 0) {
                            validators.push(Validators.maxLength(control.state));
                        } else if (subKey === 'min') {
                            validators.push(Validators.min(control.state));
                        } else if (subKey === 'max') {
                            validators.push(Validators.max(control.state));
                        } else if (subKey === 'pattern' && control.state) {
                            validators.push(Validators.pattern(control.state));
                        } else if (subKey === 'email') {
                            validators.push(Validators.email);
                        }
                        // Custom Validators
                        else if (subKey === 'inlist') {
                            validators.push(MagmaValidators.inList(control.state));
                        } else if (subKey === 'custom') {
                            const customValidators = Array.isArray(control) ? control : [control];
                            for (const validator of customValidators) {
                                if (typeof validator === 'function') {
                                    validators.push((control: AbstractControl): ValidationErrors | null =>
                                        validator(control.value) ? null : { custom: true },
                                    );
                                }
                            }
                        }

                        if (control.state !== undefined) {
                            paramsData[subKey] = control.state;
                        }
                    });
                }

                // Create the FormControl with nonNullable: true
                controls[key] = new FormControl(value.emptyOnInit ? undefined : value.default, {
                    ...value.options,
                    validators,
                    nonNullable: true,
                });

                // Attach metadata (monkey-patching)
                // We use 'any' cast here because these properties don't exist on standard AbstractControl
                (controls[key] as any).controlData = value.control;
                (controls[key] as any).controlParamsData = paramsData;
            }
        });

        // Force cast the return type.
        // We know the structure matches FormMapperExtended<T> because we just built it.
        return this.fb.group(controls, options) as unknown as FormGroup<FormMapperExtended<T>>;
    }

    /**
     * Mark form as touched and force validation update on all controls recursively.
     * @param form FormGroup or FormArray to validate
     */
    validateForm(form: FormGroup | FormArray) {
        form.markAllAsTouched();
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

    /**
     * Helper for FormArray creation
     */
    array<T extends AbstractControl>(
        controls: T[],
        validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
        asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
    ): FormArray<T> {
        return this.fb.array(controls, validatorOrOpts, asyncValidator) as unknown as FormArray<T>;
    }
}
