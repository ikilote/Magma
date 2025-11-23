import { TestBed } from '@angular/core/testing';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FormBuilderExtended } from './form-builder-extended';

import { MagmaValidators } from '../utils/validators';

// --- Mocks ---
// We mock the static method to avoid dependency on the external validator file
class MockMagmaValidators {
    static inList(list: any[]) {
        return (control: AbstractControl) => {
            return list.includes(control.value) ? null : { inList: true };
        };
    }
}

describe('FormBuilderExtended', () => {
    let service: FormBuilderExtended;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [FormBuilderExtended],
            imports: [ReactiveFormsModule],
        });
        service = TestBed.inject(FormBuilderExtended);

        // Spy on the static method if it exists, or just ensure the mock logic is understood
        // If MagmaValidators is a Class with static methods:
        spyOn(MagmaValidators, 'inList').and.callFake(MockMagmaValidators.inList);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('groupWithError', () => {
        it('should create a simple FormControl with metadata', () => {
            const config = {
                username: {
                    default: 'John',
                    control: {
                        required: { state: true, message: 'Req' },
                    },
                },
            };

            const form = service.groupWithError(config);

            expect(form instanceof FormGroup).toBeTrue();
            const ctrl = form.get('username'); // Cast to access custom props

            expect(ctrl instanceof FormControl).toBeTrue();
            expect(ctrl?.value).toBe('John');

            // Check metadata (Monkey Patching)
            expect((ctrl as any)?.controlData).toBeDefined();
            expect((ctrl as any)?.controlData.required.message).toBe('Req');
            expect((ctrl as any)?.controlParamsData.required).toBeTrue();
        });

        describe('should apply standard validators: ', () => {
            let config: any;
            let form: any;

            beforeEach(() => {
                config = {
                    name: {
                        default: 'S',
                        control: {
                            minlength: { state: 2 },
                        },
                    },
                    domain: {
                        default: 'logs',
                        control: {
                            maxlength: { state: 3 },
                        },
                    },
                    age: {
                        default: 10,
                        control: {
                            min: { state: 18 },
                            max: { state: 99 },
                        },
                    },
                    size: {
                        default: 500,
                        control: {
                            min: { state: 5 },
                            max: { state: 15 },
                        },
                    },
                    code: {
                        default: '123',
                        control: {
                            pattern: { state: '^[A-Z]+$' },
                        },
                    },
                    email: {
                        default: 'email',
                        control: {
                            email: {},
                        },
                    },
                    status: {
                        default: 'child',
                        control: {
                            inlist: { state: ['human', 'woman', 'man'] },
                        },
                    },
                    test: {
                        default: 'mori',
                        control: {
                            custom: (value: string) => value.startsWith('sora'),
                        },
                    },
                    testList: {
                        default: 'mori',
                        control: {
                            custom: [(value: string) => value.startsWith('sora')],
                        },
                    },
                    testTrue: {
                        default: 'sora',
                        control: {
                            custom: [(value: string) => value.startsWith('sora')],
                        },
                    },
                };

                form = service.groupWithError(config);
            });

            it('minLength', () => {
                expect(form.get('name')?.valid).toBeFalse();
                expect(form.get('name')?.hasError('minlength')).toBeTrue();
            });

            it('maxLength', () => {
                expect(form.get('domain')?.valid).toBeFalse();
                expect(form.get('domain')?.hasError('maxlength')).toBeTrue();
            });

            it('min', () => {
                expect(form.get('age')?.valid).toBeFalse();
                expect(form.get('age')?.hasError('min')).toBeTrue();
            });

            it('max', () => {
                expect(form.get('size')?.valid).toBeFalse();
                expect(form.get('size')?.hasError('max')).toBeTrue();
            });

            it('pattern', () => {
                expect(form.get('code')?.valid).toBeFalse();
                expect(form.get('code')?.hasError('pattern')).toBeTrue();
            });

            it('email', () => {
                expect(form.get('email')?.valid).toBeFalse();
                expect(form.get('email')?.hasError('email')).toBeTrue();
            });

            it('test', () => {
                expect(form.get('test')?.valid).toBeFalse();
                expect(form.get('test')?.hasError('custom')).toBeTrue();
            });

            it('testList', () => {
                expect(form.get('testList')?.valid).toBeFalse();
                expect(form.get('testList')?.hasError('custom')).toBeTrue();
            });

            it('testList ok', () => {
                expect(form.get('testTrue')?.valid).toBeTrue();
                expect(form.get('testTrue')?.hasError('custom')).toBeFalse();
            });
        });

        it('should handle nested FormGroups passed as input', () => {
            // Create a nested group first
            const nestedGroup = service.groupWithError({
                city: { default: 'Paris', control: {} },
            });

            // Pass it to the parent
            const form = service.groupWithError({
                name: { default: 'User', control: {} },
                address: nestedGroup, // Passing existing FormGroup
            });

            expect(form.get('name') instanceof FormControl).toBeTrue();
            expect(form.get('address') instanceof FormGroup).toBeTrue();
            expect(form.get('address')).toBe(nestedGroup as any); // Same reference
            expect(form.get('address')?.value).toEqual({ city: 'Paris' });
        });

        it('should handle FormArray passed as input', () => {
            const arr = service.array([]);
            const form = service.groupWithError({
                tags: arr,
            });

            expect(form.get('tags') instanceof FormArray).toBeTrue();
            expect(form.get('tags')).toBe(arr);
        });
    });

    describe('validateForm', () => {
        it('should mark all controls as touched recursively', () => {
            const form = service.groupWithError({
                field1: { default: '', control: { required: { state: true } } },
                nested: service.groupWithError({
                    field2: { default: '', control: { required: { state: true } } },
                }),
            });

            expect(form.touched).toBeFalse();
            expect(form.get('nested')?.touched).toBeFalse();
            expect(form.get('nested.field2')?.touched).toBeFalse();

            service.validateForm(form);

            expect(form.touched).toBeTrue();
            expect(form.get('field1')?.touched).toBeTrue();
            expect(form.get('nested')?.touched).toBeTrue();
            expect(form.get('nested.field2')?.touched).toBeTrue();
        });
    });
});
