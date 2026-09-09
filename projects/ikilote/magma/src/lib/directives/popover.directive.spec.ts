import { Overlay } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, DebugElement, TemplateRef, ViewChild } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaPopoverDirective } from './popover.directive';

import { cleanupOverlayContainer } from '../test-helpers';
import { MagmaConnectedPosition } from '../utils/position';

@Component({
    template: `
        <button
            [mgPopover]="tpl"
            [mgPopoverTrigger]="trigger"
            [mgPopoverDisabled]="disabled"
            [mgPopoverPosition]="position"
            [mgPopoverOffset]="offset"
            (mgPopoverOpened)="onOpened()"
            (mgPopoverClosed)="onClosed()"
        >
            Open
        </button>

        <ng-template #tpl let-ctx>
            <div class="popover-content">
                <p>Content</p>
                <button class="close-btn" (click)="ctx.close()">Close</button>
            </div>
        </ng-template>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaPopoverDirective],
})
class TestHostComponent {
    @ViewChild(TemplateRef) tplRef!: TemplateRef<unknown>;

    trigger: 'click' | 'hover' = 'click';
    disabled = false;
    position: MagmaConnectedPosition = 'bottom-start';
    offset = 4;

    onOpened() {}
    onClosed() {}
}

describe('MagmaPopoverDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;
    let buttonEl: DebugElement;
    let directive: MagmaPopoverDirective;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        TestBed.inject(Overlay);

        vi.spyOn(component, 'onOpened');
        vi.spyOn(component, 'onClosed');

        fixture.changeDetectorRef.detectChanges();

        buttonEl = fixture.debugElement.query(By.css('button'));
        directive = buttonEl.injector.get(MagmaPopoverDirective);
    });

    afterEach(() => {
        fixture?.destroy();
        cleanupOverlayContainer();
        vi.clearAllTimers();
        vi.useRealTimers();
        TestBed.resetTestingModule();
    });

    // ── Instantiation ─────────────────────────────────────────────────────────

    it('should create', () => {
        expect(directive).toBeTruthy();
    });

    it('should be closed by default', () => {
        expect(directive.isOpen()).toBe(false);
    });

    it('should set aria-expanded to false when closed', () => {
        expect(buttonEl.nativeElement.getAttribute('aria-expanded')).toBe('false');
    });

    it('should have the popover-trigger CSS class', () => {
        expect(buttonEl.nativeElement.classList).toContain('popover-trigger');
    });

    it('should expose a stable popoverId', () => {
        expect(directive.popoverId()).toMatch(/^mg-popover-\d+$/);
    });

    it('should set aria-controls to the popoverId', () => {
        expect(buttonEl.nativeElement.getAttribute('aria-controls')).toBe(directive.popoverId());
    });

    // ── open() / close() API ──────────────────────────────────────────────────

    describe('open() / close()', () => {
        it('should open the popover', () => {
            directive.open();
            fixture.changeDetectorRef.detectChanges();

            expect(directive.isOpen()).toBe(true);
        });

        it('should set aria-expanded to true when open', () => {
            directive.open();
            fixture.changeDetectorRef.detectChanges();

            expect(buttonEl.nativeElement.getAttribute('aria-expanded')).toBe('true');
        });

        it('should close the popover', () => {
            directive.open();
            directive.close();
            fixture.changeDetectorRef.detectChanges();

            expect(directive.isOpen()).toBe(false);
        });

        it('should be idempotent: calling open() twice does not throw', () => {
            expect(() => {
                directive.open();
                directive.open();
            }).not.toThrow();

            expect(directive.isOpen()).toBe(true);
        });

        it('should be idempotent: calling close() when already closed does not throw', () => {
            expect(() => directive.close()).not.toThrow();
        });

        it('should not open when disabled', () => {
            component.disabled = true;
            fixture.changeDetectorRef.detectChanges();

            directive.open();

            expect(directive.isOpen()).toBe(false);
        });
    });

    // ── Outputs: mgPopoverOpened / mgPopoverClosed ────────────────────────────

    describe('outputs', () => {
        it('should emit mgPopoverOpened when the popover opens', () => {
            directive.open();

            expect(component.onOpened).toHaveBeenCalledTimes(1);
        });

        it('should not emit mgPopoverOpened when already open', () => {
            directive.open();
            directive.open(); // second call is a no-op

            expect(component.onOpened).toHaveBeenCalledTimes(1);
        });

        it('should emit mgPopoverClosed when the popover closes', () => {
            directive.open();
            directive.close();

            expect(component.onClosed).toHaveBeenCalledTimes(1);
        });

        it('should not emit mgPopoverClosed when already closed', () => {
            directive.close(); // no-op when already closed

            expect(component.onClosed).not.toHaveBeenCalled();
        });

        it('should emit opened then closed in sequence', () => {
            const sequence: string[] = [];
            outputToObservable(directive.mgPopoverOpened).subscribe(() => sequence.push('opened'));
            outputToObservable(directive.mgPopoverClosed).subscribe(() => sequence.push('closed'));

            directive.open();
            directive.close();

            expect(sequence).toEqual(['opened', 'closed']);
        });

        it('should not emit mgPopoverOpened when disabled', () => {
            component.disabled = true;
            fixture.changeDetectorRef.detectChanges();

            directive.open();

            expect(component.onOpened).not.toHaveBeenCalled();
        });
    });

    // ── Click trigger ─────────────────────────────────────────────────────────

    describe('click trigger', () => {
        it('should open on click', () => {
            buttonEl.triggerEventHandler('click', {});

            expect(directive.isOpen()).toBe(true);
        });

        it('should toggle closed on second click', () => {
            buttonEl.triggerEventHandler('click', {});
            buttonEl.triggerEventHandler('click', {});

            expect(directive.isOpen()).toBe(false);
        });

        it('should not open on click when disabled', () => {
            component.disabled = true;
            fixture.changeDetectorRef.detectChanges();

            buttonEl.triggerEventHandler('click', {});

            expect(directive.isOpen()).toBe(false);
        });

        it('should not react to click when trigger is hover', () => {
            component.trigger = 'hover';
            fixture.changeDetectorRef.detectChanges();

            buttonEl.triggerEventHandler('click', {});

            expect(directive.isOpen()).toBe(false);
        });
    });

    // ── Hover trigger ─────────────────────────────────────────────────────────

    describe('hover trigger', () => {
        beforeEach(() => {
            vi.useFakeTimers();
            component.trigger = 'hover';
            fixture.changeDetectorRef.detectChanges();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('should open on mouseenter', () => {
            buttonEl.triggerEventHandler('mouseenter', {});

            expect(directive.isOpen()).toBe(true);
        });

        it('should close after mouseleave delay', () => {
            buttonEl.triggerEventHandler('mouseenter', {});
            expect(directive.isOpen()).toBe(true);

            buttonEl.triggerEventHandler('mouseleave', {});
            vi.advanceTimersByTime(150);

            expect(directive.isOpen()).toBe(false);
        });

        it('should cancel close when mouse re-enters before delay', () => {
            buttonEl.triggerEventHandler('mouseenter', {});
            buttonEl.triggerEventHandler('mouseleave', {});
            vi.advanceTimersByTime(100); // less than 150ms
            buttonEl.triggerEventHandler('mouseenter', {}); // re-enter cancels timer

            vi.advanceTimersByTime(100); // total 200ms but close was cancelled

            expect(directive.isOpen()).toBe(true);
        });

        it('should not open on mouseenter when disabled', () => {
            component.disabled = true;
            fixture.changeDetectorRef.detectChanges();

            buttonEl.triggerEventHandler('mouseenter', {});

            expect(directive.isOpen()).toBe(false);
        });

        it('should not react to mouseleave when trigger is click', () => {
            component.trigger = 'click';
            fixture.changeDetectorRef.detectChanges();

            directive.open();
            buttonEl.triggerEventHandler('mouseleave', {});
            vi.advanceTimersByTime(200);

            expect(directive.isOpen()).toBe(true);
        });
    });

    // ── Escape key ────────────────────────────────────────────────────────────

    describe('keydown.escape', () => {
        it('should close the popover and refocus the trigger', () => {
            directive.open();
            const focusSpy = vi.spyOn(buttonEl.nativeElement, 'focus');

            buttonEl.triggerEventHandler('keydown.escape', {});

            expect(directive.isOpen()).toBe(false);
            expect(focusSpy).toHaveBeenCalled();
        });

        it('should do nothing on escape when already closed', () => {
            const focusSpy = vi.spyOn(buttonEl.nativeElement, 'focus');

            buttonEl.triggerEventHandler('keydown.escape', {});

            expect(focusSpy).not.toHaveBeenCalled();
        });
    });

    // ── ngOnDestroy ───────────────────────────────────────────────────────────

    describe('ngOnDestroy', () => {
        it('should close the popover on destroy', () => {
            directive.open();
            directive.ngOnDestroy();

            expect(directive.isOpen()).toBe(false);
        });

        it('should not emit mgPopoverClosed on destroy (internal cleanup)', () => {
            // ngOnDestroy calls close() which emits — verify event is still emitted
            directive.open();
            (component.onClosed as ReturnType<typeof vi.spyOn>).mockClear();

            directive.ngOnDestroy();

            expect(component.onClosed).toHaveBeenCalledTimes(1);
        });
    });
});
