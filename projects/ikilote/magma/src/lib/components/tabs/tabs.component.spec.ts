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
        fixture.detectChanges();

        tabMagmaTabs = fixture.debugElement.query(By.directive(MagmaTabs));
        tags = tabMagmaTabs.componentInstance;
        tabMagmaTabTitle = fixture.debugElement.queryAll(By.directive(MagmaTabTitle));
        tabMagmaTabContent = fixture.debugElement.queryAll(By.directive(MagmaTabContent));
    });

    it('should display the content of the first tab by default', () => {
        const contents = testHost.tabs().content();
        expect(contents[0].selected()).toBeTrue();
        expect(contents[1].selected()).toBeFalse();

        expect(tabMagmaTabContent[0].nativeElement.textContent).toBe('Content 1');
        expect(tabMagmaTabContent[1].nativeElement.textContent).toBe('');
    });

    it('should display the content a selected tab', () => {
        tags.update('tab2');
        fixture.detectChanges();

        const contents = testHost.tabs().content();
        expect(contents[0].selected()).toBeFalse();
        expect(contents[1].selected()).toBeTrue();

        expect(tabMagmaTabContent[0].nativeElement.textContent).toBe('');
        expect(tabMagmaTabContent[1].nativeElement.textContent).toBe('Content 2');
    });

    it('should display the content a selected an invalid tab', () => {
        tags.update('tab2');
        fixture.detectChanges();

        tags.update('invalid');
        fixture.detectChanges();

        const contents = testHost.tabs().content();
        expect(contents[0].selected()).toBeTrue();
        expect(contents[1].selected()).toBeFalse();

        expect(tabMagmaTabContent[0].nativeElement.textContent).toBe('Content 1');
        expect(tabMagmaTabContent[1].nativeElement.textContent).toBe('');
    });

    it('should focus tab on returnTabs', () => {
        tags.returnTabs();

        expect(document.activeElement).toBe(tabMagmaTabTitle[0].nativeElement);
    });

    it('should next & prev button are not visible', () => {
        window.document.body.style = '';
        fixture.detectChanges();
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
        fixture.detectChanges();
        tags.ngAfterViewChecked();

        const { clientWidth, scrollWidth, scrollLeft } = tags.tablist().nativeElement;

        expect(tags.prev()).toBe(false);
        expect(tags.next()).toBe(true);
        expect(tags.updateInterval).toBeUndefined();
        expect(fixture.nativeElement.querySelector('.prev.show')).toBeNull();
        expect(fixture.nativeElement.querySelector('.next.show')).toBeDefined();
        expect(clientWidth).not.toBe(scrollWidth);
        expect(scrollLeft).toBe(0);

        fixture.detectChanges();
        tags.moveTabs(true, 15);

        const { scrollLeft: scrollLeft2 } = tags.tablist().nativeElement;
        expect(scrollLeft2).toBe(15);
        expect(tags.prev()).toBe(false);
        expect(tags.next()).toBe(true);
        expect(tags.updateInterval).toBeDefined();

        fixture.detectChanges();
        tags.moveTabs(true, 100);

        const { scrollLeft: scrollLeft3 } = tags.tablist().nativeElement;
        expect(scrollLeft3).toBe(48);
        expect(tags.prev()).toBe(false);
        expect(tags.next()).toBe(true);
        expect(tags.updateInterval).toBeDefined();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('.prev.show')).toBeDefined();
        expect(fixture.nativeElement.querySelector('.next.show')).toBeNull();

        tags.moveTabs(true, -15);

        const { scrollLeft: scrollLeft4 } = tags.tablist().nativeElement;
        expect(scrollLeft4).toBe(33);
        expect(tags.prev()).toBe(true);
        expect(tags.next()).toBe(false);
        expect(tags.updateInterval).toBeDefined();

        fixture.detectChanges();
        tags.moveTabs(false);

        expect(tags.updateInterval).toBeUndefined();
    });

    it('should next/prev button is visible', () => {
        window.document.body.style = 'width:150px';
        fixture.detectChanges();
        tags.ngAfterViewChecked();

        fixture.detectChanges();
        tags.moveTabs(true, 300);

        const { scrollLeft: scrollLeft } = tags.tablist().nativeElement;
        expect(scrollLeft).toBe(48);
        expect(tags.prev()).toBe(false);
        expect(tags.next()).toBe(true);
        expect(tags.updateInterval).toBeDefined();

        fixture.detectChanges();
        tags.moveTabs(true, -100);
        fixture.detectChanges();
        tags.moveTabs(true, -100);

        const { scrollLeft: scrollLeft2 } = tags.tablist().nativeElement;
        expect(scrollLeft2).toBe(0);
        expect(tags.prev()).toBe(false);
        expect(tags.next()).toBe(true);
        expect(tags.updateInterval).toBeDefined();
    });

    it('should next hide when resize', () => {
        window.document.body.style = 'width:150px';
        fixture.detectChanges();
        tags.ngAfterViewChecked();

        fixture.detectChanges();

        const { scrollLeft: scrollLeft } = tags.tablist().nativeElement;
        expect(scrollLeft).toBe(0);
        expect(tags.prev()).toBe(false);
        expect(tags.next()).toBe(true);

        window.document.body.style = 'width:300px';

        fixture.detectChanges();

        const { scrollLeft: scrollLeft2 } = tags.tablist().nativeElement;
        expect(scrollLeft2).toBe(0);
        expect(tags.prev()).toBe(false);
        expect(tags.next()).toBe(false);
    });

    it('should prev hide when resize', () => {
        window.document.body.style = 'width:150px';
        fixture.detectChanges();
        tags.ngAfterViewChecked();

        tags.moveTabs(true, 300);
        fixture.detectChanges();

        const { scrollLeft: scrollLeft } = tags.tablist().nativeElement;
        expect(scrollLeft).toBe(48);
        expect(tags.prev()).toBe(true);
        expect(tags.next()).toBe(false);

        window.document.body.style = 'width:300px';

        fixture.detectChanges();

        const { scrollLeft: scrollLeft2 } = tags.tablist().nativeElement;
        expect(scrollLeft2).toBe(0);
        expect(tags.prev()).toBe(false);
        expect(tags.next()).toBe(false);
    });
});
