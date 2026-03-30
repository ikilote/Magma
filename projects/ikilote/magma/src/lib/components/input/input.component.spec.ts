import { Component, DebugElement, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { MagmaInputCheckbox } from './input-checkbox.component';
import { MagmaInputElement } from './input-element.component';
import { MagmaInput, MagmaInputAlignMode, MagmaInputReturnValue, MagmaInputTypeValue } from './input.component';

@Component({ selector: 'mg-input-checkbox', template: '' })
class MockMagmaInputCommon {
    host: MagmaInput | null = null;
    refreshTrigger = signal(undefined);
    componentName = 'input-checkbox';
    getValue = vi.fn().mockReturnValue(true);
    onChange = vi.fn();
}

class MockNgControl {}

@Component({
    template: `
        <mg-input
            [id]="'test-id'"
            [typeValue]="typeValue"
            [returnValue]="returnValue"
            [alignMode]="alignMode"
            [id]="id"
        >
            <mg-input-label>Test Label</mg-input-label>
            <mg-input-checkbox></mg-input-checkbox>
            <mg-input-error>Error Message</mg-input-error>
            <mg-input-desc>Description</mg-input-desc>
        </mg-input>
    `,
    imports: [MagmaInput, MagmaInputElement, MagmaInputCheckbox],
})
class TestHostComponent {
    alignMode = '' as unknown as MagmaInputAlignMode;
    typeValue = 'default' as MagmaInputTypeValue;
    returnValue = 'default' as MagmaInputReturnValue;
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
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(async () => {
        fixture?.destroy();
        vi.clearAllTimers();
        vi.useRealTimers();
        TestBed.resetTestingModule();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set id correctly', () => {
        expect(component._id()).toMatch(/mg-input-\d+/);
    });

    it('should set alignMode correctly', () => {
        fixture.componentInstance.alignMode = 'column';
        fixture.changeDetectorRef.detectChanges();
        expect(component.alignMode()).toBe('column');
    });

    it('should compute _id based on id or uid', () => {
        expect(component._id()).toMatch(/mg-input-\d+/);
        fixture.componentInstance.id = 'test';
        fixture.changeDetectorRef.detectChanges();
        expect(component._id()).toBe('test');
    });

    it('should call onChange on typeValue change for checkbox', () => {
        const mockInputCommon = new MockMagmaInputCommon();
        (component as any)['inputs'] = signal([mockInputCommon]);

        component.ngOnChanges({
            typeValue: { currentValue: true, previousValue: false, firstChange: false, isFirstChange: () => false },
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
        fixture.changeDetectorRef.detectChanges();
        const labelElement = debugElement.query(By.css('label'));
        expect(labelElement).toBeTruthy();
        expect(labelElement.nativeElement.getAttribute('for')).toBe('test');
    });

    it('should set align style not based on alignMode', () => {
        fixture.changeDetectorRef.detectChanges();
        const contentElement = debugElement.query(By.css('.content'));
        expect(contentElement.nativeElement.classList).toContain('row');

        fixture.componentInstance.alignMode = 'row';
        fixture.changeDetectorRef.detectChanges();
        expect(contentElement.nativeElement.classList).toContain('row');
    });

    it('should set align style based on alignMode', () => {
        fixture.componentInstance.alignMode = 'column';
        fixture.changeDetectorRef.detectChanges();
        const contentElement = debugElement.query(By.css('.content'));
        expect(contentElement.nativeElement.classList).toContain('column');
    });

    it('should display error message if _errorMessage is set', () => {
        component._errorMessage.set('Test Error');
        fixture.changeDetectorRef.detectChanges();
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
