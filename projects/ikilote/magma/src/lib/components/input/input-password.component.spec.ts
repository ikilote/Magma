import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { MagmaInputPassword } from './input-password.component';

describe('MagmaInputPassword', () => {
    let component: MagmaInputPassword;
    let fixture: ComponentFixture<MagmaInputPassword>;
    let debugElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaInputPassword],
            providers: [
                { provide: NG_VALUE_ACCESSOR, useExisting: MagmaInputPassword, multi: true },
                { provide: NG_VALIDATORS, useExisting: MagmaInputPassword, multi: true },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaInputPassword);
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set placeholder correctly', () => {
        fixture.componentRef.setInput('placeholder', 'Enter Password');
        expect(component.placeholder()).toBe('Enter Password');
    });

    it('should set eye correctly', () => {
        fixture.componentRef.setInput('eye', true);
        expect(component.eye()).toBeTrue();
    });

    it('should set disabled correctly', () => {
        fixture.componentRef.setInput('disabled', true);
        expect(component.disabled()).toBeTrue();
    });

    it('should set readonly correctly', () => {
        fixture.componentRef.setInput('readonly', true);
        expect(component.readonly()).toBeTrue();
    });

    it('should set maxlength correctly', () => {
        fixture.componentRef.setInput('maxlength', 20);
        expect(component.maxlength()).toBe(20);
    });

    it('should render password input with type password by default', () => {
        const inputElement = fixture.debugElement.query(By.css('input'));
        expect(inputElement).toBeTruthy();
        expect(inputElement.nativeElement.type).toBe('password');
    });

    it('should render eye icon if eye is true', () => {
        fixture.componentRef.setInput('eye', true);
        fixture.detectChanges();
        const iconElement = fixture.debugElement.query(By.css('.icon-moon, .icon-sun'));
        expect(iconElement).toBeTruthy();
    });

    it('should change input type to text when show is true ans click on eye', () => {
        fixture.componentRef.setInput('eye', true);
        fixture.detectChanges();
        const inputElement = fixture.debugElement.query(By.css('input'));
        const eyeElement = fixture.debugElement.query(By.css('.eye'));
        expect(inputElement.nativeElement.type).toBe('password');

        eyeElement.nativeElement.click();
        fixture.detectChanges();
        expect(inputElement.nativeElement.type).toBe('text');

        eyeElement.nativeElement.click();
        fixture.detectChanges();
        expect(inputElement.nativeElement.type).toBe('password');
    });

    it('should toggle password visibility on icon click', () => {
        spyOn(component, 'toggleShowPassword');
        fixture.componentRef.setInput('eye', true);
        fixture.detectChanges();
        const eyeElement = fixture.debugElement.query(By.css('.eye'));
        eyeElement.nativeElement.click();
        expect(component.toggleShowPassword).toHaveBeenCalled();
    });

    it('should toggle show property on toggleShowPassword', () => {
        component['show'] = false;
        component.toggleShowPassword();
        expect(component['show']).toBeTrue();
        component.toggleShowPassword();
        expect(component['show']).toBeFalse();
    });

    it('should call changeValue on input change', () => {
        spyOn(component, 'changeValue');
        const inputElement = fixture.debugElement.query(By.css('input'));
        inputElement.triggerEventHandler('change', { target: { value: 'new password' } });
        expect(component.changeValue).toHaveBeenCalled();
    });

    it('should call inputValue on input', () => {
        spyOn(component, 'inputValue');
        const inputElement = fixture.debugElement.query(By.css('input'));
        inputElement.triggerEventHandler('input', { target: { value: 'new password' } });
        expect(component.inputValue).toHaveBeenCalled();
    });

    it('should call focus on input focus and blur', () => {
        spyOn(component, 'focus');
        const inputElement = fixture.debugElement.query(By.css('input'));
        inputElement.triggerEventHandler('focus', {});
        expect(component.focus).toHaveBeenCalledWith(true);
        inputElement.triggerEventHandler('blur', {});
        expect(component.focus).toHaveBeenCalledWith(false);
    });

    // it('should display Error if onError is true', () => {
    //     component['onError'] = true;
    //     fixture.detectChanges();
    //     const errorElement = fixture.debugElement.query(By.css('div:contains("Error")'));
    //     expect(errorElement).toBeTruthy();
    // });
});
