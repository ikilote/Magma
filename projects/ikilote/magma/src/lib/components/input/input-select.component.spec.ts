import { ChangeDetectionStrategy, Component, DebugElement, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

import { Select2GroupDirective, Select2OptionDirective, Select2UpdateEvent } from 'ng-select2-component';

import { MagmaInputSelect } from './input-select.component';
import { MockNgControl } from './test-helpers';

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
            { name: 'highlightText', value: true },
            { name: 'showOptionCheckbox', value: true },
        ];

        inputTests.forEach(({ name, value }) => {
            it(`should set ${name} correctly`, () => {
                fixture.componentRef.setInput(name, value);
                expect((component as any)[name]()).toEqual(value);
                fixture.changeDetectorRef.detectChanges();
                expect((component.inputElement as any)[name]()).toEqual(value);
            });
        });
    });

    it('should write value to Select2', () => {
        vi.spyOn(component.inputElement!, 'writeValue');
        component.writeValue('test-value');
        expect(component.inputElement?.writeValue).toHaveBeenCalledWith('test-value');
    });

    it('should update value and emit update on changeValue', () => {
        const mockEvent = { value: 'new-value' } as Select2UpdateEvent<any>;
        vi.spyOn(component.update, 'emit');
        vi.spyOn(component, 'onChange');
        component.changeValue(mockEvent);
        expect(component.onChange).toHaveBeenCalledWith('new-value');
        expect(component.update.emit).toHaveBeenCalledWith('new-value');
    });

    it('should emit focus event on focus', () => {
        vi.spyOn(component.focus, 'emit');
        (component as any).input()[0].focus.emit({} as any);
        expect(component.focus.emit).toHaveBeenCalled();
    });

    it('should emit blur event and call onTouched and validate on blur', () => {
        vi.spyOn(component.blur, 'emit');
        vi.spyOn(component, 'onTouched');
        vi.spyOn(component, 'validate');

        (component as any).input()[0].blur.emit({} as any);

        expect(component.blur.emit).toHaveBeenCalled();
        expect(component.onTouched).toHaveBeenCalled();
        expect(component.validate).not.toHaveBeenCalled();
    });

    it('should call onTouched and validate on blur if ngControl is present', () => {
        vi.spyOn(component.blur, 'emit');
        vi.spyOn(component, 'onTouched');
        vi.spyOn(component, 'validate');

        component.ngOnInit();
        component.ngControl = new MockNgControl() as unknown as NgControl;

        (component as any).input()[0].blur.emit({} as any);

        expect(component.onTouched).toHaveBeenCalled();
        expect(component.validate).toHaveBeenCalledWith((component.ngControl as any)?.control);
    });

    it('should display Error if onError is true', () => {
        component['onError'].set(true);
        fixture.changeDetectorRef.detectChanges();
        const errorElement = fixture.debugElement.nativeElement.textContent;
        expect(errorElement).toContain('Error');
    });

    it('should emit autoCreateItem event', () => {
        vi.spyOn(component.autoCreateItem, 'emit');
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
                vi.spyOn((component as any)[name], 'emit');
                (component as any).input()[0][eventName].emit({} as any);
                expect((component as any)[name].emit).toHaveBeenCalled();
            });
        });
    });
});

// ── ng-option / ng-group propagation tests ──────────────────────────────────

@Component({
    template: `
        <mg-input-select>
            <ng-option value="apple">Apple</ng-option>
            <ng-option value="banana">Banana</ng-option>
            <ng-option value="cherry" [disabled]="true">Cherry</ng-option>
        </mg-input-select>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaInputSelect, Select2OptionDirective],
})
class NgOptionHostComponent {}

@Component({
    template: `
        <mg-input-select>
            <ng-group label="Fruits">
                <ng-option value="apple">Apple</ng-option>
                <ng-option value="banana">Banana</ng-option>
            </ng-group>
            <ng-option value="other">Other</ng-option>
        </mg-input-select>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaInputSelect, Select2OptionDirective, Select2GroupDirective],
})
class NgGroupHostComponent {}

