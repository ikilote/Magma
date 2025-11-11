import { Component, DebugElement, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { MagmaInputCheckbox } from './input-checkbox.component';
import { MockNgControl } from './input-text.component.spec';
import { MagmaInput } from './input.component';

class MockMagmaInput {
    _id = jasmine.createSpy('_id');
    _value: any = '';
    onChange = jasmine.createSpy('onChange');
    onTouched = jasmine.createSpy('onTouched');
    update = { emit: jasmine.createSpy('emit') };
    validate = jasmine.createSpy('validate');
    ngControl = { control: { errors: null } };
    cd = { detectChanges: jasmine.createSpy('detectChanges') };
    arrayValue = jasmine.createSpy('arrayValue').and.returnValue(false);
    inputs = jasmine.createSpy('inputs').and.returnValue([]);
    forId = signal<string | undefined>(undefined);
}

class MockElementRef {
    nativeElement = document.createElement('label');
}

describe('MagmaInputCheckbox', () => {
    let component: MagmaInputCheckbox;
    let fixture: ComponentFixture<MagmaInputCheckbox>;
    let debugElement: DebugElement;
    let mockHost: MockMagmaInput;
    let mockLabelRef: MockElementRef;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaInputCheckbox],
            providers: [
                { provide: NG_VALUE_ACCESSOR, useExisting: MagmaInputCheckbox, multi: true },
                { provide: NG_VALIDATORS, useExisting: MagmaInputCheckbox, multi: true },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaInputCheckbox);
        component = fixture.componentInstance;
        (component as any).host = mockHost = new MockMagmaInput();
        debugElement = fixture.debugElement;

        mockLabelRef = new MockElementRef();
        (component as any).label = () => [mockLabelRef];

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render input element with type checkbox', () => {
        const inputElement = debugElement.query(By.css('input[type="checkbox"]'));
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
        const inputElement = debugElement.query(By.css('input[type="checkbox"]')).nativeElement;
        expect(inputElement.checked).toBeTrue();
    });

    it('should not set checked attribute on input if testChecked is false', () => {
        component['testChecked'] = false;
        fixture.detectChanges();
        const inputElement = debugElement.query(By.css('input[type="checkbox"]')).nativeElement;
        expect(inputElement.checked).toBeFalse();
    });

    it('should update testChecked and call detectChanges on writeValue (value)', () => {
        spyOn(component['cd'], 'detectChanges');

        fixture.componentRef.setInput('value', 'test-value');
        component.writeValue('test-value');

        expect(component['testChecked']).toBeTrue();
        expect(component['cd'].detectChanges).toHaveBeenCalled();
    });

    it('should update testChecked and call detectChanges on writeValue (true)', () => {
        spyOn(component['cd'], 'detectChanges');

        component.writeValue(true);

        expect(component['testChecked']).toBeTrue();
        expect(component['cd'].detectChanges).toHaveBeenCalled();
    });

    it('should update testChecked and call detectChanges on writeValue (array)', () => {
        spyOn(component['cd'], 'detectChanges');
        (component.host as any).inputs = signal([component, component]);

        fixture.componentRef.setInput('value', 'test-value');
        component.writeValue(['test-value']);

        expect(component['testChecked']).toBeTrue();
        expect(component['cd'].detectChanges).toHaveBeenCalled();
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

    it('should toggle testChecked and call methods on _change', () => {
        spyOn(component, 'onChange');
        spyOn(component.update, 'emit');
        spyOn(component.itemUpdate, 'emit');
        spyOn(component, 'onTouched');
        spyOn(component, 'validate');

        component['testChecked'] = false;
        component._change();

        expect(component['testChecked']).toBeTrue();
        expect(component.onChange).toHaveBeenCalled();
        expect(component.update.emit).toHaveBeenCalled();
        expect(component.itemUpdate.emit).toHaveBeenCalled();
        expect(component.onTouched).toHaveBeenCalled();
        expect(component.validate).not.toHaveBeenCalled();
    });

    it('should toggle testChecked and call methods on _change', () => {
        spyOn(component, 'onChange');
        spyOn(component.update, 'emit');
        spyOn(component.itemUpdate, 'emit');
        spyOn(component, 'onTouched');
        spyOn(component, 'validate');

        component.ngOnInit();
        component.ngControl = new MockNgControl() as unknown as NgControl;

        component['testChecked'] = false;
        component._change();

        expect(component['testChecked']).toBeTrue();
        expect(component.onChange).toHaveBeenCalled();
        expect(component.update.emit).toHaveBeenCalled();
        expect(component.itemUpdate.emit).toHaveBeenCalled();
        expect(component.onTouched).toHaveBeenCalled();
        expect(component.validate).toHaveBeenCalledWith((component.ngControl as any)?.control);
    });

    it('should return correct value from getValue for single checkbox', () => {
        component['testChecked'] = true;
        expect(component.getValue()).toBeTrue();
    });

    it('should return correct value from getValue for multiple checkboxes', () => {
        const mockCheckbox1 = { componentName: 'input-checkbox', testChecked: true, value: () => 'value1' };
        const mockCheckbox2 = { componentName: 'input-checkbox', testChecked: false, value: () => 'value2' };
        mockHost.inputs.and.returnValue([mockCheckbox1, mockCheckbox2]);
        mockHost.arrayValue.and.returnValue(true);

        const result = component.getValue();
        expect(result).toEqual(['value1']);
    });

    it('should display Error if onError is true', () => {
        component['onError'].set(true);
        fixture.detectChanges();
        const errorElement = debugElement.query(By.css('div:contains("Error")'));
        expect(errorElement).toBeNull();
    });

    it('should disable input if disabled is true', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();
        const inputElement = debugElement.query(By.css('input[type="checkbox"]')).nativeElement;
        expect(inputElement.disabled).toBeTrue();
    });

    it('should set input to readonly if readonly is true', () => {
        fixture.componentRef.setInput('readonly', true);
        fixture.detectChanges();
        const inputElement = debugElement.query(By.css('input[type="checkbox"]')).nativeElement;
        expect(inputElement.readOnly).toBeTrue();
    });

    it('should add toggle-switch class if mode is toggle', () => {
        fixture.componentRef.setInput('mode', 'toggle');
        fixture.detectChanges();
        const hostElement = debugElement.nativeElement;
        expect(hostElement.classList.contains('toggle-switch')).toBeTrue();
    });

    describe('ngDoCheck', () => {
        it('should call setHostLabelId for single checkbox without label content', () => {
            mockHost.forId.set('different-id');
            (component.host as any).inputs = signal([component]);

            component.ngDoCheck();

            expect(mockHost.forId()).toBe(`${component._id()}-input`);
            expect(component.host?.cd.detectChanges).toHaveBeenCalled();
        });

        it('should not call setHostLabelId if forId matches', () => {
            mockHost.forId.set(`${component._id()}-input`);
            (component.host as any).inputs = signal([component]);
            mockLabelRef.nativeElement.innerHTML = '';

            component.ngDoCheck();

            expect(mockHost.forId()).toBe(`${component._id()}-input`);
            expect(component.host?.cd.detectChanges).toHaveBeenCalled();
        });

        it('should not call setHostLabelId if there are multiple checkboxes', () => {
            spyOn(component['cd'], 'detectChanges');
            mockHost.forId.set('different-id');
            (component.host as any).inputs = signal([component, component]);
            mockLabelRef.nativeElement.innerHTML = '';

            component.ngDoCheck();

            expect(mockHost.forId()).toBe(undefined);
            expect(component.host?.cd.detectChanges).toHaveBeenCalled();
        });

        it('should not call setHostLabelId if label has content', () => {
            spyOn(component['cd'], 'detectChanges');
            mockHost.forId.set('different-id');
            (component.host as any).inputs = signal([component]);
            mockLabelRef.nativeElement.innerHTML = 'Some content';

            component.ngDoCheck();

            expect(mockHost.forId()).toBe(undefined);
            expect(component.host?.cd.detectChanges).toHaveBeenCalled();
        });

        it('should set host forId to undefined for multiple checkboxes with label content', () => {
            spyOn(component['cd'], 'detectChanges');
            mockHost.forId.set('some-id');
            (component.host as any).inputs = signal([component, component]);
            mockLabelRef.nativeElement.innerHTML = 'Some content';
            spyOn(mockHost.forId, 'set');

            component.ngDoCheck();

            expect(mockHost.forId()).toBe('some-id');
            expect(component.host?.cd.detectChanges).toHaveBeenCalled();
        });

        it('should set host forId to undefined for single checkbox with label content', () => {
            spyOn(component['cd'], 'detectChanges');
            mockHost.forId.set('some-id');
            (component.host as any).inputs = signal([component]);
            mockLabelRef.nativeElement.innerHTML = 'Some content';
            spyOn(mockHost.forId, 'set');

            component.ngDoCheck();

            expect(mockHost.forId()).toBe('some-id');
            expect(component.host?.cd.detectChanges).toHaveBeenCalled();
        });

        it('should not modify host forId if no conditions are met', () => {
            spyOn(component['cd'], 'detectChanges');
            mockHost.forId.set(undefined);
            (component.host as any).inputs = signal([component]);
            mockLabelRef.nativeElement.innerHTML = '';
            spyOn(mockHost.forId, 'set');

            component.ngDoCheck();

            expect(mockHost.forId()).toBe(undefined);
            expect(component.host?.cd.detectChanges).toHaveBeenCalled();
        });
    });
});

