import { CommonModule } from '@angular/common';
import { Component, DebugElement, ElementRef, forwardRef, viewChildren } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { MagmaSortRuleDirective, MagmaSortableDirective, MagmaSortableModule } from './sortable.directive';

import { MagmaInput } from '../../public-api';
import { MagmaInputCommon } from '../components/input/input-common';

@Component({
    template: `
        <div [sortable]="sortable" [sortable-filter-input]="sortableFilterInput" [sortable-filter]="sortableFilter">
            <div [sort-rule]="sortRule" (clickEnter)="onClick()"></div>
            <ul>
                @for (item of date; track item.name) {
                    <li>{{ item.name }} ({{ item.age }})</li>
                }
            </ul>
        </div>
    `,
    imports: [CommonModule, MagmaSortableModule],
})
class TestHostComponent {
    sortRule: any = 'name';
    sortable: any = [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
    ];
    sortableFilterInput: any = undefined;
    sortableFilter: any = undefined;
    onClick() {}
}

describe('MagmaSortableModule', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;
    let sortRuleDirectiveElement: DebugElement;
    let sortRuleDirective: MagmaSortRuleDirective;
    let sortableDirective: MagmaSortableDirective;
    let classList: DOMTokenList;
    let componentInstance: TestHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        sortRuleDirectiveElement = fixture.debugElement.query(By.directive(MagmaSortRuleDirective));
        sortRuleDirective = sortRuleDirectiveElement.injector.get(MagmaSortRuleDirective);
        sortableDirective = fixture.debugElement
            .query(By.directive(MagmaSortableDirective))
            .injector.get(MagmaSortableDirective);

        fixture.detectChanges();

        classList = sortRuleDirectiveElement.nativeElement.classList;
        componentInstance = sortRuleDirectiveElement.componentInstance;
    });

    describe('sort-rule', () => {
        it('should apply "sort-asc" class when current rule and order match', () => {
            componentInstance.sortRule = 'name';
            sortableDirective.sortWithRule('name', 'asc');
            fixture.detectChanges();

            expect(classList.contains('sort-asc')).toBeTrue();
            expect(classList.contains('sort-desc')).toBeFalse();
        });

        it('should apply "sort-desc" class when current rule and order match', () => {
            componentInstance.sortRule = 'name';
            sortableDirective.sortWithRule('name', 'desc');
            fixture.detectChanges();

            expect(classList.contains('sort-desc')).toBeTrue();
            expect(classList.contains('sort-asc')).toBeFalse();
        });

        it('should apply "sort-desc" class when click on "sort-desc"', () => {
            componentInstance.sortRule = 'name';
            sortRuleDirectiveElement.nativeElement.click();
            fixture.detectChanges();
            expect(classList.contains('sort-asc')).toBeTrue();
            expect(classList.contains('sort-desc')).toBeFalse();

            expect(componentInstance.sortable).toEqual([
                { name: 'Alice', age: 30 },
                { name: 'Bob', age: 25 },
            ]);

            sortRuleDirectiveElement.nativeElement.click();
            fixture.detectChanges();
            expect(classList.contains('sort-asc')).toBeFalse();
            expect(classList.contains('sort-desc')).toBeTrue();

            expect(componentInstance.sortable).toEqual([
                { name: 'Bob', age: 25 },
                { name: 'Alice', age: 30 },
            ]);
        });
    });

    describe('sortable with sort-rule', () => {
        it('should apply "sort-cell" class when rule type is "none"', () => {
            componentInstance.sortRule = { type: 'none' };
            fixture.detectChanges();
            expect(classList.contains('sort-cell')).toBeTrue();
        });

        it('should apply "sort-cell" class when rule type is "none"', () => {
            componentInstance.sortRule = [{ type: 'none' }];
            fixture.detectChanges();
            sortRuleDirective.ngOnInit();
            expect(classList.contains('sort-cell')).toBeTrue();
        });

        it('should initialize with string rule', () => {
            componentInstance.sortRule = 'name:asc';
            fixture.detectChanges();
            sortRuleDirectiveElement.nativeElement.click();

            expect(sortableDirective.currentRule).toEqual('name:asc');
        });

        it('should initialize with object rule and init order', () => {
            componentInstance.sortRule = { attr: 'name', type: 'string', init: 'desc' };
            fixture.detectChanges();
            sortRuleDirective.ngOnInit();

            expect(sortableDirective.currentRule).toEqual({ attr: 'name', type: 'string', init: 'desc' });
            expect(sortableDirective.currentRuleOrder).toBeFalse();
        });

        it('should initialize with array of object rule and init order', () => {
            componentInstance.sortRule = [{ attr: 'name', type: 'string', init: 'desc' }];
            fixture.detectChanges();
            sortRuleDirective.ngOnInit();

            expect(sortableDirective.currentRule).toEqual([{ attr: 'name', type: 'string', init: 'desc' }]);
            expect(sortableDirective.currentRuleOrder).toBeFalse();
        });

        it('should not initialize with "none" rule', () => {
            spyOn(sortableDirective, 'sortWithRule');

            componentInstance.sortRule = { type: 'none' };
            fixture.detectChanges();
            sortRuleDirective.ngOnInit();

            expect(sortableDirective.sortWithRule).not.toHaveBeenCalled();
        });

        it('should return true for "none" rule', () => {
            componentInstance.sortRule = { type: 'none' };
            fixture.detectChanges();

            const result = sortRuleDirective['isNone']();
            expect(result).toBeTrue();
        });

        it('should return false for non-"none" rule', () => {
            componentInstance.sortRule = { attr: 'name', type: 'string' };
            fixture.detectChanges();

            const result = sortRuleDirective['isNone']();
            expect(result).toBeFalse();
        });

        it('should return init order for object rule', () => {
            componentInstance.sortRule = { attr: 'name', type: 'string', init: 'desc' };
            fixture.detectChanges();

            const result = sortRuleDirective['isInit']();
            expect(result).toBe('desc');
        });

        it('should return init order for array rule', () => {
            componentInstance.sortRule = [{ attr: 'name', type: 'string', init: 'desc' }];
            fixture.detectChanges();

            const result = sortRuleDirective['isInit']();
            expect(result).toBe('desc');
        });
    });

    describe('sortable', () => {
        it('should initialize with default values for inputListener and input', () => {
            fixture.detectChanges();
            const inputListener = sortableDirective['inputListener'];
            const input = sortableDirective['input'];
            expect(inputListener).toBe(undefined);
            expect(input).toBe('');
        });

        it('should register input listener on initialization with input element', fakeAsync(() => {
            const inputElement = document.createElement('input');
            inputElement.type = 'text';
            component.sortableFilterInput = inputElement;
            fixture.detectChanges();
            sortableDirective.ngOnInit();
            inputElement.dispatchEvent(new Event('input'));
            tick();
            const inputListener = sortableDirective['inputListener'];
            const input = sortableDirective['input'];
            expect(typeof inputListener).toBe('function');
            expect(input).toBe('');
        }));

        it('should register input listener on initialization with input element and filter function', () => {
            const inputElement = document.createElement('input');
            inputElement.type = 'text';
            component.sortableFilterInput = inputElement;
            component.sortableFilter = (key: string, item: any, index: number) => true;
            fixture.detectChanges();
            sortableDirective.ngOnInit();
            const inputListener = sortableDirective['inputListener'];
            const input = sortableDirective['input'];
            expect(typeof inputListener).toBe('function');
            expect(input).toBe('');
        });

        it('should not call update if sortable is not initialized', () => {
            spyOn(sortableDirective, 'update');
            fixture.detectChanges();
            componentInstance.sortable = [
                { name: 'Foo', age: 30 },
                { name: 'Bar', age: 25 },
            ];
            expect(sortableDirective.update).toHaveBeenCalledTimes(0);
        });

        it('should call update once when sortable is initialized with input element and filter function', () => {
            spyOn(sortableDirective, 'update');
            const inputElement = document.createElement('input');
            inputElement.type = 'text';
            component.sortableFilterInput = inputElement;
            component.sortableFilter = (key: string, item: any, index: number) => true;
            fixture.detectChanges();
            sortableDirective.ngOnInit();
            componentInstance.sortable = [
                { name: 'Foo', age: 30 },
                { name: 'Bar', age: 25 },
            ];
            fixture.detectChanges();
            expect(sortableDirective.update).toHaveBeenCalledTimes(1);
        });

        it('should set input value correctly when input element has a value', () => {
            const inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.value = 'test';
            component.sortableFilterInput = inputElement;
            component.sortableFilter = (key: string, item: any, index: number) => true;
            fixture.detectChanges();
            sortableDirective.ngOnInit();
            componentInstance.sortable = [
                { name: 'Foo', age: 30 },
                { name: 'Bar', age: 25 },
            ];
            fixture.detectChanges();
            expect(sortableDirective['input']).toBe('test');
        });

        it('should filter data correctly when input value matches filter criteria', () => {
            const inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.value = 'test';
            component.sortableFilterInput = inputElement;
            component.sortableFilter = (key: string, item: any, index: number) => item.name === 'Foo';
            componentInstance.sortable = [
                { name: 'Foo', age: 30 },
                { name: 'Bar', age: 25 },
            ];
            sortableDirective.ngOnInit();
            fixture.detectChanges();
            sortableDirective.update();
            expect(sortableDirective['sortableComplete']).toEqual([
                { name: 'Foo', age: 30 },
                { name: 'Bar', age: 25 },
            ]);
            expect(sortableDirective['sortable']()).toEqual([{ name: 'Foo', age: 30 }]);
        });

        it('should not filter data when input value is empty', () => {
            const inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.value = '';
            component.sortableFilterInput = inputElement;
            componentInstance.sortable = [
                { name: 'Foo', age: 30 },
                { name: 'Bar', age: 25 },
            ];
            component.sortableFilter = (key: string, item: any, index: number) => item.name === 'Foo';

            sortableDirective['input'] = 'test';
            sortableDirective.ngOnInit();

            fixture.detectChanges();
            sortableDirective.update();
            expect(sortableDirective['sortableComplete']).toEqual([
                { name: 'Foo', age: 30 },
                { name: 'Bar', age: 25 },
            ]);
            expect(sortableDirective['sortable']()).toEqual([
                { name: 'Foo', age: 30 },
                { name: 'Bar', age: 25 },
            ]);
        });
    });
});

