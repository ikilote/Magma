import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { MagmaInputText } from './input-text.component';

export class MockNgControl {
    control = {
        errors: { required: true },
        touched: true,
    };
}

describe('MagmaInputText', () => {
    let component: MagmaInputText;
    let fixture: ComponentFixture<MagmaInputText>;
    let debugElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaInputText],
            providers: [
                { provide: NG_VALUE_ACCESSOR, useExisting: MagmaInputText, multi: true },
                { provide: NG_VALIDATORS, useExisting: MagmaInputText, multi: true },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaInputText);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set type correctly', () => {
        fixture.componentRef.setInput('type', 'email');
        fixture.detectChanges();
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        expect(inputElement.type).toBe('email');
    });

    it('should set placeholder correctly', () => {
        fixture.componentRef.setInput('placeholder', 'Test Placeholder');
        fixture.detectChanges();
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        expect(inputElement.placeholder).toBe('Test Placeholder');
    });

    it('should set clearCross correctly', () => {
        fixture.componentRef.setInput('clearCross', true);
        fixture.detectChanges();
        expect(component.clearCross()).toBeTrue();
    });

    it('should set maxlength correctly', () => {
        fixture.componentRef.setInput('maxlength', 50);
        fixture.detectChanges();
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        expect(inputElement.maxLength).toBe(50);
    });

    it('should render input element', () => {
        const inputElement = debugElement.query(By.css('input'));
        expect(inputElement).toBeTruthy();
    });

    it('should render datalist if datalist is provided', () => {
        fixture.componentRef.setInput('datalist', [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            'Option 3',
        ]);
        fixture.detectChanges();
        const datalistElement = debugElement.query(By.css('datalist'));
        expect(datalistElement).toBeTruthy();
    });

    it('should render options in datalist', () => {
        fixture.componentRef.setInput('datalist', [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            'Option 3',
        ]);
        fixture.detectChanges();
        const options = debugElement.queryAll(By.css('option'));
        expect(options.length).toBe(3);
    });

    it('should render clear icon if clearCross is true and input has value', () => {
        fixture.componentRef.setInput('clearCross', true);
        component.writeValue('test value');
        fixture.detectChanges();
        const clearIcon = debugElement.query(By.css('.icon-remove'));
        expect(clearIcon).toBeTruthy();
    });

    it('should call clearField on clear icon click', () => {
        spyOn(component, 'clearField');
        fixture.componentRef.setInput('clearCross', true);
        component.writeValue('test value');
        fixture.detectChanges();
        const clearIcon = debugElement.query(By.css('.icon-remove'));
        clearIcon.triggerEventHandler('click', {});
        expect(component.clearField).toHaveBeenCalled();
    });

    it('should update value on change event', () => {
        spyOn(component, 'onChange');
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        inputElement.value = 'new value';
        inputElement.dispatchEvent(new Event('change'));
        expect(component.onChange).toHaveBeenCalledWith('new value');
    });

    it('should update value on input event', () => {
        spyOn(component, 'onChange');
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        inputElement.value = 'new value';
        inputElement.dispatchEvent(new Event('input'));
        expect(component.onChange).toHaveBeenCalledWith('new value');
    });

    it('should clear input value on clearField', () => {
        spyOn(component, 'onChange');
        spyOn(component.update, 'emit');
        component.writeValue('test value');
        component.clearField();
        expect(component.onChange).toHaveBeenCalledWith('');
        expect(component.update.emit).toHaveBeenCalledWith('');
    });

    it('should call focus on input focus', () => {
        spyOn(component, 'focus');
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        inputElement.dispatchEvent(new Event('focus'));
        expect(component.focus).toHaveBeenCalledWith(true);
    });

    it('should not call onTouched on input focus', () => {
        spyOn(component, 'onTouched');
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        inputElement.dispatchEvent(new Event('focus'));
        expect(component.onTouched).not.toHaveBeenCalled();
    });

    it('should call focus on input blur', () => {
        spyOn(component, 'focus');
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        inputElement.dispatchEvent(new Event('blur'));
        expect(component.focus).toHaveBeenCalledWith(false);
    });

    it('should call onTouched on input blur', () => {
        spyOn(component, 'onTouched');
        spyOn(component, 'validate');
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        inputElement.dispatchEvent(new Event('blur'));
        expect(component.onTouched).toHaveBeenCalled();
        expect(component.validate).not.toHaveBeenCalled();
    });

    it('should call onTouched and validate on blur if ngControl is present', () => {
        spyOn(component, 'onTouched');
        spyOn(component, 'validate');

        component.ngOnInit();
        component.ngControl = new MockNgControl() as unknown as NgControl;

        const inputElement = debugElement.query(By.css('input')).nativeElement;
        inputElement.dispatchEvent(new Event('blur'));

        expect(component.onTouched).toHaveBeenCalled();
        expect(component.validate).toHaveBeenCalledWith((component.ngControl as any)?.control);
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
});