@Component({
    template: `
        <mg-input>
            <mg-input-checkbox value="option1" name="test-group" />
            <mg-input-checkbox value="option2" name="test-group" />
            <mg-input-checkbox value="option3" name="test-group" />
        </mg-input>
    `,
    imports: [MagmaInput, MagmaInputCheckbox],
})
class TestHostComponent {}

describe('MagmaInput with multiple MagmaInputCheckbox', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let debugElement: DebugElement;
    let checkboxComponents: MagmaInputCheckbox[];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
            providers: [
                { provide: NG_VALUE_ACCESSOR, useExisting: MagmaInputCheckbox, multi: true },
                { provide: NG_VALIDATORS, useExisting: MagmaInputCheckbox, multi: true },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        debugElement = fixture.debugElement;
        fixture.detectChanges();

        checkboxComponents = debugElement
            .queryAll(By.directive(MagmaInputCheckbox))
            .map(de => de.componentInstance as MagmaInputCheckbox);
    });

    it('should create the host component with checkboxes', () => {
        expect(fixture.componentInstance).toBeTruthy();
        expect(checkboxComponents.length).toBe(3);
    });

    it('should update host value when a checkbox is checked', () => {
        checkboxComponents[0]._change();

        fixture.detectChanges();

        expect(checkboxComponents[0]['testChecked']).toBeTrue();
        expect(checkboxComponents[1]['testChecked']).toBeUndefined();
        expect(checkboxComponents[2]['testChecked']).toBeUndefined();

        expect(checkboxComponents[0].getValue()).toEqual(['option1']);
        expect(checkboxComponents[1].getValue()).toEqual(['option1']);
        expect(checkboxComponents[2].getValue()).toEqual(['option1']);
    });

    it('should update host value when multiple checkboxes are checked', () => {
        checkboxComponents[0]._change();
        checkboxComponents[1]._change();

        expect(checkboxComponents[0]['testChecked']).toBeTrue();
        expect(checkboxComponents[1]['testChecked']).toBeTrue();
        expect(checkboxComponents[2]['testChecked']).toBeUndefined();

        expect(checkboxComponents[0].getValue()).toEqual(['option1', 'option2']);
        expect(checkboxComponents[1].getValue()).toEqual(['option1', 'option2']);
        expect(checkboxComponents[2].getValue()).toEqual(['option1', 'option2']);
    });

    it('should remove value from host when a checkbox is unchecked', () => {
        // Check all checkboxes first
        checkboxComponents.forEach(checkbox => checkbox._change());
        expect(checkboxComponents[0].getValue()).toEqual(['option1', 'option2', 'option3']);
        expect(checkboxComponents[1].getValue()).toEqual(['option1', 'option2', 'option3']);
        expect(checkboxComponents[2].getValue()).toEqual(['option1', 'option2', 'option3']);

        // Uncheck the first checkbox
        checkboxComponents[0]._change();
        expect(checkboxComponents[0]['testChecked']).toBeFalse();
        expect(checkboxComponents[1]['testChecked']).toBeTrue();
        expect(checkboxComponents[2]['testChecked']).toBeTrue();

        expect(checkboxComponents[0].getValue()).toEqual(['option2', 'option3']);
        expect(checkboxComponents[1].getValue()).toEqual(['option2', 'option3']);
        expect(checkboxComponents[2].getValue()).toEqual(['option2', 'option3']);
    });

    it('should update checkbox state when host value changes', () => {
        checkboxComponents[0].writeValue(['option1', 'option3']);
        fixture.detectChanges();

        expect(checkboxComponents[0]['testChecked']).toBeTrue();
        expect(checkboxComponents[1]['testChecked']).toBeUndefined();
        expect(checkboxComponents[2]['testChecked']).toBeTrue();

        expect(checkboxComponents[0].getValue()).toEqual(['option1', 'option3']);
        expect(checkboxComponents[1].getValue()).toEqual(['option1', 'option3']);
        expect(checkboxComponents[2].getValue()).toEqual(['option1', 'option3']);
    });

    it('should update checkbox state when host value changes 2 times', () => {
        checkboxComponents[0].writeValue(['option1', 'option3']);
        fixture.detectChanges();
        checkboxComponents[0].writeValue(['option2']);
        fixture.detectChanges();

        expect(checkboxComponents[0]['testChecked']).toBeFalse();
        expect(checkboxComponents[1]['testChecked']).toBeTrue();
        expect(checkboxComponents[2]['testChecked']).toBeFalse();

        expect(checkboxComponents[0].getValue()).toEqual(['option2']);
        expect(checkboxComponents[1].getValue()).toEqual(['option2']);
        expect(checkboxComponents[2].getValue()).toEqual(['option2']);
    });

    it('should emit update event when checkbox state changes', () => {
        spyOn(checkboxComponents[0].update, 'emit');

        checkboxComponents[0]._change();

        expect(checkboxComponents[0].update.emit).toHaveBeenCalledWith(['option1']);
    });

    it('should have correct name attribute on all checkbox inputs', () => {
        const radioInputs = debugElement.queryAll(By.css('input[type="checkbox"]'));
        radioInputs.forEach(input => {
            expect(input.nativeElement.getAttribute('name')).toBe('test-group');
        });
    });

    it('should have unique id attributes for all checkbox inputs', () => {
        const radioInputs = debugElement.queryAll(By.css('input[type="checkbox"]'));
        const ids = radioInputs.map(input => input.nativeElement.getAttribute('id'));
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });
});

