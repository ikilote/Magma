import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { MagmaInputNumber } from './input-number.component';
import { MockNgControl } from './input-text.component.spec';

describe('MagmaInputNumber', () => {
    let component: MagmaInputNumber;
    let fixture: ComponentFixture<MagmaInputNumber>;
    let debugElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaInputNumber],
            providers: [
                { provide: NG_VALUE_ACCESSOR, useExisting: MagmaInputNumber, multi: true },
                { provide: NG_VALIDATORS, useExisting: MagmaInputNumber, multi: true },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaInputNumber);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Input properties', () => {
        const inputTests = [
            { property: 'step', value: 2, expected: 2 },
            { property: 'min', value: 0, expected: 0 },
            { property: 'max', value: 100, expected: 100 },
            { property: 'forceMinMax', value: true, expected: true },
            { property: 'showArrows', value: true, expected: true },
            { property: 'noDecimal', value: true, expected: true },
            { property: 'noNegative', value: true, expected: true },
        ];

        inputTests.forEach(({ property, value, expected }) => {
            it(`should set ${property} correctly`, () => {
                fixture.componentRef.setInput(property, value);
                expect((component as any)[property]()).toEqual(expected);
            });
        });
    });

    it('should render input element with type number', () => {
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        expect(inputElement.type).toBe('number');
    });

    it('should render datalist if datalist is provided', () => {
        fixture.componentRef.setInput('datalist', [1, 2, 3]);
        fixture.detectChanges();
        const datalistElement = debugElement.query(By.css('datalist'));
        expect(datalistElement).toBeTruthy();
    });

    it('should render options in datalist', () => {
        fixture.componentRef.setInput('datalist', [1, 2, 3]);
        fixture.detectChanges();
        const options = debugElement.queryAll(By.css('option'));
        expect(options.length).toBe(3);
    });

    it('should update value on change event', () => {
        spyOn(component, 'onChange');
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        inputElement.value = '42';
        inputElement.dispatchEvent(new Event('change'));
        expect(component.onChange).toHaveBeenCalledWith(42);
    });

    it('should update value on input event', () => {
        spyOn(component, 'onChange');
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        inputElement.value = '42';
        inputElement.dispatchEvent(new Event('input'));
        expect(component.onChange).toHaveBeenCalledWith(42);
    });

    it('should prevent default on non-accepted keys', () => {
        const event = new KeyboardEvent('keydown', { key: 'a' });
        spyOn(event, 'preventDefault');
        component.keydown(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should allow accepted keys', () => {
        const event = new KeyboardEvent('keydown', { key: '1' });
        spyOn(event, 'preventDefault');
        component.keydown(event);
        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should prevent decimal keys if noDecimal is true (.)', () => {
        fixture.componentRef.setInput('noDecimal', true);
        const event = new KeyboardEvent('keydown', { key: '.' });
        spyOn(event, 'preventDefault');
        component.keydown(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should prevent decimal keys if noDecimal is true (,)', () => {
        fixture.componentRef.setInput('noDecimal', true);
        const event = new KeyboardEvent('keydown', { key: ',' });
        spyOn(event, 'preventDefault');
        component.keydown(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should prevent negative keys if noNegative is true', () => {
        fixture.componentRef.setInput('noNegative', true);
        const event = new KeyboardEvent('keydown', { key: '-' });
        spyOn(event, 'preventDefault');
        component.keydown(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should prevent multiple decimal points (.)', () => {
        component.inputElement.value = '3.14';
        const event = new KeyboardEvent('keydown', { key: '.' });
        spyOn(event, 'preventDefault');
        component.keydown(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should prevent multiple decimal points (,)', () => {
        component.inputElement.value = '3.14';
        const event = new KeyboardEvent('keydown', { key: ',' });
        spyOn(event, 'preventDefault');
        component.keydown(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should prevent multiple negative signs', () => {
        component.inputElement.value = '-42';
        const event = new KeyboardEvent('keydown', { key: '-' });
        spyOn(event, 'preventDefault');
        component.keydown(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should add negative sign if not present', () => {
        component.inputElement.value = '42';
        const event = new KeyboardEvent('keydown', { key: '-' });
        spyOn(event, 'preventDefault');
        spyOn(component, 'changeValue');
        component.keydown(event);
        expect(component.inputElement.value).toBe('-42');
        expect(component.changeValue).toHaveBeenCalled();
    });

    it('should not change value when invalide key', () => {
        component.inputElement.value = '';
        const event = new KeyboardEvent('keydown', { key: 'a' });
        spyOn(event, 'preventDefault');
        spyOn(component, 'changeValue');
        component.keydown(event);
        expect(component.inputElement.value).toBe('');
        expect(component.changeValue).not.toHaveBeenCalled();
    });

    it('should update input value on blur if different from _value', () => {
        component['_value'] = 42;
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        inputElement.value = '3.14';
        spyOn(component, 'onTouched');
        spyOn(component, 'validate');
        inputElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        expect(inputElement.value).toBe('42');
        expect(component.onTouched).toHaveBeenCalled();
        expect(component.validate).not.toHaveBeenCalled();
    });

    it('should update input value on blur if different from _value with NgControl', () => {
        component['_value'] = 42;
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        inputElement.value = '3.14';
        spyOn(component, 'onTouched');
        spyOn(component, 'validate');

        component.ngOnInit();
        component.ngControl = new MockNgControl() as unknown as NgControl;

        inputElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        expect(inputElement.value).toBe('42');
        expect(component.onTouched).toHaveBeenCalled();
        expect(component.validate).toHaveBeenCalledWith((component.ngControl as any)?.control);
    });

    it('should dispatch input event', () => {
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        inputElement.value = undefined as any;
        const event = new KeyboardEvent('input');
        spyOn(event, 'preventDefault');
        spyOn(component, 'changeValue');
        inputElement.dispatchEvent(event);
        expect(component.inputElement.value).toBe('');
        expect(component.changeValue).not.toHaveBeenCalled();
    });

    it('should force value to min if less than min', () => {
        fixture.componentRef.setInput('forceMinMax', true);
        fixture.componentRef.setInput('min', 0);
        const value = component['forceValue'](-1);
        expect(value).toBe(0);
    });

    it('should force value to max if greater than max', () => {
        fixture.componentRef.setInput('forceMinMax', true);
        fixture.componentRef.setInput('max', 100);
        const value = component['forceValue'](101);
        expect(value).toBe(100);
    });

    it('should force value to min if less than min', () => {
        fixture.componentRef.setInput('forceMinMax', true);
        fixture.componentRef.setInput('min', 1);
        // @ts-ignore
        const value = component['forceValue'](null);
        expect(value).toBe(1);
    });

    it('should force value to max if less than max', () => {
        fixture.componentRef.setInput('forceMinMax', true);
        fixture.componentRef.setInput('max', -1);
        // @ts-ignore
        const value = component['forceValue'](null);
        expect(value).toBe(-1);
    });

    it('should display Error if onError is true', () => {
        component['onError'].set(true);
        fixture.detectChanges();
        const errorElement = fixture.debugElement.nativeElement.textContent;
        expect(errorElement).toContain('Error');
    });

    // edge tests

    it('should write undefined', () => {
        component.writeValue(undefined);
        expect(debugElement.query(By.css('input')).nativeElement.value).toBe('');
    });

    it('should write null', () => {
        component.writeValue(null);
        expect(debugElement.query(By.css('input')).nativeElement.value).toBe('');
    });

    it('should dispatch input event with invalid value on input', () => {
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        inputElement.value = 'test';
        const event = new KeyboardEvent('input');
        spyOn(event, 'preventDefault');
        spyOn(component, 'changeValue');
        inputElement.dispatchEvent(event);
        expect(component.inputElement.value).toBe('');
        expect(component.changeValue).not.toHaveBeenCalled();
    });
});
