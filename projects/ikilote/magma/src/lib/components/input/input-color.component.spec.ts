import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { MagmaInputColor } from './input-color.component';
import { MockNgControl } from './input-text.component.spec';

describe('MagmaInputColor', () => {
    let component: MagmaInputColor;
    let fixture: ComponentFixture<MagmaInputColor>;
    let debugElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaInputColor],
            providers: [
                { provide: NG_VALUE_ACCESSOR, useExisting: MagmaInputColor, multi: true },
                { provide: NG_VALIDATORS, useExisting: MagmaInputColor, multi: true },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaInputColor);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Input properties', () => {
        const inputTests = [
            { name: 'alpha', value: true },
            { name: 'clearButton', value: true },
            { name: 'texts', value: { apply: 'Apply', cancel: 'Cancel' } },
            { name: 'palette', value: ['#FF0000', '#00FF00', '#0000FF'] },
        ];

        inputTests.forEach(({ name, value }) => {
            it(`should set ${name} correctly`, () => {
                fixture.componentRef.setInput(name, value);
                expect((component as any)[name]()).toEqual(value);
                fixture.detectChanges();
                expect(
                    (component.inputDirective as any)['colorPicker' + name[0].toUpperCase() + name.substring(1)](),
                ).toEqual(value);
            });
        });
    });

    it('should render hidden input', () => {
        const inputElement = debugElement.query(By.css('input[type="hidden"]'));
        expect(inputElement).toBeTruthy();
    });

    it('should render span with colorPicker attributes', () => {
        const spanElement = debugElement.query(By.css('.spanPicker'));
        expect(spanElement).toBeTruthy();
    });

    it('should call onChange, writeValue, onTouched, and validate on colorClose', () => {
        spyOn(component, 'onChange');
        spyOn(component, 'writeValue');
        spyOn(component, 'onTouched');
        spyOn(component, 'validate');
        component.inputDirective?.colorClose.emit('#FF0000');
        expect(component.onChange).toHaveBeenCalledWith('#FF0000');
        expect(component.writeValue).toHaveBeenCalledWith('#FF0000');
        expect(component.onTouched).toHaveBeenCalled();
        expect(component.validate).not.toHaveBeenCalled();
    });

    it('should call onChange, writeValue, onTouched, and validate on colorClose', () => {
        spyOn(component, 'onChange');
        spyOn(component, 'writeValue');
        spyOn(component, 'onTouched');
        spyOn(component, 'validate');

        component.ngOnInit();
        component.ngControl = new MockNgControl() as unknown as NgControl;

        component.inputDirective?.colorClose.emit('#FF0000');
        expect(component.onChange).toHaveBeenCalledWith('#FF0000');
        expect(component.writeValue).toHaveBeenCalledWith('#FF0000');
        expect(component.onTouched).toHaveBeenCalled();
        expect(component.validate).toHaveBeenCalledWith((component.ngControl as any)?.control);
    });

    it('should display Error if onError is true', () => {
        component['onError'].set(true);
        fixture.detectChanges();
        const errorElement = debugElement.query(By.css('div:contains("Error")'));
        expect(errorElement).toBeNull();
    });

    it('should apply empty class if _value is empty', () => {
        component.writeValue('');
        fixture.detectChanges();
        const spanElement = debugElement.query(By.css('.spanPicker')).nativeElement;
        expect(spanElement.classList.contains('empty')).toBeTrue();
        expect(component.inputElement?.value).toBe('');
    });

    it('should not apply empty class if _value is not empty', () => {
        component.writeValue('#FF0000');
        fixture.detectChanges();
        const spanElement = debugElement.query(By.css('.spanPicker')).nativeElement;
        expect(spanElement.classList.contains('empty')).toBeFalse();
        expect(component.inputElement?.value).toBe('#FF0000');
    });
});