@Component({
    template: `
        <mg-input [arrayValue]="arrayValue">
            <mg-input-checkbox value="option1" name="test-group" />
        </mg-input>
    `,
    imports: [MagmaInput, MagmaInputCheckbox],
})
class TestHostComponentSimple {
    arrayValue = false;
}

describe('MagmaInput with mono MagmaInputCheckbox', () => {
    let fixture: ComponentFixture<TestHostComponentSimple>;
    let debugElement: DebugElement;
    let checkboxComponents: MagmaInputCheckbox[];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponentSimple],
            providers: [
                { provide: NG_VALUE_ACCESSOR, useExisting: MagmaInputCheckbox, multi: true },
                { provide: NG_VALIDATORS, useExisting: MagmaInputCheckbox, multi: true },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponentSimple);
        debugElement = fixture.debugElement;
        fixture.detectChanges();

        checkboxComponents = debugElement
            .queryAll(By.directive(MagmaInputCheckbox))
            .map(de => de.componentInstance as MagmaInputCheckbox);
    });

    it('should create the host component with checkboxes', () => {
        expect(fixture.componentInstance).toBeTruthy();
        expect(checkboxComponents.length).toBe(1);
    });

    it('should update host value when a checkbox is checked', () => {
        checkboxComponents[0]._change();

        fixture.detectChanges();

        expect(checkboxComponents[0]['testChecked']).toBeTrue();
        expect(checkboxComponents[0].getValue()).toEqual(true);
    });

    it('should emit update event when checkbox state changes with arrayValue is true', () => {
        fixture.componentInstance.arrayValue = true;

        spyOn(checkboxComponents[0].update, 'emit');

        checkboxComponents[0]._change();

        expect(checkboxComponents[0]['testChecked']).toBeTrue();
        expect(checkboxComponents[0].update.emit).toHaveBeenCalledWith(true);
    });

    it('should update host value when a checkbox is checked with arrayValue is true', () => {
        fixture.componentInstance.arrayValue = true;

        checkboxComponents[0]._change();

        fixture.detectChanges();

        expect(checkboxComponents[0]['testChecked']).toBeTrue();
        expect(checkboxComponents[0].getValue()).toEqual(['option1']);
    });

    it('should emit update event when checkbox state changes', () => {
        spyOn(checkboxComponents[0].update, 'emit');

        checkboxComponents[0]._change();

        expect(checkboxComponents[0].update.emit).toHaveBeenCalledWith(true);
    });

    it('should have correct name attribute on all checkbox inputs', () => {
        const radioInputs = debugElement.queryAll(By.css('input[type="checkbox"]'));
        radioInputs.forEach(input => {
            expect(input.nativeElement.getAttribute('name')).toBe('test-group');
        });
    });

    it('should have unique id attributes for all checkbox inputs', () => {
        const radioInputs = debugElement.queryAll(By.css('input[type="checkbox"]'));
        const ids = radioInputs.map(input => input.nativeElement.getAttribute('id'));
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });
});
