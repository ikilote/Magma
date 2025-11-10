import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { MagmaInputDate } from './input-date.component';
import { MockNgControl } from './input-text.component.spec';

describe('MagmaInputDate', () => {
    let component: MagmaInputDate;
    let fixture: ComponentFixture<MagmaInputDate>;
    let debugElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaInputDate],
            providers: [
                { provide: NG_VALUE_ACCESSOR, useExisting: MagmaInputDate, multi: true },
                { provide: NG_VALIDATORS, useExisting: MagmaInputDate, multi: true },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaInputDate);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Input properties', () => {
        const typeTests = [
            { value: 'date', expected: 'date' },
            { value: 'datetime-local', expected: 'datetime-local' },
            { value: 'time', expected: 'time' },
            { value: 'month', expected: 'month' },
            { value: 'week', expected: 'week' },
        ];

        typeTests.forEach(({ value, expected }) => {
            it(`should set type to ${expected}`, () => {
                fixture.componentRef.setInput('type', value);
                expect(component.type()).toBe(expected);
            });
        });
    });

    it('should render input element with correct type', () => {
        fixture.componentRef.setInput('type', 'date');
        fixture.detectChanges();
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        expect(inputElement.type).toBe('date');
    });

    it('should render input element with correct attributes', () => {
        fixture.componentRef.setInput('type', 'date');
        component.writeValue('2023-10-10');
        fixture.detectChanges();
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        expect(inputElement.value).toBe('2023-10-10');
        expect(inputElement.id).toContain(component._id() + '-input');
        expect(inputElement.name).toBe(component._name());
    });

    it('should render input element with undefined attributes', () => {
        fixture.componentRef.setInput('type', 'date');
        component.writeValue(undefined);
        fixture.detectChanges();
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        expect(inputElement.value).toBe('');
        expect(inputElement.id).toContain(component._id() + '-input');
        expect(inputElement.name).toBe(component._name());
    });

    it('should update value on change event', () => {
        spyOn(component, 'onChange');
        spyOn(component.update, 'emit');

        const inputElement = debugElement.query(By.css('input')).nativeElement;
        inputElement.value = '2023-10-10';
        inputElement.dispatchEvent(new Event('change'));
        fixture.detectChanges();
        expect(component.onChange).toHaveBeenCalledWith('2023-10-10');
        expect(component.update.emit).toHaveBeenCalledWith('2023-10-10');
    });

    it('should update value on input event', () => {
        spyOn(component, 'onChange');
        spyOn(component.update, 'emit');

        const inputElement = debugElement.query(By.css('input')).nativeElement;
        inputElement.value = '2023-10-10';
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(component.onChange).toHaveBeenCalledWith('2023-10-10');
        component.inputElement!.value = '2023-10-10';
    });

    it('should update value on input event with undefined value', () => {
        spyOn(component, 'onChange');
        spyOn(component.update, 'emit');

        const inputElement = debugElement.query(By.css('input')).nativeElement;
        inputElement.value = undefined;
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(component.onChange).toHaveBeenCalledWith('');
        component.inputElement!.value = '';
    });

    it('should call onTouched and validate on blur', () => {
        spyOn(component, 'onTouched');
        spyOn(component, 'validate');
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        inputElement.dispatchEvent(new Event('blur'));
        expect(component.onTouched).toHaveBeenCalled();
        expect(component.validate).not.toHaveBeenCalled();
    });

    it('should call onTouched and validate on blur', () => {
        spyOn(component, 'onTouched');
        spyOn(component, 'validate');

        component.ngOnInit();
        component.ngControl = new MockNgControl() as unknown as NgControl;

        const inputElement = debugElement.query(By.css('input')).nativeElement;

        inputElement.dispatchEvent(new Event('blur'));
        expect(component.onTouched).toHaveBeenCalled();
        expect(component.validate).toHaveBeenCalledWith((component.ngControl as any)?.control);
    });

    it('should disable input if disabled is true', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        expect(inputElement.disabled).toBeTrue();
    });

    it('should set input to readonly if readonly is true', () => {
        fixture.componentRef.setInput('readonly', true);
        fixture.detectChanges();
        const inputElement = debugElement.query(By.css('input')).nativeElement;
        expect(inputElement.readOnly).toBeTrue();
    });
});
