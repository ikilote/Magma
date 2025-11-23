import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { MagmaInputRange } from './input-range.component';

describe('MagmaInputRange', () => {
    let component: MagmaInputRange;
    let fixture: ComponentFixture<MagmaInputRange>;
    let debugElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaInputRange],
            providers: [
                { provide: NG_VALUE_ACCESSOR, useExisting: MagmaInputRange, multi: true },
                { provide: NG_VALIDATORS, useExisting: MagmaInputRange, multi: true },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaInputRange);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set step correctly', () => {
        fixture.componentRef.setInput('step', 5);
        expect(component.step()).toBe(5);
    });

    it('should set min correctly', () => {
        fixture.componentRef.setInput('min', 0);
        expect(component.min()).toBe(0);
    });

    it('should set max correctly', () => {
        fixture.componentRef.setInput('max', 100);
        expect(component.max()).toBe(100);
    });

    it('should render input element with type range', () => {
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        expect(inputElement.type).toBe('range');
    });

    it('should render datalist if datalist is provided', () => {
        fixture.componentRef.setInput('datalist', [10, 20, 30]);
        fixture.detectChanges();
        const datalistElement = debugElement.query(By.css('datalist'));
        expect(datalistElement).toBeTruthy();
    });

    it('should render options in datalist', () => {
        fixture.componentRef.setInput('datalist', [10, 20, 30]);
        fixture.detectChanges();
        const options = debugElement.queryAll(By.css('option'));
        expect(options.length).toBe(3);
    });

    it('should update value on change event', () => {
        spyOn(component.update, 'emit');
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        inputElement.value = '75';
        inputElement.dispatchEvent(new Event('change'));
        expect(component.update.emit).toHaveBeenCalledWith(75);
    });

    it('should update value on input event', () => {
        spyOn(component, 'onChange');
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        inputElement.value = '75';
        inputElement.dispatchEvent(new Event('input'));
        expect(component.onChange).toHaveBeenCalledWith(75);
    });

    it('should display Error if onError is true', () => {
        component['onError'].set(true);
        fixture.detectChanges();
        const errorElement = fixture.debugElement.nativeElement.textContent;
        expect(errorElement).toContain('Error');
    });

    it('should disable input if disabled is true', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        expect(inputElement.disabled).toBeTrue();
    });

    it('should disable input if readonly is true', () => {
        fixture.componentRef.setInput('readonly', true);
        fixture.detectChanges();
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        expect(inputElement.disabled).toBeTrue();
    });
});
