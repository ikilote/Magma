import { Injectable, inject } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, ɵElement } from '@angular/forms';

declare type ɵNullableFormControls<T> = {
    [K in keyof T]: ɵElement<T[K], null>;
};

export declare type ParamsMessages<T = any> = {
    default: T;
    controlType?: ɵNullableFormControls<T>;
    nonNullable?: boolean;
    options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
        emitModelToViewChange?: boolean;
        emitViewToModelChange?: boolean;
    };
    control?: {
        required?: { state?: boolean; message?: string | ((params: any) => string) };
        minLength?: { state?: number; message?: string | ((params: any) => string) };
        maxLength?: { state?: number; message?: string | ((params: any) => string) };
    };
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

    groupWithError<T extends {}>(controlsWithError: ControlWithError<T>, options?: AbstractControlOptions | null) {
        const controls: any = {};

        Object.entries<ParamsMessages>(controlsWithError).forEach(([key, value]) => {
            switch (value.controlType) {
                default:
                    controls[key] = new FormControl(value.default, {
                        ...value.options,
                        ...{ nonNullable: value.nonNullable ?? false },
                    }) as any;
            }
        });

        return this.fb.group<FormMapper<ControlWithError<T>>>(controls, options);
    }
}