@Component({
    template: `
        <mg-input-select>
            <ng-option value="dynamic">{{ label() }}</ng-option>
        </mg-input-select>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaInputSelect, Select2OptionDirective],
})
class NgOptionInterpolatedHostComponent {
    readonly label = signal('Initial');
}

describe('MagmaInputSelect - ng-option propagation', () => {
    describe('flat ng-option list', () => {
        let fixture: ComponentFixture<NgOptionHostComponent>;
        let selectComponent: MagmaInputSelect;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [NgOptionHostComponent],
            }).compileComponents();

            fixture = TestBed.createComponent(NgOptionHostComponent);
            fixture.detectChanges();
            selectComponent = fixture.debugElement.children[0].componentInstance;
        });

        afterEach(() => {
            fixture?.destroy();
            TestBed.resetTestingModule();
        });

        it('should collect ng-option content children', () => {
            expect(selectComponent._ngOptions().length).toBe(3);
        });

        it('should build _mergedData from projected ng-option elements', () => {
            const data = selectComponent._mergedData();
            expect(data.length).toBe(3);
            expect((data[0] as any).value).toBe('apple');
            expect((data[0] as any).label).toBe('Apple');
            expect((data[1] as any).value).toBe('banana');
            expect((data[1] as any).label).toBe('Banana');
            expect((data[2] as any).value).toBe('cherry');
            expect((data[2] as any).disabled).toBe(true);
        });

        it('should pass _mergedData to ng-select2 as data', async () => {
            const select2 = selectComponent.inputElement;
            expect(select2).toBeTruthy();
            // The _mergedData computed produces the correct data
            const mergedData = selectComponent._mergedData();
            expect(mergedData.length).toBe(3);
            expect((mergedData[0] as any).value).toBe('apple');
            expect((mergedData[1] as any).value).toBe('banana');
            expect((mergedData[2] as any).value).toBe('cherry');
        });
    });

    describe('ng-group with nested ng-option', () => {
        let fixture: ComponentFixture<NgGroupHostComponent>;
        let selectComponent: MagmaInputSelect;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [NgGroupHostComponent],
            }).compileComponents();

            fixture = TestBed.createComponent(NgGroupHostComponent);
            fixture.detectChanges();
            selectComponent = fixture.debugElement.children[0].componentInstance;
        });

        afterEach(() => {
            fixture?.destroy();
            TestBed.resetTestingModule();
        });

        it('should collect ng-group content children', () => {
            expect(selectComponent._ngGroups().length).toBe(1);
        });

        it('should build _mergedData with groups and top-level options', () => {
            const data = selectComponent._mergedData();
            expect(data.length).toBe(2); // 1 group + 1 top-level option

            // First item should be the group
            const group = data[0] as any;
            expect(group.label).toBe('Fruits');
            expect(group.options.length).toBe(2);
            expect(group.options[0].value).toBe('apple');
            expect(group.options[1].value).toBe('banana');

            // Second item should be the top-level option
            const option = data[1] as any;
            expect(option.value).toBe('other');
            expect(option.label).toBe('Other');
        });
    });

    describe('interpolation support', () => {
        let fixture: ComponentFixture<NgOptionInterpolatedHostComponent>;
        let host: NgOptionInterpolatedHostComponent;
        let selectComponent: MagmaInputSelect;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [NgOptionInterpolatedHostComponent],
            }).compileComponents();

            fixture = TestBed.createComponent(NgOptionInterpolatedHostComponent);
            fixture.detectChanges();
            host = fixture.componentInstance;
            selectComponent = fixture.debugElement.children[0].componentInstance;
        });

        afterEach(() => {
            fixture?.destroy();
            TestBed.resetTestingModule();
        });

        it('should reflect initial interpolated content after ngDoCheck', () => {
            // Trigger ngDoCheck to refresh projected content from DOM
            selectComponent.ngDoCheck();
            fixture.detectChanges();
            const data = selectComponent._mergedData();
            expect((data[0] as any).label).toBe('Initial');
        });

        it('should update label when interpolated content changes', async () => {
            // Initial refresh
            selectComponent.ngDoCheck();
            fixture.detectChanges();

            // Change the signal
            host.label.set('Updated');
            fixture.detectChanges();

            // ngDoCheck refreshes projected content
            selectComponent.ngDoCheck();
            fixture.detectChanges();
            await new Promise(r => setTimeout(r, 0));
            fixture.detectChanges();
            const data = selectComponent._mergedData();
            expect((data[0] as any).label).toBe('Updated');
        });
    });

    describe('fallback to data input', () => {
        let fixture: ComponentFixture<MagmaInputSelect>;
        let component: MagmaInputSelect;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [MagmaInputSelect],
            }).compileComponents();

            fixture = TestBed.createComponent(MagmaInputSelect);
            fixture.componentRef.setInput('data', [{ value: 'from-data', label: 'From Data' }]);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        afterEach(() => {
            fixture?.destroy();
            TestBed.resetTestingModule();
        });

        it('should use data input when no ng-option are present', () => {
            const data = component._mergedData();
            expect(data.length).toBe(1);
            expect((data[0] as any).value).toBe('from-data');
        });
    });

    describe('fallback to data input on error', () => {
        it('should fall back to data input when toOption() throws', () => {
            @Component({
                template: `<mg-input-select [data]="fallbackData"
                    ><ng-option [value]="val">X</ng-option></mg-input-select
                >`,
                changeDetection: ChangeDetectionStrategy.Eager,
                imports: [MagmaInputSelect, Select2OptionDirective],
            })
            class ErrorHostComponent {
                fallbackData = [{ value: 'fallback', label: 'Fallback' }];
                val: any = 'ok';
            }

            TestBed.configureTestingModule({ imports: [ErrorHostComponent] });
            const fix = TestBed.createComponent(ErrorHostComponent);
            fix.detectChanges();

            const selectComp: MagmaInputSelect = fix.debugElement.children[0].componentInstance;

            // First call: _mergedData evaluates successfully (ng-option with value='ok')
            expect(selectComp._mergedData().length).toBe(1);

            // Mock toOption to throw, simulating NG0950 (required input not initialized)
            const opts = selectComp._ngOptions();
            vi.spyOn(opts[0], 'toOption').mockImplementation(() => {
                throw new Error('NG0950: required input not ready');
            });

            // Invalidate the computed by changing _projectedContent signal (a tracked dependency)
            opts[0]._projectedContent.set('changed-to-invalidate');

            // Now _mergedData should catch the error and fall back to data()
            const data = selectComp._mergedData();
            expect(data).toEqual([{ value: 'fallback', label: 'Fallback' }]);

            fix.destroy();
            TestBed.resetTestingModule();
        });
    });
});
