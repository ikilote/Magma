import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaExpansionPanel } from './expansion-panel.component';
import { MagmaExpansionPanelModule } from './expansion-panel.module';

@Component({
    template: `
        <mg-expansion-panel [open]="initialOpen" [disabled]="initialDisabled">
            <mg-expansion-header>Header</mg-expansion-header>
            <mg-expansion-content>Content</mg-expansion-content>
        </mg-expansion-panel>
    `,
    imports: [MagmaExpansionPanelModule],
})
class TestHostComponent {
    initialOpen = false;
    initialDisabled = false;
}

describe('MagmaExpansionPanel', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: MagmaExpansionPanel;
    let details: DebugElement;
    let summary: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.debugElement.query(By.directive(MagmaExpansionPanel)).componentInstance;
        fixture.changeDetectorRef.detectChanges();

        details = fixture.debugElement.query(By.css('details'));
        summary = fixture.debugElement.query(By.css('summary'));
    });

    afterEach(() => {
        fixture?.destroy();
    });

    it('should set the "open" attribute on <details> when open is true', () => {
        fixture.componentInstance.initialOpen = true;
        fixture.changeDetectorRef.detectChanges();
        expect(details.nativeElement.hasAttribute('open')).toBe(true);
    });

    it('should not set the "open" attribute on <details> when open is false', () => {
        fixture.componentInstance.initialOpen = false;
        fixture.changeDetectorRef.detectChanges();
        expect(details.nativeElement.hasAttribute('open')).toBe(false);
    });

    it('should set the "disabled" attribute and tabIndex=-1 on <summary> when disabled is true', () => {
        fixture.componentInstance.initialDisabled = true;
        fixture.changeDetectorRef.detectChanges();
        expect(summary.nativeElement.hasAttribute('disabled')).toBe(true);
        expect(summary.nativeElement.tabIndex).toBe(-1);
    });

    it('should not set the "disabled" attribute and tabIndex=0 on <summary> when disabled is false', () => {
        fixture.componentInstance.initialDisabled = false;
        fixture.changeDetectorRef.detectChanges();
        expect(summary.nativeElement.hasAttribute('disabled')).toBe(false);
        expect(summary.nativeElement.tabIndex).toBe(0);
    });

    it('should project mg-expansion-header inside <summary>', () => {
        const header = fixture.debugElement.query(By.css('summary .summary-content mg-expansion-header'));
        expect(header).toBeTruthy();
        expect(header.nativeElement.textContent).toContain('Header');
    });

    it('should project mg-expansion-content inside .detail-content', () => {
        const content = fixture.debugElement.query(By.css('.detail-content mg-expansion-content'));
        expect(content).toBeTruthy();
        expect(content.nativeElement.textContent).toContain('Content');
    });

    it('should emit update event with correct open state when clicking <summary>', () => {
        vi.spyOn(component.update, 'emit');
        summary.triggerEventHandler('click');
        fixture.changeDetectorRef.detectChanges();

        expect(component.update.emit).toHaveBeenCalledWith({
            open: true,
            component: component,
        });
    });

    it('should toggle the open state when clicking <summary>', () => {
        expect(details.nativeElement.hasAttribute('open')).toBe(false);

        summary.nativeElement.click();
        fixture.changeDetectorRef.detectChanges();
        expect(details.nativeElement.hasAttribute('open')).toBe(true);

        summary.nativeElement.click();
        fixture.changeDetectorRef.detectChanges();
        expect(details.nativeElement.hasAttribute('open')).toBe(false);
    });
});
