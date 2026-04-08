import { Component, DebugElement, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { MagmaInputCheckbox } from './input-checkbox.component';
import { MagmaInput, MagmaInputReturnValue, MagmaInputTypeValue } from './input.component';
import { MockNgControl } from './test-helpers';

class MockMagmaInput {
    _id = vi.fn();
    _value: any = '';
    onChange = vi.fn();
    onTouched = vi.fn();
    update = { emit: vi.fn() };
    validate = vi.fn();
    ngControl = { control: { errors: null, touched: false } };
    cd = { detectChanges: vi.fn() };
    typeValue = vi.fn().mockReturnValue('default');
    returnValue = vi.fn().mockReturnValue('default');
    inputs = vi.fn().mockReturnValue([]);
    forId = signal<string | undefined>(undefined);
    _errorMessage = { set: vi.fn() };
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
        vi.useFakeTimers();
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

        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        vi.advanceTimersByTime(100);
        fixture?.destroy();
        vi.clearAllTimers();
        vi.useRealTimers();
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
        fixture.changeDetectorRef.detectChanges();
        const inputElement = debugElement.query(By.css('input[type="checkbox"]')).nativeElement;
        expect(inputElement.checked).toBe(true);
    });

    it('should not set checked attribute on input if testChecked is false', () => {
        component['testChecked'] = false;
        fixture.changeDetectorRef.detectChanges();
        const inputElement = debugElement.query(By.css('input[type="checkbox"]')).nativeElement;
        expect(inputElement.checked).toBe(false);
    });

    it('should update testChecked and call detectChanges on writeValue (value)', async () => {
        vi.spyOn(component['cd'], 'detectChanges');

        fixture.componentRef.setInput('value', 'test-value');
        component.writeValue('test-value');
        vi.advanceTimersByTime(0);

        expect(component['testChecked']).toBe(true);
        expect(component['cd'].detectChanges).toHaveBeenCalled();
    });

    it('should update testChecked and call detectChanges on writeValue (true)', async () => {
        vi.spyOn(component['cd'], 'detectChanges');

        component.writeValue(true);
        vi.advanceTimersByTime(0);

        expect(component['testChecked']).toBe(true);
        expect(component['cd'].detectChanges).toHaveBeenCalled();
    });

    it('should update testChecked and call detectChanges on writeValue (array)', async () => {
        vi.spyOn(component['cd'], 'detectChanges');
        (component.host as any).inputs = signal([component, component]);

        fixture.componentRef.setInput('value', 'test-value');
        component.writeValue(['test-value']);
        vi.advanceTimersByTime(0);

        expect(component['testChecked']).toBe(true);
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
        expect(component['testChecked']).toBe(true);
    });

    it('should toggle testChecked and call methods on _change', () => {
        vi.spyOn(component, 'onChange');
        vi.spyOn(component.update, 'emit');
        vi.spyOn(component.itemUpdate, 'emit');
        vi.spyOn(component, 'onTouched');
        vi.spyOn(component, 'validate');

        component['testChecked'] = false;
        component._change();

        expect(component['testChecked']).toBe(true);
        expect(component.onChange).toHaveBeenCalled();
        expect(component.update.emit).toHaveBeenCalled();
        expect(component.itemUpdate.emit).toHaveBeenCalled();
        expect(component.onTouched).toHaveBeenCalled();
        expect(component.validate).not.toHaveBeenCalled();
    });

    it('should toggle testChecked and call methods on _change', () => {
        vi.spyOn(component, 'onChange');
        vi.spyOn(component.update, 'emit');
        vi.spyOn(component.itemUpdate, 'emit');
        vi.spyOn(component, 'onTouched');
        vi.spyOn(component, 'validate');

        component.ngOnInit();
        component.ngControl = new MockNgControl() as unknown as NgControl;

        component['testChecked'] = false;
        component._change();

        expect(component['testChecked']).toBe(true);
        expect(component.onChange).toHaveBeenCalled();
        expect(component.update.emit).toHaveBeenCalled();
        expect(component.itemUpdate.emit).toHaveBeenCalled();
        expect(component.onTouched).toHaveBeenCalled();
        expect(component.validate).toHaveBeenCalledWith((component.ngControl as any)?.control);
    });

    it('should return correct value from getValue for single checkbox', () => {
        component['testChecked'] = true;
        expect(component.getValue()).toBe(true);
    });

    it('should return correct value from getValue for multiple checkboxes', () => {
        const mockCheckbox1 = { componentName: 'input-checkbox', testChecked: true, value: () => 'value1' };
        const mockCheckbox2 = { componentName: 'input-checkbox', testChecked: false, value: () => 'value2' };
        mockHost.inputs.mockReturnValue([mockCheckbox1, mockCheckbox2]);
        mockHost.typeValue.mockReturnValue('array');

        const result = component.getValue();
        expect(result).toEqual(['value1']);
    });

    it('should display Error if onError is true', () => {
        component['onError'].set(true);
        fixture.changeDetectorRef.detectChanges();
        const errorText = fixture.nativeElement.textContent;
        expect(errorText).toContain('Error');
    });

    it('should disable input if disabled is true', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.changeDetectorRef.detectChanges();
        const inputElement = debugElement.query(By.css('input[type="checkbox"]')).nativeElement;
        expect(inputElement.disabled).toBe(true);
    });

    it('should set input to readonly if readonly is true', () => {
        fixture.componentRef.setInput('readonly', true);
        fixture.changeDetectorRef.detectChanges();
        const inputElement = debugElement.query(By.css('input[type="checkbox"]')).nativeElement;
        expect(inputElement.readOnly).toBe(true);
    });

    it('should add toggle-switch class if mode is toggle', () => {
        fixture.componentRef.setInput('mode', 'toggle');
        fixture.changeDetectorRef.detectChanges();
        const hostElement = debugElement.nativeElement;
        expect(hostElement.classList.contains('toggle-switch')).toBe(true);
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
            vi.spyOn(component['cd'], 'detectChanges');
            mockHost.forId.set('different-id');
            (component.host as any).inputs = signal([component, component]);
            mockLabelRef.nativeElement.innerHTML = '';

            component.ngDoCheck();

            expect(mockHost.forId()).toBe(undefined);
            expect(component.host?.cd.detectChanges).toHaveBeenCalled();
        });

        it('should not call setHostLabelId if label has content', () => {
            vi.spyOn(component['cd'], 'detectChanges');
            mockHost.forId.set('different-id');
            (component.host as any).inputs = signal([component]);
            mockLabelRef.nativeElement.innerHTML = 'Some content';

            component.ngDoCheck();

            expect(mockHost.forId()).toBe(undefined);
            expect(component.host?.cd.detectChanges).toHaveBeenCalled();
        });

        it('should set host forId to undefined for multiple checkboxes with label content', () => {
            vi.spyOn(component['cd'], 'detectChanges');
            mockHost.forId.set('some-id');
            (component.host as any).inputs = signal([component, component]);
            mockLabelRef.nativeElement.innerHTML = 'Some content';

            component.ngDoCheck();

            // When there are multiple checkboxes OR label has content, forId should be set to undefined
            expect(mockHost.forId()).toBe(undefined);
            expect(component.host?.cd.detectChanges).toHaveBeenCalled();
        });

        it('should set host forId to undefined for single checkbox with label content', () => {
            vi.spyOn(component['cd'], 'detectChanges');
            mockHost.forId.set('some-id');
            (component.host as any).inputs = signal([component]);
            mockLabelRef.nativeElement.innerHTML = 'Some content';

            component.ngDoCheck();

            // When label has content, forId should be set to undefined
            expect(mockHost.forId()).toBe(undefined);
            expect(component.host?.cd.detectChanges).toHaveBeenCalled();
        });

        it('should not modify host forId if no conditions are met', () => {
            vi.spyOn(component['cd'], 'detectChanges');
            mockHost.forId.set(undefined);
            (component.host as any).inputs = signal([component]);
            mockLabelRef.nativeElement.innerHTML = '';

            component.ngDoCheck();

            // Single checkbox without label content should set forId to component id
            expect(mockHost.forId()).toBe(`${component._id()}-input`);
            expect(component.host?.cd.detectChanges).toHaveBeenCalled();
        });
    });
});

