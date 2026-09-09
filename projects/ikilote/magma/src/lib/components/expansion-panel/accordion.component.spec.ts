import { ChangeDetectionStrategy, Component, viewChildren } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaAccordion } from './accordion.component';
import { MagmaExpansionPanel } from './expansion-panel.component';
import { MagmaExpansionPanelModule } from './expansion-panel.module';

// ── Shared host helpers ───────────────────────────────────────────────────────

@Component({
    template: `
        <mg-accordion [multiple]="multiple">
            <mg-expansion-panel>
                <mg-expansion-header>Panel 1</mg-expansion-header>
                <mg-expansion-content>Content 1</mg-expansion-content>
            </mg-expansion-panel>
            <mg-expansion-panel>
                <mg-expansion-header>Panel 2</mg-expansion-header>
                <mg-expansion-content>Content 2</mg-expansion-content>
            </mg-expansion-panel>
            <mg-expansion-panel>
                <mg-expansion-header>Panel 3</mg-expansion-header>
                <mg-expansion-content>Content 3</mg-expansion-content>
            </mg-expansion-panel>
        </mg-accordion>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaExpansionPanelModule],
})
class TestHostComponent {
    multiple = false;

    readonly panelRefs = viewChildren(MagmaExpansionPanel);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Click the summary of panel at index `i` and trigger change detection. */
function clickPanel(fixture: ComponentFixture<TestHostComponent>, index: number): void {
    const summaries = fixture.debugElement.queryAll(By.css('summary'));
    summaries[index].nativeElement.click();
    fixture.changeDetectorRef.detectChanges();
}

function openStates(fixture: ComponentFixture<TestHostComponent>): boolean[] {
    return fixture.debugElement.queryAll(By.css('details')).map(d => d.nativeElement.hasAttribute('open'));
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('MagmaAccordion', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let host: TestHostComponent;
    let accordion: MagmaAccordion;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        host = fixture.componentInstance;
        accordion = fixture.debugElement.query(By.directive(MagmaAccordion)).componentInstance;

        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        fixture?.destroy();
        TestBed.resetTestingModule();
    });

    // ── Instantiation ─────────────────────────────────────────────────────────

    it('should create', () => {
        expect(accordion).toBeTruthy();
    });

    it('should have role="group" on the host element', () => {
        const el: HTMLElement = fixture.debugElement.query(By.directive(MagmaAccordion)).nativeElement;
        expect(el.getAttribute('role')).toBe('group');
    });

    it('should discover all 3 child panels via contentChildren', () => {
        expect(accordion.panels().length).toBe(3);
    });

    it('should render a <ng-content /> — no extra wrapper element', () => {
        const panelEls = fixture.debugElement.queryAll(By.directive(MagmaExpansionPanel));
        expect(panelEls.length).toBe(3);
    });

    it('should start with all panels closed', () => {
        expect(openStates(fixture)).toEqual([false, false, false]);
    });

    // ── exclusive (default, multiple=false) ───────────────────────────────────

    describe('exclusive mode (default, multiple=false)', () => {
        it('should open a panel when clicked', () => {
            clickPanel(fixture, 0);
            expect(openStates(fixture)[0]).toBe(true);
        });

        it('should close other panels when one is opened', () => {
            clickPanel(fixture, 0);
            clickPanel(fixture, 1);

            expect(openStates(fixture)).toEqual([false, true, false]);
        });

        it('should close other panels when third panel is opened', () => {
            clickPanel(fixture, 0);
            clickPanel(fixture, 2);

            expect(openStates(fixture)).toEqual([false, false, true]);
        });

        it('should allow toggling the active panel closed', () => {
            clickPanel(fixture, 1);
            expect(openStates(fixture)[1]).toBe(true);

            clickPanel(fixture, 1);
            expect(openStates(fixture)[1]).toBe(false);
        });

        it('should keep exactly one panel open after several switches', () => {
            clickPanel(fixture, 0);
            clickPanel(fixture, 1);
            clickPanel(fixture, 2);

            const states = openStates(fixture);
            expect(states.filter(Boolean).length).toBe(1);
            expect(states[2]).toBe(true);
        });
    });

    // ── multiple = true ───────────────────────────────────────────────────────

    describe('multiple mode', () => {
        beforeEach(() => {
            host.multiple = true;
            fixture.changeDetectorRef.detectChanges();
        });

        it('should allow multiple panels to be open simultaneously', () => {
            clickPanel(fixture, 0);
            clickPanel(fixture, 1);

            expect(openStates(fixture)).toEqual([true, true, false]);
        });

        it('should allow all panels to be open', () => {
            clickPanel(fixture, 0);
            clickPanel(fixture, 1);
            clickPanel(fixture, 2);

            expect(openStates(fixture)).toEqual([true, true, true]);
        });

        it('should close an individual panel independently', () => {
            clickPanel(fixture, 0);
            clickPanel(fixture, 1);
            clickPanel(fixture, 0); // close first

            expect(openStates(fixture)).toEqual([false, true, false]);
        });
    });

    // ── multiple input ────────────────────────────────────────────────────────

    describe('multiple input', () => {
        it('should default to false', () => {
            expect(accordion.multiple()).toBe(false);
        });

        it('should reflect true when set', () => {
            host.multiple = true;
            fixture.changeDetectorRef.detectChanges();
            expect(accordion.multiple()).toBe(true);
        });
    });

    // ── closeOthers integration ───────────────────────────────────────────────

    describe('closeOthers (via panel.update)', () => {
        it('should call open.set(false) on panels that are not the active one', () => {
            const panels = accordion.panels();
            const setSpies = panels.map(p => vi.spyOn(p.open, 'set'));

            // Open panel 0 programmatically by firing its update event
            panels[0].update.emit({ open: true, component: panels[0] });

            // Panels 1 and 2 should have been forced closed
            expect(setSpies[1]).toHaveBeenCalledWith(false);
            expect(setSpies[2]).toHaveBeenCalledWith(false);
            // Panel 0 itself should NOT have been touched by closeOthers
            expect(setSpies[0]).not.toHaveBeenCalled();
        });

        it('should not close others when update event carries open=false', () => {
            const panels = accordion.panels();
            const setSpies = panels.map(p => vi.spyOn(p.open, 'set'));

            panels[0].update.emit({ open: false, component: panels[0] });

            expect(setSpies[1]).not.toHaveBeenCalled();
            expect(setSpies[2]).not.toHaveBeenCalled();
        });

        it('should not close others in multiple mode even when open=true', () => {
            host.multiple = true;
            fixture.changeDetectorRef.detectChanges();

            const panels = accordion.panels();
            const setSpies = panels.map(p => vi.spyOn(p.open, 'set'));

            panels[0].update.emit({ open: true, component: panels[0] });

            expect(setSpies[1]).not.toHaveBeenCalled();
            expect(setSpies[2]).not.toHaveBeenCalled();
        });
    });
});