@Component({
    selector: 'mg-input',
    template: '<ng-content />',
})
class MockMagmaInput {}

@Component({
    selector: 'mg-input-text',
    template: '<input #input />',
    imports: [ReactiveFormsModule, FormsModule],
    providers: [
        { provide: MagmaInputCommon, useExisting: MockMagmaInputText },
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MagmaInputCommon), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => MagmaInputCommon), multi: true },
        { provide: MagmaInput, useExisting: MockMagmaInput },
    ],
})
export class MockMagmaInputText extends MagmaInputCommon<any> {
    override ngOnInit() {}

    readonly input = viewChildren<ElementRef<HTMLInputElement>>('input');

    override get inputElement(): HTMLInputElement | undefined {
        return this.input()?.[0]?.nativeElement;
    }
}

@Component({
    template: `
        <mg-input>
            <mg-input-text #test />
        </mg-input>
        <div [sortable]="sortable" [sortable-filter-input]="test" [sortable-filter]="sortableFilter">
            <div [sort-rule]="sortRule" (clickEnter)="onClick()"></div>
            <ul>
                @for (item of date; track item.name) {
                    <li>{{ item.name }} ({{ item.age }})</li>
                }
            </ul>
        </div>
    `,
    imports: [MagmaSortableModule, MockMagmaInput, MockMagmaInputText],
})
class TestInputHostComponent {
    sortRule: any = 'name';
    sortable: any = [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
    ];

