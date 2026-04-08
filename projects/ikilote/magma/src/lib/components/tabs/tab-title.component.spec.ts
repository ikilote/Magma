import { Component, DebugElement, contentChildren } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaTabTitle } from './tab-title.component';
import { MagmaTabs } from './tabs.component';

import { MagmaClickEnterDirective } from '../../directives/click-enter.directive';

@Component({
    selector: 'mg-tabs',
    template: `<ng-content select="mg-tab-title" />`,
})
class MockMagmaTabs {
    update = vi.fn();
    // Mock for tabpanel() which returns an object with a nativeElement that has a focus method
    tabpanel = vi.fn().mockReturnValue({
        nativeElement: { focus: vi.fn() },
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
        // Reset focus before each test to prevent contamination
        if (document.activeElement && document.activeElement !== document.body) {
            (document.activeElement as HTMLElement).blur();
        }
        document.body.focus();

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

        fixture.changeDetectorRef.detectChanges();

        // Wait for any pending focus operations to complete
        await new Promise(resolve => setTimeout(resolve, 0));
    });

    afterEach(async () => {
        // Clean up focus before destroying fixture
        if (document.activeElement && document.activeElement !== document.body) {
            (document.activeElement as HTMLElement).blur();
        }
        document.body.focus();

        // Wait for async operations to complete BEFORE clearing timers
        await new Promise(resolve => setTimeout(resolve, 100));

        fixture?.destroy();
        vi.clearAllTimers();
        vi.useRealTimers();
        TestBed.resetTestingModule();
    });

    it('should set the correct id attribute', () => {
        expect(tabTitleElement.nativeElement.getAttribute('id')).toBe('tab-tab1');
    });

    it('should apply "selected" class when selected is true', () => {
        tabTitleComponent.selected.set(true);
        fixture.changeDetectorRef.detectChanges();
        expect(tabTitleElement.nativeElement.classList.contains('selected')).toBe(true);
    });

    it('should call onclick in ngOnInit if selected is true', () => {
        vi.spyOn(tabTitleComponent, 'onclick');
        tabTitleComponent.selected.set(true);
        tabTitleComponent.ngOnInit();
        expect(tabTitleComponent.onclick).toHaveBeenCalled();
    });

    it('should call onclick in ngOnChanges if selected changes to true', () => {
        vi.spyOn(tabTitleComponent, 'onclick');
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

    it('should focus previous tab on focusRight', async () => {
        // Focus sur le premier élément avant le test
        tabsComponent.titles()[0].element.nativeElement.focus();
        await new Promise(resolve => setTimeout(resolve, 100));

        tabsComponent.titles()[0].focusRight();
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(tabsComponent.titles()[1].element.nativeElement).toBe(document.activeElement);
    });

    it('should focus previous tab on focusRight', async () => {
        // Focus sur le dernier élément avant le test
        tabsComponent.titles()[2].element.nativeElement.focus();
        await new Promise(resolve => setTimeout(resolve, 100));

        tabsComponent.titles()[2].focusRight();
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(tabsComponent.titles()[2].element.nativeElement).toBe(document.activeElement);
    });

    it('should focus previous tab on focusLeft', async () => {
        // Focus sur le premier élément avant le test
        tabsComponent.titles()[0].element.nativeElement.focus();
        await new Promise(resolve => setTimeout(resolve, 100));

        tabsComponent.titles()[0].focusLeft();
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(tabsComponent.titles()[0].element.nativeElement).toBe(document.activeElement);
    });

    it('should focus previous tab on focusLeft', async () => {
        // Focus sur le dernier élément avant le test
        tabsComponent.titles()[2].element.nativeElement.focus();
        await new Promise(resolve => setTimeout(resolve, 100));

        tabsComponent.titles()[2].focusLeft();
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(tabsComponent.titles()[1].element.nativeElement).toBe(document.activeElement);
    });

    it('should call onclick on clickEnter event', () => {
        vi.spyOn(tabTitleComponent, 'onclick');
        const clickDirective = tabTitleElement.injector.get(MagmaClickEnterDirective);
        clickDirective.clickEnter.emit(new MouseEvent('click'));
        expect(tabTitleComponent.onclick).toHaveBeenCalled();
    });

    it('should call update on clickEnter event', () => {
        vi.useFakeTimers();
        const clickDirective = tabTitleElement.injector.get(MagmaClickEnterDirective);
        clickDirective.clickEnter.emit(new MouseEvent('click'));
        vi.advanceTimersByTime(0);
        expect(tabsComponent.update).toHaveBeenCalled();
        vi.useRealTimers();
    });
});
