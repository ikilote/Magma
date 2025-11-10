import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

import { Select2UpdateEvent } from 'ng-select2-component';

import { MagmaInputSelect } from './input-select.component';
import { MockNgControl } from './input-text.component.spec';

describe('MagmaInputSelect', () => {
    let component: MagmaInputSelect;
    let fixture: ComponentFixture<MagmaInputSelect>;
    let debugElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaInputSelect],
            providers: [
                { provide: NG_VALUE_ACCESSOR, useExisting: MagmaInputSelect, multi: true },
                { provide: NG_VALIDATORS, useExisting: MagmaInputSelect, multi: true },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaInputSelect);
        fixture.componentRef.setInput('data', [{ id: '1', text: 'Option 1' }]); // required

        component = fixture.componentInstance;

        debugElement = fixture.debugElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Input properties', () => {
        const inputTests = [
            { name: 'data', value: [{ id: '1', text: 'Option 1' }] },
            { name: 'minCharForSearch', value: 3 },
            { name: 'multiple', value: true },
            { name: 'styleMode', value: 'material' },
            { name: 'listPosition', value: 'above' },
            { name: 'overlay', value: true },
            { name: 'multipleDrag', value: true },
            { name: 'noResultMessage', value: 'No results found' },
            { name: 'maxResults', value: 10 },
            { name: 'maxResultsMessage', value: 'Too many results' },
            { name: 'infiniteScrollDistance', value: 1.5 },
            { name: 'infiniteScrollThrottle', value: 150 },
            { name: 'infiniteScroll', value: true },
            { name: 'autoCreate', value: true },
            { name: 'noLabelTemplate', value: true },
            { name: 'customSearchEnabled', value: true },
            { name: 'minCountForSearch', value: 5 },
            { name: 'hideSelectedItems', value: true },
            { name: 'tabIndex', value: 2 },
            { name: 'resettable', value: true },
            { name: 'resetSelectedValue', value: 'default' },
            { name: 'grid', value: '100px' },
            { name: 'selectionOverride', value: '%size% items selected' },
            { name: 'selectionNoWrap', value: true },
            { name: 'showSelectAll', value: true },
            { name: 'removeAllText', value: 'Remove all' },
            { name: 'selectAllText', value: 'Select all' },
            { name: 'title', value: 'Select an option' },
            { name: 'ariaLabelledby', value: 'label-id' },
            { name: 'ariaDescribedby', value: 'description-id' },
            { name: 'ariaInvalid', value: true },
            { name: 'ariaResetButtonDescription', value: 'Reset' },
            { name: 'nativeKeyboard', value: true },
        ];

        inputTests.forEach(({ name, value }) => {
            it(`should set ${name} correctly`, () => {
                fixture.componentRef.setInput(name, value);
                expect((component as any)[name]()).toEqual(value);
                fixture.detectChanges();
                expect((component.input()[0] as any)[name]()).toEqual(value);
            });
        });
    });

    it('should write value to Select2', () => {
        spyOn(component.inputElement!, 'writeValue');
        component.writeValue('test-value');
        expect(component.inputElement?.writeValue).toHaveBeenCalledWith('test-value');
    });

    it('should update value and emit update on changeValue', () => {
        const mockEvent = { value: 'new-value' } as Select2UpdateEvent<any>;
        spyOn(component.update, 'emit');
        spyOn(component, 'onChange');
        component.changeValue(mockEvent);
        expect(component.onChange).toHaveBeenCalledWith('new-value');
        expect(component.update.emit).toHaveBeenCalledWith('new-value');
    });

    it('should emit focus event on focus', () => {
        spyOn(component.focus, 'emit');
        (component as any).input()[0].focus.emit({} as any);
        expect(component.focus.emit).toHaveBeenCalled();
    });

    it('should emit blur event and call onTouched and validate on blur', () => {
        spyOn(component.blur, 'emit');
        spyOn(component, 'onTouched');
        spyOn(component, 'validate');

        (component as any).input()[0].blur.emit({} as any);

        expect(component.blur.emit).toHaveBeenCalled();
        expect(component.onTouched).toHaveBeenCalled();
        expect(component.validate).not.toHaveBeenCalled();
    });

    it('should call onTouched and validate on blur if ngControl is present', () => {
        spyOn(component.blur, 'emit');
        spyOn(component, 'onTouched');
        spyOn(component, 'validate');

        component.ngOnInit();
        component.ngControl = new MockNgControl() as unknown as NgControl;

        (component as any).input()[0].blur.emit({} as any);

        expect(component.onTouched).toHaveBeenCalled();
        expect(component.validate).toHaveBeenCalledWith((component.ngControl as any)?.control);
    });

    it('should display Error if onError is true', () => {
        component['onError'].set(true);
        fixture.detectChanges();
        const errorElement = fixture.debugElement.nativeElement.textContent;
        expect(errorElement).toContain('Error');
    });

    it('should emit autoCreateItem event', () => {
        spyOn(component.autoCreateItem, 'emit');
        component.input()[0].autoCreateItem.emit({} as any);
        expect(component.autoCreateItem.emit).toHaveBeenCalled();
    });

    describe('Output events', () => {
        const outputTests = [
            { name: 'autoCreateItem', eventName: 'autoCreateItem' },
            { name: 'open', eventName: 'open' },
            { name: 'close', eventName: 'close' },
            { name: 'search', eventName: 'search' },
            { name: 'scroll', eventName: 'scroll' },
            { name: 'removeOption', eventName: 'removeOption' },
        ];

        outputTests.forEach(({ name, eventName }) => {
            it(`should emit ${name} event`, () => {
                spyOn((component as any)[name], 'emit');
                (component as any).input()[0][eventName].emit({} as any);
                expect((component as any)[name].emit).toHaveBeenCalled();
            });
        });
    });
});
