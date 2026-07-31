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

export interface ParamsMessageRequired {
    type: 'required';
    errorData: boolean;
    state: boolean;
    data: unknown;
    params: Record<string, unknown>;
}
export interface ParamsMessageMinlength {
    type: 'minlength';
    errorData: { requiredLength: number; actualLength: number };
    state: number;
    data: unknown;
    params: Record<string, unknown>;
}
export interface ParamsMessageMaxlength {
    type: 'maxlength';
    errorData: { requiredLength: number; actualLength: number };
    state: number;
    data: unknown;
    params: Record<string, unknown>;
}
export interface ParamsMessageMin {
    type: 'min';
    errorData: { min: number; actual: number | string };
    state: number;
    data: unknown;
    params: Record<string, unknown>;
}
export interface ParamsMessageMax {
    type: 'max';
    errorData: { max: number; actual: number | string };
    state: number;
    data: unknown;
    params: Record<string, unknown>;
}
export interface ParamsMessagePattern {
    type: 'pattern';
    errorData: { requiredPattern: string; actualValue: string };
    state: string | RegExp;
    data: unknown;
    params: Record<string, unknown>;
}
export interface ParamsMessageEmail {
    type: 'email';
    errorData: boolean;
    state: undefined;
    data: unknown;
    params: Record<string, unknown>;
}
export interface ParamsMessageInList {
    type: 'inList';
    errorData: { list: (string | number | boolean)[]; actualValue: unknown; strict: boolean };
    state: (string | number | boolean)[];
    data: unknown;
    params: Record<string, unknown>;
}
export interface ParamsMessageCustom {
    type: 'custom';
    errorData: unknown;
    state: unknown;
    data: unknown;
    params: Record<string, unknown>;
}

// --- Control Configuration Types ---

export interface ParamsMessagesControlMessage<T> {
    message?: string | ((params: T) => string);
    data?: unknown;
}

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
    state?: (value: unknown) => boolean;
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
    message?: string | ((params: unknown) => string);
}

export interface ParamsMessages<T = unknown> {
    default: T;
    emptyOnInit?: boolean;
    options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
        emitModelToViewChange?: boolean;
        emitViewToModelChange?: boolean;
    };
    control?: ParamsMessagesControl;
}

// --- UTILITY TYPES FOR INFERENCE ---

/**
 * Deduce the control type.
 * If it's ParamsMessages -> it becomes a FormControl.
 * If it's already an AbstractControl -> keep it as is.
 */
export type ControlOf<T> =
    T extends ParamsMessages<infer U> ? FormControl<U> : T extends AbstractControl<infer _U> ? T : never;

/**
 * Maps the input object keys to their corresponding Angular Controls
 */
export type FormMapperExtended<T extends Record<string, unknown>> = {
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
    groupWithError<T extends Record<string, unknown>>(
        controlsWithError: T,
        options?: AbstractControlOptions | null,
    ): FormGroup<FormMapperExtended<T>> {
        const controls: Record<string, AbstractControl> = {};

        Object.entries(controlsWithError).forEach(([key, value]: [string, unknown]) => {
            const paramsData: Record<string, unknown> = {};

            // 1. Check if the value is already an Angular Control (Group, Array, Record)
            if (value instanceof AbstractControl) {
                controls[key] = value;
            }
            // 2. Otherwise, treat it as a configuration object to build a FormControl
            else {
                const config = value as ParamsMessages;
                const validators: ValidatorFn[] = [];

                if (config.control && Object.keys(config.control).length) {
                    Object.entries(config.control).forEach(([subKey, control]: [string, unknown]) => {
                        const controlConfig = control as Record<string, unknown>;
                        // Standard Validators
                        if (subKey === 'required' && controlConfig['state']) {
                            validators.push(Validators.required);
                        } else if (subKey === 'minlength' && (controlConfig['state'] as number) > 0) {
                            validators.push(Validators.minLength(controlConfig['state'] as number));
                        } else if (subKey === 'maxlength' && (controlConfig['state'] as number) > 0) {
                            validators.push(Validators.maxLength(controlConfig['state'] as number));
                        } else if (subKey === 'min') {
                            validators.push(Validators.min(controlConfig['state'] as number));
                        } else if (subKey === 'max') {
                            validators.push(Validators.max(controlConfig['state'] as number));
                        } else if (subKey === 'pattern' && controlConfig['state']) {
                            validators.push(Validators.pattern(controlConfig['state'] as string | RegExp));
                        } else if (subKey === 'email') {
                            validators.push(Validators.email);
                        }
                        // Custom Validators
                        else if (subKey === 'inlist') {
                            validators.push(
                                MagmaValidators.inList(controlConfig['state'] as (string | number | boolean)[]),
                            );
                        } else if (subKey === 'custom') {
                            const customValidators = Array.isArray(control) ? control : [control];
                            for (const validator of customValidators) {
                                if (typeof validator === 'function') {
                                    validators.push((ctrl: AbstractControl): ValidationErrors | null =>
                                        (validator as (v: unknown) => boolean)(ctrl.value) ? null : { custom: true },
                                    );
                                }
                            }
                        }

                        if (controlConfig['state'] !== undefined) {
                            paramsData[subKey] = controlConfig['state'];
                        }
                    });
                }

                // Create the FormControl with nonNullable: true
                controls[key] = new FormControl(config.emptyOnInit ? undefined : config.default, {
                    ...config.options,
                    validators,
                    nonNullable: true,
                });

                // Attach metadata (monkey-patching)
                // We use bracket notation because these properties don't exist on standard AbstractControl
                (controls[key] as unknown as Record<string, unknown>)['controlData'] = config.control;
                (controls[key] as unknown as Record<string, unknown>)['controlParamsData'] = paramsData;
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

    private recursiveValidateForm(controls: Record<string, AbstractControl> | AbstractControl[]) {
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
