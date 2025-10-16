import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

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

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent, MagmaTabs, MagmaTabTitle, MagmaTabContent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        testHost = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should display the content of the first tab by default', () => {
        const contents = testHost.tabs().content();
        expect(contents[0].selected()).toBeTrue();
        expect(contents[1].selected()).toBeFalse();
    });
});