@Component({
    template: `
        <mg-input [returnValue]="returnValue">
            <mg-input-checkbox value="option1" name="test-group" />
            <mg-input-checkbox value="option2" name="test-group" />
            <mg-input-checkbox value="option3" name="test-group" />
        </mg-input>
    `,
    imports: [MagmaInput, MagmaInputCheckbox],
})
class TestHostComponent {
    returnValue = 'default' as MagmaInputReturnValue;
}

describe('MagmaInput with multiple MagmaInputCheckbox', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let debugElement: DebugElement;
    let checkboxComponents: MagmaInputCheckbox[];

    beforeEach(async () => {
        vi.useFakeTimers();
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
            providers: [
                { provide: NG_VALUE_ACCESSOR, useExisting: MagmaInputCheckbox, multi: true },
                { provide: NG_VALIDATORS, useExisting: MagmaInputCheckbox, multi: true },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        debugElement = fixture.debugElement;
        fixture.changeDetectorRef.detectChanges();

        checkboxComponents = debugElement
            .queryAll(By.directive(MagmaInputCheckbox))
            .map(de => de.componentInstance as MagmaInputCheckbox);
    });

    afterEach(() => {
        vi.advanceTimersByTime(100);
        fixture?.destroy();
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it('should create the host component with checkboxes', () => {
        expect(fixture.componentInstance).toBeTruthy();
        expect(checkboxComponents.length).toBe(3);
    });

    describe('Default', () => {
        it('should update host value when a checkbox is checked', () => {
            checkboxComponents[0]._change();

            fixture.changeDetectorRef.detectChanges();

            expect(checkboxComponents[0]['testChecked']).toBe(true);
            expect(checkboxComponents[1]['testChecked']).toBeUndefined();
            expect(checkboxComponents[2]['testChecked']).toBeUndefined();

            expect(checkboxComponents[0].getValue()).toEqual(['option1']);
            expect(checkboxComponents[1].getValue()).toEqual(['option1']);
            expect(checkboxComponents[2].getValue()).toEqual(['option1']);
        });

        it('should update host value when multiple checkboxes are checked', () => {
            checkboxComponents[0]._change();
            checkboxComponents[1]._change();

            expect(checkboxComponents[0]['testChecked']).toBe(true);
            expect(checkboxComponents[1]['testChecked']).toBe(true);
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
            expect(checkboxComponents[0]['testChecked']).toBe(false);
            expect(checkboxComponents[1]['testChecked']).toBe(true);
            expect(checkboxComponents[2]['testChecked']).toBe(true);

            expect(checkboxComponents[0].getValue()).toEqual(['option2', 'option3']);
            expect(checkboxComponents[1].getValue()).toEqual(['option2', 'option3']);
            expect(checkboxComponents[2].getValue()).toEqual(['option2', 'option3']);
        });

        it('should update checkbox state when host value changes', async () => {
            checkboxComponents[0].writeValue(['option1', 'option3']);
            fixture.changeDetectorRef.detectChanges();
            vi.advanceTimersByTime(0);

            expect(checkboxComponents[0]['testChecked']).toBe(true);
            expect(checkboxComponents[1]['testChecked']).toBeUndefined();
            expect(checkboxComponents[2]['testChecked']).toBe(true);

            expect(checkboxComponents[0].getValue()).toEqual(['option1', 'option3']);
            expect(checkboxComponents[1].getValue()).toEqual(['option1', 'option3']);
            expect(checkboxComponents[2].getValue()).toEqual(['option1', 'option3']);
        });

        it('should update checkbox state when host value changes 2 times', async () => {
            checkboxComponents[0].writeValue(['option1', 'option3']);
            fixture.changeDetectorRef.detectChanges();
            checkboxComponents[0].writeValue(['option2']);
            fixture.changeDetectorRef.detectChanges();
            vi.advanceTimersByTime(0);

            expect(checkboxComponents[0]['testChecked']).toBe(false);
            expect(checkboxComponents[1]['testChecked']).toBe(true);
            expect(checkboxComponents[2]['testChecked']).toBe(false);

            expect(checkboxComponents[0].getValue()).toEqual(['option2']);
            expect(checkboxComponents[1].getValue()).toEqual(['option2']);
            expect(checkboxComponents[2].getValue()).toEqual(['option2']);
        });

        it('should emit update event when checkbox state changes', () => {
            vi.spyOn(checkboxComponents[0].update, 'emit');

            checkboxComponents[0]._change();

            expect(checkboxComponents[0].update.emit).toHaveBeenCalledWith(['option1']);
        });
    });

    describe('Boolean', () => {
        beforeEach(() => {
            fixture.componentInstance.returnValue = 'boolean';
            fixture.changeDetectorRef.detectChanges();
        });

        it('should update host value when a checkbox is checked', () => {
            checkboxComponents[0]._change();

            fixture.changeDetectorRef.detectChanges();

            expect(checkboxComponents[0]['testChecked']).toBe(true);
            expect(checkboxComponents[1]['testChecked']).toBeUndefined();
            expect(checkboxComponents[2]['testChecked']).toBeUndefined();

            expect(checkboxComponents[0].getValue()).toEqual([true, false, false]);
            expect(checkboxComponents[1].getValue()).toEqual([true, false, false]);
            expect(checkboxComponents[2].getValue()).toEqual([true, false, false]);
        });

        it('should update host value when multiple checkboxes are checked', () => {
            checkboxComponents[0]._change();
            checkboxComponents[1]._change();

            fixture.changeDetectorRef.detectChanges();

            expect(checkboxComponents[0]['testChecked']).toBe(true);
            expect(checkboxComponents[1]['testChecked']).toBe(true);
            expect(checkboxComponents[2]['testChecked']).toBeUndefined();

            expect(checkboxComponents[0].getValue()).toEqual([true, true, false]);
            expect(checkboxComponents[1].getValue()).toEqual([true, true, false]);
            expect(checkboxComponents[2].getValue()).toEqual([true, true, false]);
        });

        it('should remove value from host when a checkbox is unchecked', () => {
            // Check all checkboxes first
            checkboxComponents.forEach(checkbox => checkbox._change());
            fixture.changeDetectorRef.detectChanges();

            expect(checkboxComponents[0].getValue()).toEqual([true, true, true]);
            expect(checkboxComponents[1].getValue()).toEqual([true, true, true]);
            expect(checkboxComponents[2].getValue()).toEqual([true, true, true]);

            // Uncheck the first checkbox
            checkboxComponents[0]._change();
            fixture.changeDetectorRef.detectChanges();

            expect(checkboxComponents[0]['testChecked']).toBe(false);
            expect(checkboxComponents[1]['testChecked']).toBe(true);
            expect(checkboxComponents[2]['testChecked']).toBe(true);

            expect(checkboxComponents[0].getValue()).toEqual([false, true, true]);
            expect(checkboxComponents[1].getValue()).toEqual([false, true, true]);
            expect(checkboxComponents[2].getValue()).toEqual([false, true, true]);
        });

        it('should update checkbox state when host value changes', async () => {
            checkboxComponents[0].writeValue([true, false, true]);
            fixture.changeDetectorRef.detectChanges();
            vi.advanceTimersByTime(0);

            expect(checkboxComponents[0]['testChecked']).toBe(true);
            expect(checkboxComponents[1]['testChecked']).toBeFalsy();
            expect(checkboxComponents[2]['testChecked']).toBe(true);

            expect(checkboxComponents[0].getValue()).toEqual([true, false, true]);
            expect(checkboxComponents[1].getValue()).toEqual([true, false, true]);
            expect(checkboxComponents[2].getValue()).toEqual([true, false, true]);
        });

        it('should update checkbox state when host value changes 2 times', async () => {
            checkboxComponents[0].writeValue([true, false, true]);
            fixture.changeDetectorRef.detectChanges();
            checkboxComponents[0].writeValue([false, true, false]);
            fixture.changeDetectorRef.detectChanges();
            vi.advanceTimersByTime(0);

            expect(checkboxComponents[0]['testChecked']).toBe(false);
            expect(checkboxComponents[1]['testChecked']).toBe(true);
            expect(checkboxComponents[2]['testChecked']).toBe(false);

            expect(checkboxComponents[0].getValue()).toEqual([false, true, false]);
            expect(checkboxComponents[1].getValue()).toEqual([false, true, false]);
            expect(checkboxComponents[2].getValue()).toEqual([false, true, false]);
        });

        it('should emit update event when checkbox state changes', () => {
            vi.spyOn(checkboxComponents[0].update, 'emit');

            checkboxComponents[0]._change();

            expect(checkboxComponents[0].update.emit).toHaveBeenCalledWith([true, false, false]);
        });
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
        <mg-input [returnValue]="returnValue" [typeValue]="typeValue">
            <mg-input-checkbox value="option1" name="test-group" />
        </mg-input>
    `,
    imports: [MagmaInput, MagmaInputCheckbox],
})
class TestHostComponentSimple {
    returnValue = 'default' as MagmaInputReturnValue;
    typeValue = 'default' as MagmaInputTypeValue;
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
        fixture.changeDetectorRef.detectChanges();

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

        fixture.changeDetectorRef.detectChanges();

        expect(checkboxComponents[0]['testChecked']).toBe(true);
        expect(checkboxComponents[0].getValue()).toEqual(true);
    });

    it('should emit update event when checkbox state changes with typeValue is "array"', () => {
        fixture.componentInstance.typeValue = 'array';
        fixture.changeDetectorRef.detectChanges();

        vi.spyOn(checkboxComponents[0].update, 'emit');

        checkboxComponents[0]._change();

        expect(checkboxComponents[0]['testChecked']).toBe(true);
        expect(checkboxComponents[0].update.emit).toHaveBeenCalledWith(['option1']);
    });

    it('should update host value when a checkbox is checked with typeValue is "array"', () => {
        fixture.componentInstance.typeValue = 'array';
        fixture.changeDetectorRef.detectChanges();

        checkboxComponents[0]._change();

        fixture.changeDetectorRef.detectChanges();

        expect(checkboxComponents[0]['testChecked']).toBe(true);
        expect(checkboxComponents[0].getValue()).toEqual(['option1']);
    });

    it('should getValue with returnValue is "boolean"', () => {
        fixture.componentInstance.returnValue = 'boolean';
        fixture.changeDetectorRef.detectChanges();

        checkboxComponents[0]._change();

        fixture.changeDetectorRef.detectChanges();

        expect(checkboxComponents[0]['testChecked']).toBe(true);
        expect(checkboxComponents[0].getValue()).toEqual(true);

        checkboxComponents[0]._change();

        fixture.changeDetectorRef.detectChanges();

        expect(checkboxComponents[0]['testChecked']).toBe(false);
        expect(checkboxComponents[0].getValue()).toEqual(false);
    });

    it('should getValue with returnValue is "value"', () => {
        fixture.componentInstance.returnValue = 'value';
        fixture.changeDetectorRef.detectChanges();

        checkboxComponents[0]._change();

        fixture.changeDetectorRef.detectChanges();

        expect(checkboxComponents[0]['testChecked']).toBe(true);
        expect(checkboxComponents[0].getValue()).toEqual('option1');

        checkboxComponents[0]._change();

        fixture.changeDetectorRef.detectChanges();

        expect(checkboxComponents[0]['testChecked']).toBe(false);
        expect(checkboxComponents[0].getValue()).toEqual(null);
    });

    it('should getValue with returnValue is "boolean" and not check', () => {
        fixture.componentInstance.returnValue = 'boolean';

        fixture.changeDetectorRef.detectChanges();

        expect(checkboxComponents[0]['testChecked']).toBeUndefined();
        expect(checkboxComponents[0].getValue()).toBe(false);

        checkboxComponents[0]._change();
        checkboxComponents[0]._change();

        fixture.changeDetectorRef.detectChanges();

        expect(checkboxComponents[0]['testChecked']).toBe(false);
        expect(checkboxComponents[0].getValue()).toBe(false);
    });

    it('should emit update event when checkbox state changes', () => {
        vi.spyOn(checkboxComponents[0].update, 'emit');

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
