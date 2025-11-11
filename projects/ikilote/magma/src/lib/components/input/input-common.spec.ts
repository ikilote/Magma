import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AbstractControl, NgControl } from '@angular/forms';

import { MagmaInputCommon } from './input-common';
import { MagmaInput } from './input.component';

import { Logger } from '../../services/logger';
import { Timing } from '../../utils/timing';

class MockMagmaInput {
    forId = signal<string | undefined>(undefined);
    _errorMessage = { set: jasmine.createSpy('set') };
    cd = { detectChanges: jasmine.createSpy('detectChanges') };
}

class MockNgControl {
    control = { touched: false, errors: null };
}

class MockLogger {
    log = jasmine.createSpy('log');
}

@Component({ selector: 'test-input-common' })
class TestMagmaInputCommon extends MagmaInputCommon<string> {}

describe('MagmaInputCommon', () => {
    let directive: TestMagmaInputCommon;
    let fixture: ComponentFixture<any>;
    let mockHost: MockMagmaInput;
    let mockNgControl: MockNgControl;
    let mockLogger: MockLogger;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestMagmaInputCommon],
            providers: [
                { provide: MagmaInput, useClass: MockMagmaInput },
                { provide: NgControl, useClass: MockNgControl },
                { provide: Logger, useClass: MockLogger },
            ],
        }).compileComponents();

        mockHost = TestBed.inject(MagmaInput) as unknown as MockMagmaInput;
        mockNgControl = TestBed.inject(NgControl) as unknown as MockNgControl;
        mockLogger = TestBed.inject(Logger) as unknown as MockLogger;

        fixture = TestBed.createComponent(TestMagmaInputCommon);
        directive = fixture.componentInstance;
        directive.host = mockHost as unknown as MagmaInput;
        directive.ngControl = mockNgControl as unknown as NgControl;
        fixture.componentRef.setInput('placeholder', 'Test Placeholder');
    });

    it('should create', () => {
        expect(directive).toBeTruthy();
    });

    describe('registerOnChange', () => {
        it('should set onChange callback', () => {
            const mockFn = jasmine.createSpy('onChange');
            directive.registerOnChange(mockFn);
            expect(directive.onChange).toBe(mockFn);
        });
    });

    describe('registerOnTouched', () => {
        it('should set onTouched callback', () => {
            const mockFn = jasmine.createSpy('onTouched');
            directive.registerOnTouched(mockFn);
            expect(directive.onTouched).toBe(mockFn);
        });
    });

    it('should set id correctly', () => {
        fixture.componentRef.setInput('id', 'test-id');
        expect(directive._id()).toBe('test-id');
    });

    it('should set name correctly', () => {
        fixture.componentRef.setInput('name', 'test-name');
        expect(directive._name()).toBe('test-name');
    });

    it('should set placeholder correctly', () => {
        fixture.componentRef.setInput('placeholder', 'Test Placeholder');
        expect(directive.placeholder()).toBe('Test Placeholder');
    });

    it('should set host and ngControl on ngOnInit', () => {
        spyOn(directive as any, 'setHostLabelId');
        directive.ngOnInit();
        expect(directive.host).toBe(mockHost as any);
        expect(directive['setHostLabelId']).toHaveBeenCalled();
    });

    it('should call writeValue on value change', () => {
        spyOn(directive, 'writeValue');
        directive.ngOnChanges({
            value: {
                currentValue: 'new value',
                previousValue: 'old value',
                firstChange: false,
                isFirstChange: () => false,
            },
        });
        expect(directive.writeValue).toHaveBeenCalledWith('new value');
    });

    it('should call setHostLabelId on id change', () => {
        spyOn(directive as any, 'setHostLabelId');
        directive.ngOnChanges({
            id: { currentValue: 'new-id', previousValue: 'old-id', firstChange: false, isFirstChange: () => false },
        });
        expect(directive['setHostLabelId']).toHaveBeenCalled();
    });

    it('should update value and trigger animation on writeValue', fakeAsync(() => {
        spyOn(directive as any, 'initAnimation');
        directive.writeValue('test value');
        tick();
        expect(directive.getValue()).toBe('test value');
        expect(directive['initAnimation']).toHaveBeenCalled();
    }));

    it('should set error message on validate', fakeAsync(() => {
        mockNgControl.control.touched = true;
        mockNgControl.control.errors = { required: true } as any;
        (mockNgControl.control as any).controlData = { required: { message: 'Required field' } };
        directive.validate(mockNgControl.control as AbstractControl);
        tick();
        expect(mockHost._errorMessage.set).toHaveBeenCalledWith('Required field');
    }));

    describe('validate', () => {
        beforeEach(() => {
            mockNgControl.control.errors = null;
            mockNgControl.control.touched = false;
        });

        it('should not set error message if control is not touched', () => {
            directive.validate(mockNgControl.control as AbstractControl);
            expect(mockHost._errorMessage.set).not.toHaveBeenCalled();
        });

        it('should not set error message if control has no errors', fakeAsync(() => {
            mockNgControl.control.touched = true;
            directive.validate(mockNgControl.control as AbstractControl);
            tick();
            expect(mockHost._errorMessage.set).toHaveBeenCalledWith(null);
        }));

        it('should set error message with function message', fakeAsync(() => {
            mockNgControl.control.touched = true;
            mockNgControl.control.errors = { required: true } as any;
            (mockNgControl.control as any).controlData = {
                required: {
                    message: (params: any) => `Custom message for ${params.type}`,
                },
            };

            directive.validate(mockNgControl.control as AbstractControl);
            tick();

            expect(mockHost._errorMessage.set).toHaveBeenCalledWith('Custom message for required');
        }));

        it('should set error message with string message', fakeAsync(() => {
            mockNgControl.control.touched = true;
            mockNgControl.control.errors = { required: true } as any;
            (mockNgControl.control as any).controlData = {
                required: { message: 'Required field' },
            };

            directive.validate(mockNgControl.control as AbstractControl);
            tick();

            expect(mockHost._errorMessage.set).toHaveBeenCalledWith('Required field');
        }));

        it('should replace placeholders in error message', fakeAsync(() => {
            mockNgControl.control.touched = true;
            mockNgControl.control.errors = { minlength: { requiredLength: 5, actualLength: 3 } } as any;
            (mockNgControl.control as any).controlData = {
                minlength: {
                    message: 'Minimum length is {requiredLength}, got {actualLength}',
                },
            };
            (mockNgControl.control as any).controlParamsData = { requiredLength: 5, actualLength: 3 };

            directive.validate(mockNgControl.control as AbstractControl);
            tick();

            expect(mockHost._errorMessage.set).toHaveBeenCalledWith('Minimum length is 5, got 3');
        }));

        it('should handle multiple errors and use the first one', fakeAsync(() => {
            mockNgControl.control.touched = true;
            mockNgControl.control.errors = {
                required: true,
                minlength: { requiredLength: 5, actualLength: 3 },
            } as any;
            (mockNgControl.control as any).controlData = {
                required: { message: 'Required field' },
                minlength: { message: 'Too short' },
            };

            directive.validate(mockNgControl.control as AbstractControl);
            tick();

            expect(mockHost._errorMessage.set).toHaveBeenCalledWith('Required field');
        }));
    });

    describe('PlaceholderAnimation (part with Mock)', () => {
        it('should placeholder not start animation if only text', fakeAsync(() => {
            spyOn(directive as any, 'stopPlaceholderAnimation');
            fixture.componentRef.setInput('placeholder', 'test');
            fixture.detectChanges();
            expect(directive['stopPlaceholderAnimation']).toHaveBeenCalled();
        }));

        it('should start placeholder animation if value is empty', fakeAsync(() => {
            spyOn(directive as any, 'startPlaceholderAnimation');
            fixture.componentRef.setInput('placeholderAnimated', 'test');
            directive.writeValue('');
            tick();
            expect(directive['startPlaceholderAnimation']).toHaveBeenCalled();
        }));

        it('should stop placeholder animation if value is not empty', fakeAsync(() => {
            spyOn(directive as any, 'stopPlaceholderAnimation');
            fixture.componentRef.setInput('placeholderAnimated', 'test');
            directive.writeValue('test');
            tick();
            expect(directive['stopPlaceholderAnimation']).toHaveBeenCalled();
        }));

        it('should start placeholder animation with correct parameters', () => {
            spyOn(directive as any, 'inPlaceholderAnimation');

            fixture.componentRef.setInput('placeholderAnimated', '100 2 50 |');

            directive['startPlaceholderAnimation']('100 2 50 |');
            expect(directive['inPlaceholderAnimation']).toHaveBeenCalledWith(100, 2, 50, '|');
        });

        it('should placeholder not start animation if only text', fakeAsync(() => {
            spyOn(directive as any, 'stopPlaceholderAnimation');
            spyOn(directive.placeholderDisplay as any, 'set');

            fixture.componentRef.setInput('placeholder', 'test|test2');
            fixture.detectChanges();
            expect(directive['placeholderTimer']).toBe(undefined);
        }));
    });

    describe('inPlaceholderAnimation', () => {
        beforeEach(() => {
            Timing['timers'] = {};
            Timing['inc'] = 0;

            fixture.componentRef.setInput('placeholder', 'Test');

            directive.placeholderDisplay.set('');
        });

        afterEach(() => {
            Object.keys(Timing['timers']).forEach(key => {
                Timing.stop(parseInt(key));
            });
        });

        it('should start animation and update placeholder display', fakeAsync(() => {
            directive['inPlaceholderAnimation'](10, 1, 10, '|');
            const timerId = directive['placeholderTimer']!;

            tick(10);
            expect(directive.placeholderDisplay()).toBe('T');

            tick(10);
            expect(directive.placeholderDisplay()).toBe('Te');

            tick(10);
            expect(directive.placeholderDisplay()).toBe('Tes');

            tick(10);
            expect(directive.placeholderDisplay()).toBe('Test');

            tick(10);
            expect(Timing['timers'][timerId]).toBeUndefined();
            expect(directive['placeholderTimer']).toBeUndefined();
        }));

        it('should handle separator correctly', fakeAsync(() => {
            fixture.componentRef.setInput('placeholder', 'Test|Placeholder');

            directive['inPlaceholderAnimation'](10, 1, 10, '|');
            const timerId = directive['placeholderTimer']!;

            tick(40);
            expect(directive.placeholderDisplay()).toBe('Test');

            tick(10);
            expect(directive.placeholderDisplay()).toBe('');

            tick(10);
            expect(directive.placeholderDisplay()).toBe('P');

            Timing.stop(timerId);
        }));

        it('should restart animation when repeat > 1', fakeAsync(() => {
            fixture.componentRef.setInput('placeholder', 'Test');
            directive['inPlaceholderAnimation'](10, 2, 10, '|');
            const timerId = directive['placeholderTimer']!;

            tick(50);
            expect(directive.placeholderDisplay()).toBe('Test');

            tick(10);
            expect(directive.placeholderDisplay()).toBe('');

            tick(10);
            expect(directive.placeholderDisplay()).toBe('T');

            Timing.stop(timerId);
        }));

        it('should stop animation when stopPlaceholderAnimation is called', fakeAsync(() => {
            fixture.componentRef.setInput('placeholder', 'Test|Placeholder');
            directive['inPlaceholderAnimation'](10, 1, 10, '|');
            const timerId = directive['placeholderTimer']!;

            directive['stopPlaceholderAnimation']('|');

            expect(Timing['timers'][timerId]).toBeUndefined();
            expect(directive['placeholderTimer']).toBeUndefined();
            expect(directive.placeholderDisplay()).toBe('Placeholder');
        }));

        it('should handle spaces in placeholder text', fakeAsync(() => {
            fixture.componentRef.setInput('placeholder', 'Test Placeholder');
            directive['inPlaceholderAnimation'](10, 1, 10, '|');
            const timerId = directive['placeholderTimer']!;

            tick(100);
            expect(directive.placeholderDisplay()).toBe('Test Placeh');

            tick(100);
            expect(directive.placeholderDisplay()).toBe('Test Placeholder');

            Timing.stop(timerId);
        }));
    });

    describe('infoPlaceholderAnimation', () => {
        it('should parse animation info correctly with all parameters', () => {
            const result = directive['infoPlaceholderAnimation']('100 2 50 |');
            expect(result).toEqual([100, 2, 50, '|']);
        });

        it('should parse animation info with default values', () => {
            const result = directive['infoPlaceholderAnimation']('');
            expect(result).toEqual([30, 1, 30, '|']);
        });

        it('should handle partial parameters', () => {
            const result = directive['infoPlaceholderAnimation']('50');
            expect(result).toEqual([50, 1, 50, '|']);
        });

        it('should ensure minimum values', () => {
            const result = directive['infoPlaceholderAnimation']('0 0 0');
            expect(result).toEqual([30, 1, 30, '|']);
        });
    });

    describe('stopPlaceholderAnimation', () => {
        it('should stop timer and reset placeholder', () => {
            spyOn(Timing, 'stop');
            directive['placeholderTimer'] = 123;
            fixture.componentRef.setInput('placeholder', 'Test|Placeholder');
            directive['stopPlaceholderAnimation']('|');

            expect(Timing.stop).toHaveBeenCalledWith(123);
            expect(directive['placeholderTimer']).toBeUndefined();
            expect(directive.placeholderDisplay()).toBe('Placeholder');
        });

        it('should handle undefined timer', () => {
            directive['placeholderTimer'] = undefined;
            directive['stopPlaceholderAnimation']();

            expect(directive.placeholderDisplay()).toBe('Test Placeholder');
        });

        it('should handle undefined timer and null placeholder', () => {
            fixture.componentRef.setInput('placeholder', null);
            directive['placeholderTimer'] = undefined;
            directive['stopPlaceholderAnimation']('');

            expect(directive.placeholderDisplay()).toBe('');
        });
    });

    it('should set host forId on setHostLabelId', () => {
        fixture.componentRef.setInput('id', 'test-id');
        directive['setHostLabelId']();
        expect(mockHost.forId()).toBe('test-id-input');
    });

    it('should undefined inputElement', () => {
        expect(directive.inputElement).toBe(undefined);
    });
});
