import { Component, DebugElement, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaTabContent } from './tab-content.component';
import { MagmaTabTitle } from './tab-title.component';
import { MagmaTabs } from './tabs.component';

@Component({
    template: `
        <mg-tabs>
            <mg-tab-title id="tab1">Title 1</mg-tab-title>
            <mg-tab-content id="tab1">Content 1</mg-tab-content>
            <mg-tab-title id="tab2">Title 2</mg-tab-title>
            <mg-tab-content id="tab2">Content 2</mg-tab-content>
        </mg-tabs>
    `,
    imports: [MagmaTabs, MagmaTabTitle, MagmaTabContent],
})
class TestHostComponent {
    tabs = viewChild.required(MagmaTabs);
}

describe('MagmaTabs - Integration', () => {
    let testHost: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    let tabMagmaTabs: DebugElement;
    let tags: MagmaTabs;
    let tabMagmaTabTitle: DebugElement[];
    let tabMagmaTabContent: DebugElement[];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent, MagmaTabs, MagmaTabTitle, MagmaTabContent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        testHost = fixture.componentInstance;
        fixture.changeDetectorRef.detectChanges();

        tabMagmaTabs = fixture.debugElement.query(By.directive(MagmaTabs));
        tags = tabMagmaTabs.componentInstance;
        tabMagmaTabTitle = fixture.debugElement.queryAll(By.directive(MagmaTabTitle));
        tabMagmaTabContent = fixture.debugElement.queryAll(By.directive(MagmaTabContent));
    });

    afterEach(() => {
        if (tags.updateInterval) {
            clearInterval(tags.updateInterval);
            tags.updateInterval = undefined;
        }
        window.document.body.style.cssText = '';
        fixture?.destroy();
    });

    it('should display the content of the first tab by default', () => {
        const contents = testHost.tabs().content();
        expect(contents[0].selected()).toBe(true);
        expect(contents[1].selected()).toBe(false);

        expect(tabMagmaTabContent[0].nativeElement.textContent).toBe('Content 1');
        expect(tabMagmaTabContent[1].nativeElement.textContent).toBe('');
    });

    it('should display the content a selected tab', () => {
        tags.update('tab2');
        fixture.changeDetectorRef.detectChanges();

        const contents = testHost.tabs().content();
        expect(contents[0].selected()).toBe(false);
        expect(contents[1].selected()).toBe(true);

        expect(tabMagmaTabContent[0].nativeElement.textContent).toBe('');
        expect(tabMagmaTabContent[1].nativeElement.textContent).toBe('Content 2');
    });

    it('should display the content a selected an invalid tab', () => {
        tags.update('tab2');
        fixture.changeDetectorRef.detectChanges();

        tags.update('invalid');
        fixture.changeDetectorRef.detectChanges();

        const contents = testHost.tabs().content();
        expect(contents[0].selected()).toBe(true);
        expect(contents[1].selected()).toBe(false);

        expect(tabMagmaTabContent[0].nativeElement.textContent).toBe('Content 1');
        expect(tabMagmaTabContent[1].nativeElement.textContent).toBe('');
    });

    it('should focus tab on returnTabs', () => {
        // Ensure focus is not already on the target element
        // Focus on body first
        document.body.focus();
        
        tags.returnTabs();

        expect(document.activeElement).toBe(tabMagmaTabTitle[0].nativeElement);
    });

    it('should next & prev button are not visible', () => {
        window.document.body.style = '';
        fixture.changeDetectorRef.detectChanges();
        const { clientWidth, scrollWidth, scrollLeft } = tags.tablist().nativeElement;

        expect(tags.prev()).toBe(false);
        expect(tags.next()).toBe(false);
        expect(fixture.nativeElement.querySelector('.prev.show')).toBeNull();
        expect(fixture.nativeElement.querySelector('.next.show')).toBeNull();
        expect(clientWidth).toBe(scrollWidth);
        expect(scrollLeft).toBe(0);
    });

    it('should next/prev button is visible', () => {
        window.document.body.style = 'width:150px';
        fixture.changeDetectorRef.detectChanges();
        tags.ngAfterViewChecked();

        const { clientWidth, scrollWidth, scrollLeft } = tags.tablist().nativeElement;

        expect(tags.prev()).toBe(false);
        expect(tags.next()).toBe(true);
        expect(tags.updateInterval).toBeUndefined();
        expect(fixture.nativeElement.querySelector('.prev.show')).toBeNull();
        expect(fixture.nativeElement.querySelector('.next.show')).not.toBeNull();
        expect(clientWidth).not.toBe(scrollWidth);
        expect(scrollLeft).toBe(0);

        fixture.changeDetectorRef.detectChanges();
        tags.moveTabs(true, 15);

        const { scrollLeft: scrollLeft2 } = tags.tablist().nativeElement;
        expect(scrollLeft2).toBe(15);
        expect(tags.prev()).toBe(false);
        expect(tags.next()).toBe(true);
        expect(tags.updateInterval).toBeDefined();

        fixture.changeDetectorRef.detectChanges();
        tags.moveTabs(true, 100);

        const { scrollLeft: scrollLeft3 } = tags.tablist().nativeElement;
        expect(scrollLeft3).toBe(48);
        expect(tags.prev()).toBe(false);
        expect(tags.next()).toBe(true);
        expect(tags.updateInterval).toBeDefined();
        fixture.changeDetectorRef.detectChanges();
        expect(fixture.nativeElement.querySelector('.prev.show')).not.toBeNull();
        expect(fixture.nativeElement.querySelector('.next.show')).toBeNull();

        tags.moveTabs(true, -15);

        const { scrollLeft: scrollLeft4 } = tags.tablist().nativeElement;
        expect(scrollLeft4).toBe(33);
        expect(tags.prev()).toBe(true);
        expect(tags.next()).toBe(false);
        expect(tags.updateInterval).toBeDefined();

        fixture.changeDetectorRef.detectChanges();
        tags.moveTabs(false);

        expect(tags.updateInterval).toBeUndefined();
    });

    it('should next/prev button is visible', () => {
        window.document.body.style = 'width:150px';
        fixture.changeDetectorRef.detectChanges();
        tags.ngAfterViewChecked();

        fixture.changeDetectorRef.detectChanges();
        tags.moveTabs(true, 300);

        const { scrollLeft: scrollLeft } = tags.tablist().nativeElement;
        expect(scrollLeft).toBe(48);
        expect(tags.prev()).toBe(false);
        expect(tags.next()).toBe(true);
        expect(tags.updateInterval).toBeDefined();

        fixture.changeDetectorRef.detectChanges();
        tags.moveTabs(true, -100);
        fixture.changeDetectorRef.detectChanges();
        tags.moveTabs(true, -100);

        const { scrollLeft: scrollLeft2 } = tags.tablist().nativeElement;
        expect(scrollLeft2).toBe(0);
        expect(tags.prev()).toBe(false);
        expect(tags.next()).toBe(true);
        expect(tags.updateInterval).toBeDefined();
    });

    it('should next hide when resize', () => {
        window.document.body.style = 'width:150px';
        fixture.changeDetectorRef.detectChanges();
        tags.ngAfterViewChecked();

        fixture.changeDetectorRef.detectChanges();

        const { scrollLeft: scrollLeft } = tags.tablist().nativeElement;
        expect(scrollLeft).toBe(0);
        expect(tags.prev()).toBe(false);
        expect(tags.next()).toBe(true);

        window.document.body.style = 'width:300px';

        fixture.changeDetectorRef.detectChanges();

        const { scrollLeft: scrollLeft2 } = tags.tablist().nativeElement;
        expect(scrollLeft2).toBe(0);
        expect(tags.prev()).toBe(false);
        expect(tags.next()).toBe(false);
    });

    it('should prev hide when resize', () => {
        window.document.body.style = 'width:150px';
        fixture.changeDetectorRef.detectChanges();
        tags.ngAfterViewChecked();

        tags.moveTabs(true, 300);
        fixture.changeDetectorRef.detectChanges();

        const { scrollLeft: scrollLeft } = tags.tablist().nativeElement;
        expect(scrollLeft).toBe(48);
        expect(tags.prev()).toBe(true);
        expect(tags.next()).toBe(false);

        window.document.body.style = 'width:300px';

        fixture.changeDetectorRef.detectChanges();

        const { scrollLeft: scrollLeft2 } = tags.tablist().nativeElement;
        expect(scrollLeft2).toBe(0);
        expect(tags.prev()).toBe(false);
        expect(tags.next()).toBe(false);
    });
});
