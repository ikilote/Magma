import { Component, DebugElement, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { MagmaInputCheckbox } from './input-checkbox.component';
import { MagmaInputElement } from './input-element.component';
import { MagmaInput } from './input.component';

@Component({ selector: 'mg-input-checkbox' })
class MockMagmaInputCommon {
    host: MagmaInput | null = null;
    refreshTrigger = signal(undefined);
    componentName = 'input-checkbox';
    getValue = jasmine.createSpy('getValue').and.returnValue(true);
    onChange = jasmine.createSpy('onChange');
}

class MockNgControl {}

@Component({
    template: `
        <mg-input [id]="'test-id'" [arrayValue]="arrayValue" [alignMode]="alignMode" [id]="id">
            <mg-input-label>Test Label</mg-input-label>
            <mg-input-checkbox></mg-input-checkbox>
            <mg-input-error>Error Message</mg-input-error>
            <mg-input-desc>Description</mg-input-desc>
        </mg-input>
    `,
    imports: [MagmaInput, MagmaInputElement, MagmaInputCheckbox],
})
class TestHostComponent {
    alignMode = '';
    arrayValue = true;
    id = '';
}

describe('MagmaInput', () => {
    let component: MagmaInput;
    let fixture: ComponentFixture<TestHostComponent>;
    let debugElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
            providers: [{ provide: NgControl, useClass: MockNgControl }],
        })
            .overrideComponent(MagmaInputCheckbox, {
                add: {
                    providers: [{ provide: MagmaInputCheckbox, useValue: MockMagmaInputCommon }],
                },
            })
            .compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        debugElement = fixture.debugElement.query(By.directive(MagmaInput));
        component = debugElement.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set id correctly', () => {
        expect(component._id()).toMatch(/mg-input-\d+/);
    });

    it('should set arrayValue correctly', () => {
        expect(component.arrayValue()).toBeTrue();
    });

    it('should set alignMode correctly', () => {
        fixture.componentInstance.alignMode = 'column';
        fixture.detectChanges();
        expect(component.alignMode()).toBe('column');
    });

    it('should compute _id based on id or uid', () => {
        expect(component._id()).toMatch(/mg-input-\d+/);
        fixture.componentInstance.id = 'test';
        fixture.detectChanges();
        expect(component._id()).toBe('test');
    });

    it('should call onChange on arrayValue change for checkbox', () => {
        const mockInputCommon = new MockMagmaInputCommon();
        (component as any)['inputs'] = signal([mockInputCommon]);

        component.ngOnChanges({
            arrayValue: { currentValue: true, previousValue: false, firstChange: false, isFirstChange: () => false },
        });
        expect(mockInputCommon.onChange).toHaveBeenCalledWith(true);
    });

    it('should set host for each input common in ngAfterContentChecked', () => {
        const mockInputCommon = new MockMagmaInputCommon();
        (component as any)['inputs'] = signal([mockInputCommon]);
        component.ngAfterContentChecked();
        expect(mockInputCommon.host).toBe(component);
    });

    it('should render label with forId', async () => {
        component.forId.set('test');
        fixture.detectChanges();
        const labelElement = debugElement.query(By.css('label'));
        expect(labelElement).toBeTruthy();
        expect(labelElement.nativeElement.getAttribute('for')).toBe('test');
    });

    it('should set align style based on alignMode', () => {
        fixture.componentInstance.alignMode = 'column';
        fixture.detectChanges();
        const contentElement = debugElement.query(By.css('.content'));
        expect(contentElement.nativeElement.style.getPropertyValue('--align')).toBe('column');
    });

    it('should display error message if _errorMessage is set', () => {
        component._errorMessage.set('Test Error');
        fixture.detectChanges();
        const errorElement = debugElement.query(By.css('.error'));
        expect(errorElement).toBeTruthy();
        expect(errorElement.nativeElement.textContent).toContain('Test Error');
    });

    it('should project mg-input-label content', () => {
        const labelContent = debugElement.query(By.css('mg-input-label'));
        expect(labelContent).toBeTruthy();
    });

    it('should project mg-input-checkbox content', () => {
        const checkboxContent = debugElement.query(By.css('mg-input-checkbox'));
        expect(checkboxContent).toBeTruthy();
    });
});