    sortableFilter: any = undefined;

    onClick() {}
}

describe('MagmaSortableModule + MagmaInput', () => {
    let fixture: ComponentFixture<TestInputHostComponent>;
    let component: TestInputHostComponent;
    let sortRuleDirectiveElement: DebugElement;
    let sortableDirective: MagmaSortableDirective;
    let componentInstance: TestInputHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestInputHostComponent] }).compileComponents();

        fixture = TestBed.createComponent(TestInputHostComponent);
        component = fixture.componentInstance;
        sortRuleDirectiveElement = fixture.debugElement.query(By.directive(MagmaSortRuleDirective));
        sortableDirective = fixture.debugElement
            .query(By.directive(MagmaSortableDirective))
            .injector.get(MagmaSortableDirective);

        fixture.detectChanges();

        componentInstance = sortRuleDirectiveElement.componentInstance;
    });

    it('should call update once when sortable is initialized with input element and filter function', () => {
        spyOn(sortableDirective, 'update');
        component.sortableFilter = (key: string, item: any, index: number) => true;
        fixture.detectChanges();
        sortableDirective.ngOnInit();
        componentInstance.sortable = [
            { name: 'Foo', age: 30 },
            { name: 'Bar', age: 25 },
        ];
        fixture.detectChanges();
        expect(sortableDirective.update).toHaveBeenCalledTimes(1);
    });
});
