import { Component, DebugElement, contentChildren } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaTabTitle } from './tab-title.component';
import { MagmaTabs } from './tabs.component';

import { MagmaClickEnterDirective } from '../../directives/click-enter.directive';

@Component({
    selector: 'mg-tabs',
    template: `<ng-content select="mg-tab-title" />`,
})
class MockMagmaTabs {
    update = jasmine.createSpy('update');
    // Mock for tabpanel() which returns an object with a nativeElement that has a focus method
    tabpanel = jasmine.createSpy('tabpanel').and.returnValue({
        nativeElement: { focus: jasmine.createSpy('focus') },
    });
    // Simulate the array of title components for focus tests
    titles = contentChildren(MagmaTabTitle);
}

@Component({
    template: `
        <mg-tabs>
            <mg-tab-title id="tab1">Title 1</mg-tab-title>
            <mg-tab-title id="tab2">Title 2</mg-tab-title>
            <mg-tab-title id="tab3">Title 3</mg-tab-title>
        </mg-tabs>
    `,
    imports: [MockMagmaTabs, MagmaTabTitle],
})
class TestHostComponent {}

describe('MagmaTabTitle', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let tabTitleComponent: MagmaTabTitle;
    let tabsElement: DebugElement;
    let tabTitleElement: DebugElement;
    let tabsComponent: MockMagmaTabs;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        })
            .overrideComponent(MagmaTabTitle, {
                add: {
                    providers: [{ provide: MagmaTabs, useValue: MockMagmaTabs }],
                },
            })
            .compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        tabTitleElement = fixture.debugElement.query(By.directive(MagmaTabTitle));
        tabTitleComponent = tabTitleElement.componentInstance;
        tabsElement = fixture.debugElement.query(By.directive(MockMagmaTabs));
        tabsComponent = tabsElement.componentInstance;

        // mock host
        tabsComponent.titles().forEach(e => ((e as any)['tabs'] = tabsComponent));

        fixture.detectChanges();
    });

    it('should set the correct id attribute', () => {
        expect(tabTitleElement.nativeElement.getAttribute('id')).toBe('tab1');
    });

    it('should apply "selected" class when selected is true', () => {
        tabTitleComponent.selected.set(true);
        fixture.detectChanges();
        expect(tabTitleElement.nativeElement.classList.contains('selected')).toBeTrue();
    });

    it('should call onclick in ngOnInit if selected is true', () => {
        spyOn(tabTitleComponent, 'onclick');
        tabTitleComponent.selected.set(true);
        tabTitleComponent.ngOnInit();
        expect(tabTitleComponent.onclick).toHaveBeenCalled();
    });

    it('should call onclick in ngOnChanges if selected changes to true', () => {
        spyOn(tabTitleComponent, 'onclick');
        tabTitleComponent.selected.set(true);
        tabTitleComponent.ngOnChanges({
            selected: {
                currentValue: true,
                previousValue: false,
                firstChange: false,
                isFirstChange: () => false,
            },
        });
        expect(tabTitleComponent.onclick).toHaveBeenCalled();
    });

    it('should have content', () => {
        expect(tabsComponent.titles()[0].element.nativeElement.textContent).toBe('Title 1');
        expect(tabsComponent.titles()[1].element.nativeElement.textContent).toBe('Title 2');
        expect(tabsComponent.titles()[2].element.nativeElement.textContent).toBe('Title 3');
    });

    it('should focus previous tab on focusRight', () => {
        const previousTab = document.createElement('div');
        spyOn(previousTab, 'focus');

        tabsComponent.titles()[0].focusRight();
        expect(tabsComponent.titles()[1].element.nativeElement).toBe(document.activeElement);
    });

    it('should focus previous tab on focusRight', () => {
        const previousTab = document.createElement('div');
        spyOn(previousTab, 'focus');

        tabsComponent.titles()[2].focusRight();
        expect(tabsComponent.titles()[2].element.nativeElement).toBe(document.activeElement);
    });

    it('should focus previous tab on focusLeft', () => {
        const previousTab = document.createElement('div');
        spyOn(previousTab, 'focus');

        tabsComponent.titles()[0].focusLeft();
        expect(tabsComponent.titles()[0].element.nativeElement).toBe(document.activeElement);
    });

    it('should focus previous tab on focusLeft', () => {
        const previousTab = document.createElement('div');
        spyOn(previousTab, 'focus');

        tabsComponent.titles()[2].focusLeft();
        expect(tabsComponent.titles()[1].element.nativeElement).toBe(document.activeElement);
    });

    it('should call onclick on clickEnter event', () => {
        spyOn(tabTitleComponent, 'onclick');
        const clickDirective = tabTitleElement.injector.get(MagmaClickEnterDirective);
        clickDirective.clickEnter.emit(new MouseEvent('click'));
        expect(tabTitleComponent.onclick).toHaveBeenCalled();
    });

    it('should call update on clickEnter event', fakeAsync(() => {
        const clickDirective = tabTitleElement.injector.get(MagmaClickEnterDirective);
        clickDirective.clickEnter.emit(new MouseEvent('click'));
        tick();
        expect(tabsComponent.update).toHaveBeenCalled();
    }));
});
