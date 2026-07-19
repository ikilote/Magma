import { CdkDrag } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import type { Mocked } from 'vitest';

import { ResizeDirection } from './resizer';
import { MagmaResize } from './resizer.directive';

// Host component mock for testing purposes
@Component({
    template: `
        <div style="position: relative;">
            <div
                style="width: 100px; height: 100px; position: absolute;"
                [resizer]="mockResizer"
                [resizerHost]="mockHost"
                [resizerDisabled]="isDisabled"
                [resizerInit]="{ x: 0, y: 0 }"
            ></div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaResize],
})
class TestComponent {
    isDisabled = false;
    mockResizer = {
        x: [0, 10],
        y: [0, 10],
        animation: true,
        update: vi.fn(),
    } as any;

    mockHost = {
        elementSize: 10,
        widthElementNumber: 100,
        heightElementNumber: 100,
    } as any;
}

describe('MagmaResize Directive', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let directiveEl: DebugElement;
    let directiveInstance: MagmaResize;
    let cdkDragSpy: Mocked<CdkDrag>;

    beforeEach(async () => {
        // Create a spy for the optional CdkDrag dependency
        cdkDragSpy = {
            disabled: vi.fn().mockName('CdkDrag.disabled'),
        } as unknown as Mocked<CdkDrag>;

        await TestBed.configureTestingModule({
            imports: [TestComponent],
            providers: [{ provide: CdkDrag, useValue: cdkDragSpy }],
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        directiveEl = fixture.debugElement.query(By.directive(MagmaResize));
        directiveInstance = directiveEl.injector.get(MagmaResize);

        vi.useFakeTimers();
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(async () => {
        fixture?.destroy();
        vi.clearAllTimers();
        vi.useRealTimers();
        TestBed.resetTestingModule();
    });

    it('should create an instance', () => {
        expect(directiveInstance).toBeTruthy();
    });

    // --- EDGE DETECTION TESTS ---

    describe('Edge Detection', () => {
        // Component width is 100px. (which is < 5px threshold)
        [
            { x: 2, y: 15, resize: 'left', class: 'ew-resize' },
            { x: 2, y: 2, resize: 'top-left', class: 'nw-resize' },
            { x: 2, y: 98, resize: 'bottom-left', class: 'ne-resize' },
            { x: 98, y: 50, resize: 'right', class: 'ew-resize' },
            { x: 98, y: 2, resize: 'top-right', class: 'ne-resize' },
            { x: 98, y: 98, resize: 'bottom-right', class: 'nw-resize' },
            { x: 50, y: 2, resize: 'top', class: 'ns-resize' },
            { x: 50, y: 98, resize: 'bottom', class: 'ns-resize' },
        ].forEach(data => {
            it(`should detect the ${data.resize} edge`, () => {
                const rect = directiveEl.nativeElement.getBoundingClientRect();
                const event = new MouseEvent('mousemove', { clientX: rect.left + data.x, clientY: rect.top + data.y });
                directiveEl.nativeElement.dispatchEvent(event);
                fixture.changeDetectorRef.detectChanges();

                expect(directiveInstance.resize).toBe(data.resize as ResizeDirection);
                expect(directiveEl.nativeElement.classList.contains(data.class)).toBe(true);
                expect(cdkDragSpy.disabled).toBe(true);
            });
        });

        it('should reset resize state when mouse is in the center', () => {
            const rect = directiveEl.nativeElement.getBoundingClientRect();
            const event = new MouseEvent('mousemove', { clientX: rect.left + 50, clientY: rect.top + 50 });
            directiveEl.nativeElement.dispatchEvent(event);
            fixture.changeDetectorRef.detectChanges();

            expect(directiveInstance.resize).toBeUndefined();
            expect(cdkDragSpy.disabled).toBe(false);
        });
    });

    // --- RESIZING LOGIC TESTS ---

    describe('Resizing Calculations', () => {
        const initiateResize = (direction: 'left' | 'right' | 'top' | 'bottom', startX: number, startY: number) => {
            // 1. Manually set the detected edge
            directiveInstance.resize = direction;
            // 2. Trigger mousedown to lock the active resize state
            const event = new MouseEvent('mousedown', { clientX: startX, clientY: startY });
            directiveEl.nativeElement.dispatchEvent(event);
        };

        it('should update dimensions when dragging the right edge', () => {
            initiateResize('right', 100, 100);

            const moveEvent = new MouseEvent('mousemove', { clientX: 120, clientY: 100 });
            window.dispatchEvent(moveEvent);
            vi.advanceTimersByTime(10); // Wait for the animation setTimeout

            // Move: 20px upwards. changeX = (100 - 120) / 10 = -2.
            // Logic: itemSource.x[1] - (-2) = 12
            expect(component.mockResizer.update).toHaveBeenCalledWith('right', [0, 12]);
            expect(component.mockResizer.animation).toBe(true);
        });

        it('should clamp the top dimension to resizerInit.y', () => {
            initiateResize('top', 100, 100);

            // Move: 50px upwards. changeY = (100 - 50) / 10 = 5.
            // Logic: itemSource.y[0] - 5 = -5.
            // Since resizerInit.y is 0, it should use Math.max(-5, 0) = 0.
            const moveEvent = new MouseEvent('mousemove', { clientX: 100, clientY: 50 });
            window.dispatchEvent(moveEvent);
            vi.advanceTimersByTime(10); // Wait for the animation setTimeout

            expect(component.mockResizer.update).toHaveBeenCalledWith('top', [0, 10]);
        });

        it('should update dimensions when dragging the left edge', () => {
            initiateResize('left', 100, 100);

            const moveEvent = new MouseEvent('mousemove', { clientX: 120, clientY: 100 });
            window.dispatchEvent(moveEvent);
            vi.advanceTimersByTime(10); // Wait for the animation setTimeout

            // Move: 50px upwards. changeX = (100 - 120) / 10 = -2.
            // Logic: itemSource.x[0] - (-2) = 2
            expect(component.mockResizer.update).toHaveBeenCalledWith('left', [2, 10]);
            expect(component.mockResizer.animation).toBe(true);
        });

        it('should update dimensions when dragging the bottom edge', () => {
            initiateResize('bottom', 100, 100);

            const moveEvent = new MouseEvent('mousemove', { clientX: 100, clientY: 120 });
            window.dispatchEvent(moveEvent);
            vi.advanceTimersByTime(10); // Wait for the animation setTimeout

            // Move: 20px upwards. changeY = (100 - 120) / 10 = -2.
            // Logic: itemSource.y[1] - (-2) = 12
            expect(component.mockResizer.update).toHaveBeenCalledWith('bottom', [0, 12]);
            expect(component.mockResizer.animation).toBe(true);
        });

        it('should ignore interactions when resizerDisabled is true', () => {
            component.isDisabled = true;
            fixture.changeDetectorRef.detectChanges();

            const event = new MouseEvent('mousedown', { clientX: 2, clientY: 50 });
            directiveInstance.resize = 'left';
            directiveEl.nativeElement.dispatchEvent(event);

            expect(directiveInstance.resizeActive).toBeUndefined();
        });
    });

    // --- CLEANUP & TIMEOUT TESTS ---

    describe('Lifecycle & Cleanup', () => {
        it('should reset active resize state on window mouseup', () => {
            directiveInstance.resize = 'left';
            // Simuler un mousedown pour activer le resize correctement
            const mousedownEvent = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
            directiveEl.nativeElement.dispatchEvent(mousedownEvent);

            window.dispatchEvent(new MouseEvent('mouseup'));

            expect(directiveInstance.resizeActive).toBeUndefined();
        });

        it('should emit resizerEnd on window mouseup when this instance is active', () => {
            directiveInstance.resize = 'right';
            const mousedownEvent = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
            directiveEl.nativeElement.dispatchEvent(mousedownEvent);

            const endSpy = vi.fn();
            directiveInstance.resizerEnd.subscribe(endSpy);

            window.dispatchEvent(new MouseEvent('mouseup'));

            expect(endSpy).toHaveBeenCalledOnce();
            expect(endSpy).toHaveBeenCalledWith(expect.objectContaining({ direction: 'right' }));
        });

        it('should not emit resizerEnd on window mouseup when this instance is not active', () => {
            // Sans mousedown préalable, cette instance n'est pas l'active
            directiveInstance.resize = 'left';

            const endSpy = vi.fn();
            directiveInstance.resizerEnd.subscribe(endSpy);

            window.dispatchEvent(new MouseEvent('mouseup'));

            expect(endSpy).not.toHaveBeenCalled();
        });

        it('should not reset resizeActive on mouseup when no resize is active', () => {
            // Sans mousedown préalable, MagmaResize.active ne correspond pas à cet id
            directiveInstance.resize = undefined;
            directiveInstance.resizeActive = { mousePosInit: [0, 0], itemSource: {} as any };

            window.dispatchEvent(new MouseEvent('mouseup'));

            // resizeActive should remain untouched because this instance is not the active one
            expect(directiveInstance.resizeActive).toBeDefined();
        });

        it('should not reset resizeActive on mouseup when resizeActive is already undefined', () => {
            directiveInstance.resize = 'left';
            directiveInstance.resizeActive = undefined;

            window.dispatchEvent(new MouseEvent('mouseup'));

            expect(directiveInstance.resizeActive).toBeUndefined();
        });

        it('should reset resize direction after a delay on mouseout', () => {
            directiveInstance.resize = 'left';
            directiveEl.nativeElement.dispatchEvent(new MouseEvent('mouseout'));

            // State should persist immediately because of the 50ms timer
            expect(directiveInstance.resize).toBe('left');

            vi.advanceTimersByTime(50);
            expect(directiveInstance.resize).toBeUndefined();
            expect(cdkDragSpy.disabled).toBe(false);
        });

        it('should do nothing on mouseout when resize is undefined', () => {
            directiveInstance.resize = undefined;
            directiveEl.nativeElement.dispatchEvent(new MouseEvent('mouseout'));

            vi.advanceTimersByTime(50);
            // No error, state remains unchanged
            expect(directiveInstance.resize).toBeUndefined();
        });
    });

    // --- OUTPUT EVENTS TESTS ---

    describe('Output events', () => {
        it('should emit resizerStart on mousedown when resize is set', () => {
            directiveInstance.resize = 'bottom';
            const startSpy = vi.fn();
            directiveInstance.resizerStart.subscribe(startSpy);

            const event = new MouseEvent('mousedown', { clientX: 50, clientY: 100 });
            directiveEl.nativeElement.dispatchEvent(event);

            expect(startSpy).toHaveBeenCalledOnce();
            expect(startSpy).toHaveBeenCalledWith(expect.objectContaining({ direction: 'bottom' }));
        });

        it('should not emit resizerStart on mousedown when resize is undefined', () => {
            directiveInstance.resize = undefined;
            const startSpy = vi.fn();
            directiveInstance.resizerStart.subscribe(startSpy);

            const event = new MouseEvent('mousedown', { clientX: 50, clientY: 100 });
            directiveEl.nativeElement.dispatchEvent(event);

            expect(startSpy).not.toHaveBeenCalled();
        });

        it('should not emit resizerStart on mousedown when resizerDisabled is true', () => {
            component.isDisabled = true;
            fixture.changeDetectorRef.detectChanges();

            directiveInstance.resize = 'left';
            const startSpy = vi.fn();
            directiveInstance.resizerStart.subscribe(startSpy);

            const event = new MouseEvent('mousedown', { clientX: 0, clientY: 50 });
            directiveEl.nativeElement.dispatchEvent(event);

            expect(startSpy).not.toHaveBeenCalled();
        });

        it('should emit resizerChange on window mousemove while resizing', () => {
            directiveInstance.resize = 'right';
            directiveEl.nativeElement.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100 }));

            const changeSpy = vi.fn();
            directiveInstance.resizerChange.subscribe(changeSpy);

            window.dispatchEvent(new MouseEvent('mousemove', { clientX: 120, clientY: 100 }));
            vi.advanceTimersByTime(10);

            expect(changeSpy).toHaveBeenCalledOnce();
            expect(changeSpy).toHaveBeenCalledWith(expect.objectContaining({ direction: 'right' }));
        });
    });

    // --- OVERLAP GUARD TESTS ---

    describe('Overlap guard (another instance active)', () => {
        it('should not update resize direction when another instance is active', () => {
            // Simuler une autre instance active en forçant MagmaResize.active via mousedown sur un second composant
            @Component({
                template: `
                    <div style="position: relative;">
                        <div
                            style="width: 100px; height: 100px; position: absolute;"
                            [resizer]="mockResizer"
                            [resizerHost]="mockHost"
                            [resizerInit]="{ x: 0, y: 0 }"
                        ></div>
                        <div
                            style="width: 100px; height: 100px; position: absolute;"
                            [resizer]="mockResizer"
                            [resizerHost]="mockHost"
                            [resizerInit]="{ x: 0, y: 0 }"
                        ></div>
                    </div>
                `,
                changeDetection: ChangeDetectionStrategy.Eager,
                imports: [MagmaResize],
            })
            class TwoResizerComponent {
                mockResizer = { x: [0, 10], y: [0, 10], animation: true, update: vi.fn() } as any;
                mockHost = { elementSize: 10, widthElementNumber: 100, heightElementNumber: 100 } as any;
            }

            const twoFixture = TestBed.createComponent(TwoResizerComponent);
            twoFixture.changeDetectorRef.detectChanges();

            const [el1, el2] = twoFixture.debugElement.queryAll(By.directive(MagmaResize));
            const inst1 = el1.injector.get(MagmaResize);
            const inst2 = el2.injector.get(MagmaResize);

            // Activer le resize sur inst1
            inst1.resize = 'left';
            el1.nativeElement.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 50 }));

            // Maintenant tenter de détecter une bordure sur inst2 — doit être ignoré
            const rect2 = el2.nativeElement.getBoundingClientRect();
            el2.nativeElement.dispatchEvent(
                new MouseEvent('mousemove', { clientX: rect2.left + 2, clientY: rect2.top + 50 }),
            );

            expect(inst2.resize).toBeUndefined();

            // Nettoyer l'état statique partagé avant de détruire le composant
            window.dispatchEvent(new MouseEvent('mouseup'));
            twoFixture.destroy();
        });
    });

    // --- MISSING BRANCH TESTS ---

    describe('Missing Branch Coverage', () => {
        it('should skip mouseover logic when resizeActive is set', () => {
            directiveInstance.resize = 'left';
            directiveInstance.resizeActive = { mousePosInit: [0, 0], itemSource: {} as any };

            const rect = directiveEl.nativeElement.getBoundingClientRect();
            // Move to top-left corner — would normally set resize to 'top-left'
            const event = new MouseEvent('mousemove', { clientX: rect.left + 2, clientY: rect.top + 2 });
            directiveEl.nativeElement.dispatchEvent(event);

            // resize should remain 'left' because resizeActive is set
            expect(directiveInstance.resize).toBe('left');
        });

        it('should skip mouseover logic when resizerDisabled is true', () => {
            component.isDisabled = true;
            fixture.changeDetectorRef.detectChanges();

            const rect = directiveEl.nativeElement.getBoundingClientRect();
            const event = new MouseEvent('mousemove', { clientX: rect.left + 2, clientY: rect.top + 50 });
            directiveEl.nativeElement.dispatchEvent(event);

            expect(directiveInstance.resize).toBeUndefined();
        });

        it('should skip window:mousemove logic when resizerDisabled is true', () => {
            // Activate the resize first via mousedown, then disable and move
            directiveInstance.resize = 'left';
            directiveEl.nativeElement.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 50 }));

            component.isDisabled = true;
            fixture.changeDetectorRef.detectChanges();

            window.dispatchEvent(new MouseEvent('mousemove', { clientX: 20, clientY: 50 }));

            expect(component.mockResizer.update).not.toHaveBeenCalled();
        });

        it('should skip window:mousemove resize calculation when resize is not set (else of if resizes)', () => {
            // Activate via mousedown with resize = 'left', then clear resize before window:mousemove
            directiveInstance.resize = 'left';
            directiveEl.nativeElement.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 50 }));

            // Now clear resize — resizes = undefined?.split('-') → undefined → if(resizes) is false
            directiveInstance.resize = undefined;

            window.dispatchEvent(new MouseEvent('mousemove', { clientX: 20, clientY: 50 }));

            expect(component.mockResizer.update).not.toHaveBeenCalled();
        });

        it('should skip resize calculation when host is not provided (else of if host && resizeActive && resize)', () => {
            // Activate via mousedown first
            directiveInstance.resize = 'left';
            directiveEl.nativeElement.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 50 }));

            // Remove host after activation
            component.mockHost = undefined as any;
            fixture.changeDetectorRef.detectChanges();

            window.dispatchEvent(new MouseEvent('mousemove', { clientX: 20, clientY: 50 }));

            expect(component.mockResizer.update).not.toHaveBeenCalled();
        });

        it('should skip resize calculation when resizeActive is cleared after mousedown', () => {
            // Activate via mousedown, then manually clear resizeActive
            directiveInstance.resize = 'left';
            directiveEl.nativeElement.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 50 }));

            // Force resizeActive to undefined after activation
            directiveInstance.resizeActive = undefined;

            window.dispatchEvent(new MouseEvent('mousemove', { clientX: 20, clientY: 50 }));

            expect(component.mockResizer.update).not.toHaveBeenCalled();
        });

        it('should not call update when data stays undefined (else of if data)', () => {
            // Use a composite direction whose parts don't match any of the four if-blocks
            // 'top-left'.split('-') = ['top', 'left'] — both are valid, so use a fake sub-direction
            // Instead: activate with a real direction, then mutate resize to an unknown value
            directiveInstance.resize = 'left';
            directiveEl.nativeElement.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 50 }));

            // Replace resize with a value whose split produces unknown sub-directions
            // 'x-y'.split('-') = ['x', 'y'] — neither matches top/bottom/left/right → data stays undefined
            directiveInstance.resize = 'x-y' as any;

            window.dispatchEvent(new MouseEvent('mousemove', { clientX: 20, clientY: 50 }));

            expect(component.mockResizer.update).not.toHaveBeenCalled();
        });

        it('should not call clearTimeout when this.resize is falsy during inner check (else of inner if resize)', () => {
            // Activate with a composite direction so resizes has elements, but make resize falsy
            // by the time the inner if(this.resize) check runs.
            // 'left' splits to ['left'], host is provided, resizeActive is set → enters inner block
            // Then if(this.resize) must be false → need resize to be falsy at that point.
            // We override the resize property with a getter: first read ('left') passes the outer
            // split, subsequent reads return undefined to hit the else of if(this.resize).
            directiveInstance.resize = 'left';
            directiveEl.nativeElement.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 50 }));

            const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');

            let callCount = 0;
            Object.defineProperty(directiveInstance, 'resize', {
                get: () => (callCount++ === 0 ? 'left' : undefined),
                set: () => {},
                configurable: true,
            });

            window.dispatchEvent(new MouseEvent('mousemove', { clientX: 20, clientY: 50 }));

            expect(clearTimeoutSpy).not.toHaveBeenCalled();
            clearTimeoutSpy.mockRestore();
            // Restore the property so afterEach cleanup works
            Object.defineProperty(directiveInstance, 'resize', {
                value: undefined,
                writable: true,
                configurable: true,
            });
        });
    });

    // --- WITHOUT CDKDRAG ---

    describe('Without CdkDrag', () => {
        let fixtureNoCdk: ComponentFixture<TestComponent>;
        let directiveElNoCdk: DebugElement;
        let directiveInstanceNoCdk: MagmaResize;

        beforeEach(async () => {
            await TestBed.resetTestingModule();
            await TestBed.configureTestingModule({
                imports: [TestComponent],
                // No CdkDrag provider — inject returns null (optional)
            }).compileComponents();

            fixtureNoCdk = TestBed.createComponent(TestComponent);
            directiveElNoCdk = fixtureNoCdk.debugElement.query(By.directive(MagmaResize));
            directiveInstanceNoCdk = directiveElNoCdk.injector.get(MagmaResize);
            fixtureNoCdk.changeDetectorRef.detectChanges();
        });

        afterEach(() => {
            fixtureNoCdk?.destroy();
        });

        it('should not set cdkDrag.disabled when cdkDrag is null (resize set to left)', () => {
            directiveInstanceNoCdk.resize = undefined;
            directiveInstanceNoCdk.resizeActive = undefined;
            // Reset the shared static active state so the mouseover guard doesn't block
            (MagmaResize as any)['active'] = '';

            const el = directiveElNoCdk.nativeElement;
            vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
                left: 0,
                top: 0,
                right: 100,
                bottom: 100,
                width: 100,
                height: 100,
                x: 0,
                y: 0,
                toJSON: () => {},
            } as DOMRect);
            Object.defineProperty(el, 'offsetWidth', { configurable: true, get: () => 100 });
            Object.defineProperty(el, 'offsetHeight', { configurable: true, get: () => 100 });

            // x=2 → left edge, cdkDrag is null → if (this.cdkDrag) takes false branch
            const event = new MouseEvent('mousemove', { clientX: 2, clientY: 50 });
            expect(() => (directiveInstanceNoCdk as any).mouseover(event)).not.toThrow();
            expect(directiveInstanceNoCdk.resize).toBe('left');
        });

        it('should not set cdkDrag.disabled when cdkDrag is null (resize set to undefined in center)', () => {
            directiveInstanceNoCdk.resize = undefined;
            directiveInstanceNoCdk.resizeActive = undefined;
            // Reset the shared static active state so the mouseover guard doesn't block
            (MagmaResize as any)['active'] = '';

            const el = directiveElNoCdk.nativeElement;
            vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
                left: 0,
                top: 0,
                right: 100,
                bottom: 100,
                width: 100,
                height: 100,
                x: 0,
                y: 0,
                toJSON: () => {},
            } as DOMRect);
            Object.defineProperty(el, 'offsetWidth', { configurable: true, get: () => 100 });
            Object.defineProperty(el, 'offsetHeight', { configurable: true, get: () => 100 });

            // x=50, y=50 → center → resize = undefined, cdkDrag is null → if (this.cdkDrag) false
            const event = new MouseEvent('mousemove', { clientX: 50, clientY: 50 });
            expect(() => (directiveInstanceNoCdk as any).mouseover(event)).not.toThrow();
            expect(directiveInstanceNoCdk.resize).toBeUndefined();
        });

        it('should not set cdkDrag.disabled when cdkDrag is null (resize set to undefined in center)', () => {
            directiveInstanceNoCdk.resize = undefined;
            directiveInstanceNoCdk.resizeActive = undefined;
            // Reset the shared static active state so the mouseover guard doesn't block
            (MagmaResize as any)['active'] = '';

            const el = directiveElNoCdk.nativeElement;
            vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
                left: 0,
                top: 0,
                right: 100,
                bottom: 100,
                width: 100,
                height: 100,
                x: 0,
                y: 0,
                toJSON: () => {},
            } as DOMRect);
            Object.defineProperty(el, 'offsetWidth', { configurable: true, get: () => 100 });
            Object.defineProperty(el, 'offsetHeight', { configurable: true, get: () => 100 });

            // Call the handler directly to bypass the MagmaResize.active static guard
            const event = new MouseEvent('mousemove', { clientX: 50, clientY: 50 });
            expect(() => (directiveInstanceNoCdk as any).mouseover(event)).not.toThrow();
            expect(directiveInstanceNoCdk.resize).toBeUndefined();
        });

        it('should not throw on mouseout timer when cdkDrag is null', () => {
            directiveInstanceNoCdk.resize = 'left';
            directiveElNoCdk.nativeElement.dispatchEvent(new MouseEvent('mouseout'));

            expect(() => vi.advanceTimersByTime(50)).not.toThrow();
            expect(directiveInstanceNoCdk.resize).toBeUndefined();
        });
    });
});
