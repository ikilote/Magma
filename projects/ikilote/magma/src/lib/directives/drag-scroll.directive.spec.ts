// drag-scroll.directive.spec.ts
import { ChangeDetectionStrategy, Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaDragScrollAxis, MagmaDragScrollDirective } from './drag-scroll.directive';

@Component({
    template: `
        <div
            class="scroller"
            mgDragScroll
            [mgDragScrollDisabled]="disabled"
            [mgDragScrollAxis]="axis"
            [mgDragScrollThreshold]="threshold"
            [mgDragScrollCursor]="cursor"
            [mgDragScrollIgnore]="ignore"
            (dragStart)="onStart()"
            (dragEnd)="onEnd()"
        >
            <span class="label">draggable background</span>
            <button type="button">a button</button>
            <div class="slider">custom slider</div>
            <div data-no-drag-scroll class="opt-out">opt out</div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaDragScrollDirective],
})
class TestComponent {
    disabled = false;
    axis: MagmaDragScrollAxis = 'both';
    threshold = 5;
    cursor = false;
    ignore: string | undefined = undefined;

    startCount = 0;
    endCount = 0;

    onStart(): void {
        this.startCount++;
    }
    onEnd(): void {
        this.endCount++;
    }
}

/** Build a PointerEvent with the fields the directive reads. */
function pointer(
    type: string,
    opts: Partial<{ clientX: number; clientY: number; button: number; isPrimary: boolean; pointerId: number }> = {},
): PointerEvent {
    const event = new Event(type, { bubbles: true, cancelable: true }) as PointerEvent;
    Object.assign(event, {
        clientX: opts.clientX ?? 0,
        clientY: opts.clientY ?? 0,
        button: opts.button ?? 0,
        isPrimary: opts.isPrimary ?? true,
        pointerId: opts.pointerId ?? 1,
    });
    return event;
}

describe('MagmaDragScrollDirective', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let host: DebugElement;
    let el: HTMLElement;
    let directive: MagmaDragScrollDirective;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.changeDetectorRef.detectChanges();

        host = fixture.debugElement.query(By.directive(MagmaDragScrollDirective));
        el = host.nativeElement as HTMLElement;
        directive = host.injector.get(MagmaDragScrollDirective);

        // No pointer capture in the test env; stub so calls don't throw.
        el.setPointerCapture = vi.fn();
        el.releasePointerCapture = vi.fn();

        // The real browser clamps scrollLeft/scrollTop to the scrollable range,
        // which is 0 here (no overflowing content). Back them with plain fields
        // so the directive's arithmetic is observable without a layout.
        let sl = 0;
        let st = 0;
        Object.defineProperty(el, 'scrollLeft', {
            configurable: true,
            get: () => sl,
            set: v => (sl = v),
        });
        Object.defineProperty(el, 'scrollTop', {
            configurable: true,
            get: () => st,
            set: v => (st = v),
        });
    });

    afterEach(() => {
        fixture?.destroy();
        vi.restoreAllMocks();
        TestBed.resetTestingModule();
    });

    /** Press, move past the threshold, then release — a full drag gesture. */
    function fullDrag(dx: number, dy: number, pointerId = 1): void {
        directive.onPointerDown(pointer('pointerdown', { clientX: 0, clientY: 0, pointerId }));
        directive.onPointerMove(pointer('pointermove', { clientX: dx, clientY: dy, pointerId }));
        directive.onPointerUp(pointer('pointerup', { clientX: dx, clientY: dy, pointerId }));
    }

    describe('host classes', () => {
        it('applies mg-drag-scroll when enabled', () => {
            expect(el.classList.contains('mg-drag-scroll')).toBe(true);
            expect(el.classList.contains('mg-drag-scroll__pan-x')).toBe(false);
            expect(el.classList.contains('mg-drag-scroll__pan-y')).toBe(false);
        });

        it('removes classes when disabled', () => {
            component.disabled = true;
            fixture.changeDetectorRef.detectChanges();
            expect(el.classList.contains('mg-drag-scroll')).toBe(false);
        });

        it('sets pan-x / pan-y from the axis', () => {
            component.axis = 'x';
            fixture.changeDetectorRef.detectChanges();
            expect(el.classList.contains('mg-drag-scroll__pan-x')).toBe(true);

            component.axis = 'y';
            fixture.changeDetectorRef.detectChanges();
            expect(el.classList.contains('mg-drag-scroll__pan-y')).toBe(true);
        });

        it('toggles the cursor class with mgDragScrollCursor', () => {
            expect(el.classList.contains('mg-drag-scroll__cursor')).toBe(false);
            component.cursor = true;
            fixture.changeDetectorRef.detectChanges();
            expect(el.classList.contains('mg-drag-scroll__cursor')).toBe(true);
        });

        it('toggles the grabbing class while dragging', () => {
            directive.onPointerDown(pointer('pointerdown', { clientX: 0, clientY: 0 }));
            directive.onPointerMove(pointer('pointermove', { clientX: 20, clientY: 0 }));
            fixture.changeDetectorRef.detectChanges();
            expect(el.classList.contains('mg-drag-scroll__grabbing')).toBe(true);

            directive.onPointerUp(pointer('pointerup', { clientX: 20, clientY: 0 }));
            fixture.changeDetectorRef.detectChanges();
            expect(el.classList.contains('mg-drag-scroll__grabbing')).toBe(false);
        });
    });

    describe('drag gesture', () => {
        it('does not start a drag below the threshold', () => {
            directive.onPointerDown(pointer('pointerdown', { clientX: 0, clientY: 0 }));
            directive.onPointerMove(pointer('pointermove', { clientX: 3, clientY: 0 }));
            expect(directive.dragging()).toBe(false);
            expect(component.startCount).toBe(0);
        });

        it('starts a drag once past the threshold and emits dragStart', () => {
            directive.onPointerDown(pointer('pointerdown', { clientX: 0, clientY: 0 }));
            directive.onPointerMove(pointer('pointermove', { clientX: 20, clientY: 0 }));
            expect(directive.dragging()).toBe(true);
            expect(component.startCount).toBe(1);
            expect(el.setPointerCapture).toHaveBeenCalledWith(1);
        });

        it('translates the move into scrollLeft / scrollTop (content follows cursor)', () => {
            el.scrollLeft = 100;
            el.scrollTop = 100;
            directive.onPointerDown(pointer('pointerdown', { clientX: 0, clientY: 0 }));
            directive.onPointerMove(pointer('pointermove', { clientX: 30, clientY: 40 }));
            // scroll decreases as the pointer moves in the positive direction
            expect(el.scrollLeft).toBe(70);
            expect(el.scrollTop).toBe(60);
        });

        it('only scrolls the allowed axis (x)', () => {
            component.axis = 'x';
            fixture.changeDetectorRef.detectChanges();
            el.scrollLeft = 50;
            el.scrollTop = 50;
            directive.onPointerDown(pointer('pointerdown', { clientX: 0, clientY: 0 }));
            directive.onPointerMove(pointer('pointermove', { clientX: 30, clientY: 30 }));
            expect(el.scrollLeft).toBe(20);
            expect(el.scrollTop).toBe(50); // unchanged on y
        });

        it('only scrolls the allowed axis (y) and uses the y threshold', () => {
            component.axis = 'y';
            fixture.changeDetectorRef.detectChanges();
            el.scrollLeft = 50;
            el.scrollTop = 50;
            directive.onPointerDown(pointer('pointerdown', { clientX: 0, clientY: 0 }));
            directive.onPointerMove(pointer('pointermove', { clientX: 30, clientY: 30 }));
            expect(directive.dragging()).toBe(true);
            expect(el.scrollTop).toBe(20);
            expect(el.scrollLeft).toBe(50); // unchanged on x
        });

        it('keeps scrolling across successive moves once dragging', () => {
            directive.onPointerDown(pointer('pointerdown', { clientX: 0, clientY: 0 }));
            directive.onPointerMove(pointer('pointermove', { clientX: 20, clientY: 0 }));
            expect(directive.dragging()).toBe(true);
            el.scrollLeft = 0;
            directive.onPointerMove(pointer('pointermove', { clientX: 50, clientY: 0 }));
            expect(el.scrollLeft).toBe(-50);
        });

        it('does not emit dragEnd on a pointerup that never became a drag', () => {
            directive.onPointerDown(pointer('pointerdown', { clientX: 0, clientY: 0 }));
            directive.onPointerUp(pointer('pointerup', { clientX: 0, clientY: 0 }));
            expect(component.endCount).toBe(0);
            expect(directive.dragging()).toBe(false);
        });

        it('emits dragEnd and releases capture on pointerup', () => {
            fullDrag(20, 0);
            expect(component.endCount).toBe(1);
            expect(el.releasePointerCapture).toHaveBeenCalledWith(1);
            expect(directive.dragging()).toBe(false);
        });

        it('ends the drag on pointercancel', () => {
            directive.onPointerDown(pointer('pointerdown', { clientX: 0, clientY: 0 }));
            directive.onPointerMove(pointer('pointermove', { clientX: 20, clientY: 0 }));
            directive.onPointerCancel(pointer('pointercancel', { clientX: 20, clientY: 0 }));
            expect(directive.dragging()).toBe(false);
            expect(component.endCount).toBe(1);
        });

        it('ignores a move from a different pointer id', () => {
            directive.onPointerDown(pointer('pointerdown', { clientX: 0, clientY: 0, pointerId: 1 }));
            directive.onPointerMove(pointer('pointermove', { clientX: 20, clientY: 0, pointerId: 2 }));
            expect(directive.dragging()).toBe(false);
        });

        it('ignores pointerup from a different pointer id', () => {
            directive.onPointerDown(pointer('pointerdown', { clientX: 0, clientY: 0, pointerId: 1 }));
            directive.onPointerMove(pointer('pointermove', { clientX: 20, clientY: 0, pointerId: 1 }));
            directive.onPointerUp(pointer('pointerup', { clientX: 20, clientY: 0, pointerId: 9 }));
            // still dragging because the up was for another pointer
            expect(directive.dragging()).toBe(true);
            expect(component.endCount).toBe(0);
        });
    });

    describe('host listeners (dispatched events)', () => {
        it('wires the pointerdown handler through the host', () => {
            const spy = vi.spyOn(directive, 'onPointerDown');
            el.dispatchEvent(pointer('pointerdown', { clientX: 0, clientY: 0 }));
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('activation guards', () => {
        it('does not arm a press when disabled', () => {
            component.disabled = true;
            fixture.changeDetectorRef.detectChanges();
            directive.onPointerDown(pointer('pointerdown', { clientX: 0, clientY: 0 }));
            directive.onPointerMove(pointer('pointermove', { clientX: 20, clientY: 0 }));
            expect(directive.dragging()).toBe(false);
        });

        it('ignores non-left button', () => {
            directive.onPointerDown(pointer('pointerdown', { button: 1 }));
            directive.onPointerMove(pointer('pointermove', { clientX: 20 }));
            expect(directive.dragging()).toBe(false);
        });

        it('ignores non-primary pointer', () => {
            directive.onPointerDown(pointer('pointerdown', { isPrimary: false }));
            directive.onPointerMove(pointer('pointermove', { clientX: 20 }));
            expect(directive.dragging()).toBe(false);
        });
    });

    describe('interactive-target exclusion', () => {
        function pressOn(selector: string): void {
            const target = el.querySelector(selector) as HTMLElement;
            const event = pointer('pointerdown', { clientX: 0, clientY: 0 });
            Object.defineProperty(event, 'target', { value: target });
            directive.onPointerDown(event);
            directive.onPointerMove(pointer('pointermove', { clientX: 20, clientY: 0 }));
        }

        it('does not drag when pressing a button', () => {
            pressOn('button');
            expect(directive.dragging()).toBe(false);
        });

        it('does not drag when pressing a data-no-drag-scroll element', () => {
            pressOn('.opt-out');
            expect(directive.dragging()).toBe(false);
        });

        it('does drag when pressing a plain span background', () => {
            pressOn('.label');
            expect(directive.dragging()).toBe(true);
        });

        it('honours the mgDragScrollIgnore selector', () => {
            component.ignore = '.slider';
            fixture.changeDetectorRef.detectChanges();
            pressOn('.slider');
            expect(directive.dragging()).toBe(false);
        });

        it('ignores an invalid ignore selector instead of throwing', () => {
            component.ignore = ':::not-valid:::';
            fixture.changeDetectorRef.detectChanges();
            expect(() => pressOn('.label')).not.toThrow();
            expect(directive.dragging()).toBe(true);
        });
    });

    describe('click suppression', () => {
        it('swallows the click terminating a real drag', () => {
            fullDrag(20, 0);
            const click = new MouseEvent('click', { bubbles: true, cancelable: true });
            const prevent = vi.spyOn(click, 'preventDefault');
            const stop = vi.spyOn(click, 'stopPropagation');
            directive.onClick(click);
            expect(prevent).toHaveBeenCalled();
            expect(stop).toHaveBeenCalled();
        });

        it('leaves a normal click untouched', () => {
            const click = new MouseEvent('click', { bubbles: true, cancelable: true });
            const prevent = vi.spyOn(click, 'preventDefault');
            directive.onClick(click);
            expect(prevent).not.toHaveBeenCalled();
        });
    });

    describe('ngOnDestroy', () => {
        it('releases an active pointer capture', () => {
            directive.onPointerDown(pointer('pointerdown', { clientX: 0, clientY: 0 }));
            directive.onPointerMove(pointer('pointermove', { clientX: 20, clientY: 0 }));
            directive.ngOnDestroy();
            expect(el.releasePointerCapture).toHaveBeenCalledWith(1);
        });

        it('does nothing when no capture is held', () => {
            expect(() => directive.ngOnDestroy()).not.toThrow();
        });
    });
});
