import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaTabContent } from './tab-content.component';

describe('MagmaTabContent', () => {
    let fixture: ComponentFixture<MagmaTabContent>;
    let component: MagmaTabContent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();

        fixture = TestBed.createComponent(MagmaTabContent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('id', 'tab-1');
        fixture.detectChanges();
    });

    it('should not display content when selected is false', () => {
        fixture.componentRef.setInput('selected', false);

        const content = fixture.debugElement.query(By.css('.content'));

        expect(content).toBeNull();
    });

    it('should have selected set to false by default', () => {
        expect(component.selected()).toBeFalse();
    });

    it('should update selected state', () => {
        component.selected.set(true);
        fixture.detectChanges();

        expect(component.selected()).toBeTrue();
    });

    it('should set the correct id attribute', () => {
        fixture.componentRef.setInput('id', 'tab-1');
        fixture.detectChanges();

        expect(fixture.nativeElement.getAttribute('id')).toBe('tab-content-tab-1');
    });
});

@Component({
    template: `
        <mg-tab-content [id]="id" [selected]="isSelected">
            <div class="content">Content</div>
        </mg-tab-content>
    `,
    imports: [MagmaTabContent],
})
class TestHostComponent {
    id = 'tab-1';
    isSelected = false;
}

describe('MagmaTabContent', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        hostFixture = TestBed.createComponent(TestHostComponent);
    });

    it('should not display content when selected is false', () => {
        hostFixture.componentInstance.isSelected = false;
        hostFixture.detectChanges();

        const content = hostFixture.debugElement.query(By.css('.content'));
        expect(content).toBeNull();
    });

    it('should project content when selected is true', () => {
        hostFixture.componentInstance.isSelected = true;
        hostFixture.detectChanges();

        const content = hostFixture.debugElement.query(By.css('.content'));
        expect(content).toBeTruthy();
        expect(content.nativeElement.textContent).toContain('Content');
    });
});
