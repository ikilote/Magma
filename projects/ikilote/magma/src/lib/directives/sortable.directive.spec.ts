import { CommonModule } from '@angular/common';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaSortRuleDirective, MagmaSortableDirective, MagmaSortableModule } from './sortable.directive';

@Component({
    template: `
        <div sortable [sortable]="data">
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
    data = [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
    ];
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

            expect(componentInstance.data).toEqual([
                { name: 'Alice', age: 30 },
                { name: 'Bob', age: 25 },
            ]);

            sortRuleDirectiveElement.nativeElement.click();
            fixture.detectChanges();
            expect(classList.contains('sort-asc')).toBeFalse();
            expect(classList.contains('sort-desc')).toBeTrue();

            expect(componentInstance.data).toEqual([
                { name: 'Bob', age: 25 },
                { name: 'Alice', age: 30 },
            ]);
        });
    });

    describe('sortable', () => {
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
});
