import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { MagmaInputRadio } from './input-radio.component';
import { MagmaInput } from './input.component';

describe('MagmaInputRadio', () => {
    let component: MagmaInputRadio;
    let fixture: ComponentFixture<MagmaInputRadio>;
    let debugElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaInputRadio],
            providers: [
                { provide: NG_VALUE_ACCESSOR, useExisting: MagmaInputRadio, multi: true },
                { provide: NG_VALIDATORS, useExisting: MagmaInputRadio, multi: true },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaInputRadio);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        fixture.componentRef.setInput('value', 'test-value');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set value correctly', () => {
        fixture.componentRef.setInput('value', 'new-value');
        expect(component.value()).toBe('new-value');
    });

    it('should set checked correctly', () => {
        fixture.componentRef.setInput('checked', true);
        expect(component.checked()).toBeTrue();
    });

    it('should render input element with type radio', () => {
        const inputElement = debugElement.query(By.css('input[type="radio"]'));
        expect(inputElement).toBeTruthy();
    });

    it('should render label element with correct attributes', () => {
        const labelElement = debugElement.query(By.css('label'));
        expect(labelElement).toBeTruthy();
        expect(labelElement.attributes['for']).toContain(component._id() + '-input');
    });

    it('should set checked attribute on input if testChecked is true', () => {
        component['testChecked'] = true;
        fixture.detectChanges();
        const inputElement = debugElement.query(By.css('input[type="radio"]')).nativeElement;
        expect(inputElement.checked).toBeTrue();
    });

    it('should not set checked attribute on input if testChecked is false', () => {
        component['testChecked'] = false;
        fixture.detectChanges();
        const inputElement = debugElement.query(By.css('input[type="radio"]')).nativeElement;
        expect(inputElement.checked).toBeFalse();
    });

    it('should update testChecked and call detectChanges on writeValue', () => {
        spyOn(component['cd'], 'detectChanges');
        fixture.componentRef.setInput('value', 'test-value');
        component.writeValue('test-value');
        expect(component['testChecked']).toBeTrue();
        expect(component['cd'].detectChanges).toHaveBeenCalled();
    });

    it('should call onChange, onTouched, and emit update on _change', () => {
        spyOn(component, 'onChange');
        spyOn(component, 'onTouched');
        spyOn(component['update'], 'emit');
        const inputElement = debugElement.query(By.css('input[type="radio"]')).nativeElement;
        inputElement.dispatchEvent(new Event('change'));
        expect(component.onChange).toHaveBeenCalledWith('test-value');
        expect(component.onTouched).toHaveBeenCalled();
        expect(component.update.emit).toHaveBeenCalledWith('test-value');
    });

    it('should update testChecked on ngOnChanges', () => {
        const changes = {
            checked: {
                currentValue: true,
                previousValue: false,
                firstChange: false,
                isFirstChange: () => false,
            },
        };
        component.ngOnChanges(changes);
        expect(component['testChecked']).toBeTrue();
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
        const inputElement = debugElement.query(By.css('input[type="radio"]')).nativeElement;
        expect(inputElement.disabled).toBeTrue();
    });

    it('should set input to readonly if readonly is true', () => {
        fixture.componentRef.setInput('readonly', true);
        fixture.detectChanges();
        const inputElement = debugElement.query(By.css('input[type="radio"]')).nativeElement;
        expect(inputElement.readOnly).toBeTrue();
    });
});

@Component({
    template: `
        <mg-input id="test-group">
            <mg-input-radio value="option1" />
            <mg-input-radio value="option2" />
            <mg-input-radio value="option3" />
        </mg-input>
    `,
    imports: [MagmaInput, MagmaInputRadio],
})
class TestHostComponent {}

describe('MagmaInput with MagmaInputRadio', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let debugElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        debugElement = fixture.debugElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('should pass the name attribute from mg-input to mg-input-radio components', () => {
        const radioInputs = debugElement.queryAll(By.directive(MagmaInputRadio));
        expect(radioInputs.length).toBe(3);

        radioInputs.forEach(radioInput => {
            const componentInstance = radioInput.componentInstance as MagmaInputRadio;
            expect(componentInstance._name()).toBe('test-group');
        });
    });

    it('should have the same name attribute in the DOM for all radio inputs', () => {
        const radioElements = debugElement.queryAll(By.css('input[type="radio"]'));
        expect(radioElements.length).toBe(3);

        radioElements.forEach(radioElement => {
            expect(radioElement.nativeElement.getAttribute('name')).toBe('test-group');
        });
    });

    it('should have unique id attributes for all radio inputs', () => {
        const radioElements = debugElement.queryAll(By.css('input[type="radio"]'));
        const ids = radioElements.map(radioElement => radioElement.nativeElement.getAttribute('id'));
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });
});
