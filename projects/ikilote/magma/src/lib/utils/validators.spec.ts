import { FormControl } from '@angular/forms';

import { MagmaValidators } from './validators';

describe('MagmaValidators.inList:', () => {
    // 1. Basic validation tests for single values
    describe('Basic Validation (Single Value)', () => {
        it('should return null if the value is in the list (strict mode)', () => {
            // Test: Value exists in the list (strict comparison)
            const validator = MagmaValidators.inList(['apple', 'banana', 'orange']);
            const control = new FormControl('banana');
            expect(validator(control)).toBeNull();
        });

        it('should return an error if the value is not in the list (strict mode)', () => {
            // Test: Value does not exist in the list (strict comparison)
            const validator = MagmaValidators.inList(['apple', 'banana', 'orange']);
            const control = new FormControl('grape');
            expect(validator(control)).toEqual({
                inlist: {
                    actualValue: 'grape',
                    list: ['apple', 'banana', 'orange'],
                    strict: true,
                    local: undefined,
                },
            });
        });

        it('should be case-insensitive if strict=false', () => {
            // Test: Case-insensitive comparison
            const validator = MagmaValidators.inList(['Apple', 'Banana'], false);
            const control = new FormControl('banana');
            expect(validator(control)).toBeNull();
        });

        it('should handle numbers in the list', () => {
            // Test: Numeric values in the list
            const validator = MagmaValidators.inList([1, 2, 3]);
            const control = new FormControl(2);
            expect(validator(control)).toBeNull();
        });

        it('should handle booleans in the list', () => {
            // Test: Boolean values in the list
            const validator = MagmaValidators.inList([true, false]);
            const control = new FormControl(false);
            expect(validator(control)).toBeNull();
        });
    });

    // 2. Array validation tests
    describe('Array Validation', () => {
        it('should return null if all array values are in the list (strict mode)', () => {
            // Test: All values in the array exist in the list (strict comparison)
            const validator = MagmaValidators.inList(['apple', 'banana', 'orange']);
            const control = new FormControl(['banana', 'apple']);
            expect(validator(control)).toBeNull();
        });

        it('should return an error if any array value is not in the list (strict mode)', () => {
            // Test: At least one value in the array does not exist in the list (strict comparison)
            const validator = MagmaValidators.inList(['apple', 'banana', 'orange']);
            const control = new FormControl(['banana', 'grape']);
            expect(validator(control)).toEqual({
                inlist: {
                    actualValue: ['banana', 'grape'],
                    list: ['apple', 'banana', 'orange'],
                    strict: true,
                    local: undefined,
                },
            });
        });

        it('should be case-insensitive for arrays if strict=false', () => {
            // Test: Case-insensitive comparison for arrays
            const validator = MagmaValidators.inList(['Apple', 'Banana'], false);
            const control = new FormControl(['apple', 'BANANA']);
            expect(validator(control)).toBeNull();
        });
    });

    // 3. Configuration error tests
    describe('Configuration Errors', () => {
        it('should return an error if nameRe is not an array', () => {
            // Test: Invalid configuration (nameRe is not an array)
            const validator = MagmaValidators.inList('not an array' as any);
            const control = new FormControl('banana');
            expect(validator(control)).toEqual({
                inlist: {
                    actualValue: 'banana',
                    list: 'not an array',
                    strict: true,
                    error: 'control value is not a array',
                },
            });
        });
    });

    // 4. Locale handling tests
    describe('Locale Handling', () => {
        it('should use the provided locale for case-insensitive comparison', () => {
            // Test: Locale-specific case-insensitive comparison
            const validator = MagmaValidators.inList(['İ', 'I'], false, 'tr'); //  Turkish
            const control = new FormControl('i');
            expect(validator(control)).toBeNull();
        });
    });

    // 5. Null/undefined value tests
    describe('Null/Undefined Values', () => {
        it('should return null if control value is null and null is in the list', () => {
            // Test: Null value is allowed if it exists in the list
            // @ts-ignore: Access private property for testing
            const validator = MagmaValidators.inList([null, 'apple']);
            const control = new FormControl(null);
            expect(validator(control)).toBeNull();
        });

        it('should return an error if control value is null and null is not in the list', () => {
            // Test: Null value is not allowed if it does not exist in the list
            const validator = MagmaValidators.inList(['apple', 'banana']);
            const control = new FormControl(null);
            expect(validator(control)).toEqual({
                inlist: {
                    actualValue: null,
                    list: ['apple', 'banana'],
                    strict: true,
                    local: undefined,
                },
            });
        });
    });
});
