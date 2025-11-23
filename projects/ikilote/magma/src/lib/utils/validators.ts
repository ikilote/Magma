import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class MagmaValidators {
    /**
     * test if the element(s) are in a defined list
     * @param nameRe list of values ​​that must be included
     * @param strict false = case insensitive
     * @param local environment's current locale (only for strict = false)
     * @returns A validation function that returns an error map with the `inList` property
     * if the validation check fails, otherwise `null`.
     */
    static inList(
        nameRe: (string | number | boolean)[],
        strict: boolean = true,
        local?: Intl.LocalesArgument,
    ): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!Array.isArray(nameRe)) {
                return {
                    inlist: { actualValue: control.value, list: nameRe, strict, error: 'control value is not a array' },
                };
            }

            if (Array.isArray(control.value)) {
                for (const value of control.value) {
                    if (
                        (strict && !nameRe.includes(value)) ||
                        (!strict &&
                            !nameRe.some(
                                test => `${test}`.toLocaleLowerCase(local) == `${value}`.toLocaleLowerCase(local),
                            ))
                    ) {
                        return { inlist: { actualValue: control.value, list: nameRe, strict, local } };
                    }
                }
            } else if (
                (strict && !nameRe.includes(control.value)) ||
                (!strict &&
                    !nameRe.some(
                        test => `${test}`.toLocaleLowerCase(local) == `${control.value}`.toLocaleLowerCase(local),
                    ))
            ) {
                return { inlist: { actualValue: control.value, list: nameRe, strict, local } };
            }
            return null;
        };
    }
}
