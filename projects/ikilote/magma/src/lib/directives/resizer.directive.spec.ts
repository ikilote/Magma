import { CdkDrag } from '@angular/cdk/drag-drop';
import { Component, DebugElement } from '@angular/core';
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
    standalone: true,
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

    afterEach(() => {
        vi.useRealTimers();
        fixture?.destroy();
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
            directiveInstance.resizeActive = { mousePosInit: [0, 0], itemSource: {} as any };

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
    });
});
