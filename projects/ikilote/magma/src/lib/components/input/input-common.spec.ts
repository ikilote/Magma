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

class MockTiming {
    static start = jasmine.createSpy('start').and.returnValue(123);
    static stop = jasmine.createSpy('stop');
    static change = jasmine.createSpy('change');
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
                { provide: Timing, useValue: MockTiming },
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

    it('should set host forId on setHostLabelId', () => {
        fixture.componentRef.setInput('id', 'test-id');
        directive['setHostLabelId']();
        expect(mockHost.forId()).toBe('test-id-input');
    });

    it('should undefined inputElement', () => {
        expect(directive.inputElement).toBe(undefined);
    });
});
