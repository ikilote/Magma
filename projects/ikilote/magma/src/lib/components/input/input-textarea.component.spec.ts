import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { MockNgControl } from './input-text.component.spec';
import { MagmaInputTextarea } from './input-textarea.component';

describe('MagmaInputTextarea', () => {
    let component: MagmaInputTextarea;
    let fixture: ComponentFixture<MagmaInputTextarea>;
    let debugElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaInputTextarea],
            providers: [
                { provide: NG_VALUE_ACCESSOR, useExisting: MagmaInputTextarea, multi: true },
                { provide: NG_VALIDATORS, useExisting: MagmaInputTextarea, multi: true },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaInputTextarea);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set autosize correctly', () => {
        fixture.componentRef.setInput('autosize', true);
        expect(component.autosize()).toBeTrue();
    });

    it('should set monospace correctly', () => {
        fixture.componentRef.setInput('monospace', true);
        expect(component.monospace()).toBeTrue();
    });

    it('should set maxlength correctly', () => {
        fixture.componentRef.setInput('maxlength', 100);
        expect(component.maxlength()).toBe(100);
    });

    it('should set displayLimit correctly', () => {
        fixture.componentRef.setInput('displayLimit', 50);
        expect(component.displayLimit()).toBe(50);
    });

    it('should set height correctly', () => {
        fixture.componentRef.setInput('height', '200px');
        expect(component.height()).toBe('200px');
    });

    it('should set maxHeight correctly', () => {
        fixture.componentRef.setInput('maxHeight', '300px');
        expect(component.maxHeight()).toBe('300px');
    });

    it('should set minHeight correctly', () => {
        fixture.componentRef.setInput('minHeight', '100px');
        expect(component.minHeight()).toBe('100px');
    });

    it('should render textarea element', () => {
        const textareaElement = debugElement.query(By.css('textarea'));
        expect(textareaElement).toBeTruthy();
    });

    it('should apply monospace class if monospace is true', () => {
        fixture.componentRef.setInput('monospace', true);
        fixture.detectChanges();
        const hostElement = debugElement.nativeElement;
        expect(hostElement.classList.contains('monospace')).toBeTrue();
    });

    it('should apply styles for height, maxHeight, and minHeight', () => {
        fixture.componentRef.setInput('height', '200px');
        fixture.componentRef.setInput('maxHeight', '300px');
        fixture.componentRef.setInput('minHeight', '100px');
        fixture.detectChanges();
        const hostElement = debugElement.nativeElement;
        expect(hostElement.style.getPropertyValue('--default')).toBe('200px');
        expect(hostElement.style.getPropertyValue('--max')).toBe('300px');
        expect(hostElement.style.getPropertyValue('--min')).toBe('100px');
    });

    it('should update value on change event', () => {
        spyOn(component.update, 'emit');
        const textareaElement = debugElement.query(By.css('textarea')).nativeElement;
        textareaElement.value = 'New text';
        textareaElement.dispatchEvent(new Event('change'));
        expect(component.update.emit).toHaveBeenCalledWith('New text');
    });

    it('should update value on input event', () => {
        spyOn(component, 'onChange');
        const textareaElement = debugElement.query(By.css('textarea')).nativeElement;
        textareaElement.value = 'New text';
        textareaElement.dispatchEvent(new Event('input'));
        expect(component.onChange).toHaveBeenCalledWith('New text');
    });

    it('should call onTouched and validate on blur', () => {
        spyOn(component, 'onTouched');
        spyOn(component, 'validate');

        component.ngOnInit();
        component.ngControl = new MockNgControl() as unknown as NgControl;

        const textareaElement = debugElement.query(By.css('textarea')).nativeElement;

        textareaElement.dispatchEvent(new Event('blur'));
        expect(component.onTouched).toHaveBeenCalled();
        expect(component.validate).toHaveBeenCalledWith((component.ngControl as any)?.control);
    });

    it('should display limit indicator if maxlength and displayLimit are set and text length exceeds limit', () => {
        fixture.componentRef.setInput('maxlength', 10);
        fixture.componentRef.setInput('displayLimit', 10);
        component.writeValue('1234567890');
        fixture.detectChanges();
        const limitElement = debugElement.query(By.css('.limit'));
        expect(limitElement).toBeTruthy();
        const style = limitElement.nativeElement.style;
        expect(style.getPropertyValue('--size')).toBe('10');
        expect(style.getPropertyValue('--total')).toBe('10');
    });

    it('should display Error if onError is true', () => {
        component['onError'].set(true);
        fixture.detectChanges();
        const errorElement = fixture.debugElement.nativeElement.textContent;
        expect(errorElement).toContain('Error');
    });

    it('should disable textarea if disabled is true', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();
        const textareaElement = debugElement.query(By.css('textarea')).nativeElement;
        expect(textareaElement.disabled).toBeTrue();
    });

    it('should disable textarea if readonly is true', () => {
        fixture.componentRef.setInput('readonly', true);
        fixture.detectChanges();
        const textareaElement = debugElement.query(By.css('textarea')).nativeElement;
        expect(textareaElement.readOnly).toBeTrue();
    });
});
