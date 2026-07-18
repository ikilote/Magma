import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AbstractWindowComponent, MagmaWindowInfos } from './window.component';
import { MagmaWindowsZone } from './windows-zone.component';

@Component({
    selector: 'mg-test',
    template: `<button (click)="close()">close</button>`,
    changeDetection: ChangeDetectionStrategy.Eager,
})
class TestComponent extends AbstractWindowComponent {
    override close() {
        // Override to prevent calling parent().onClose.emit() in tests
        if (this.parent) {
            this.parent().onClose.emit();
        }
    }
}

describe('MagmaWindowsZone', () => {
    let component: MagmaWindowsZone;
    let fixture: ComponentFixture<MagmaWindowsZone>;
    let mockWindows: MagmaWindowInfos[];

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [MagmaWindowsZone] }).compileComponents();

        fixture = TestBed.createComponent(MagmaWindowsZone);
        component = fixture.componentInstance;

        // Create a set of dummy windows (recreate fresh for each test)
        mockWindows = [
            { id: 'win-0', index: signal(0), component: TestComponent } as any,
            { id: 'win-1', index: signal(1), component: TestComponent } as any,
            { id: 'win-2', index: signal(2), component: TestComponent } as any,
        ];

        // Using the modern setInput API for Signal inputs
        fixture.componentRef.setInput('windows', mockWindows);
        fixture.changeDetectorRef.detectChanges();

        // Wait for async operations to complete
        await fixture.whenStable();
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(async () => {
        fixture?.destroy();
        vi.clearAllTimers();
        vi.useRealTimers();
        TestBed.resetTestingModule();
    });

    it('should create and initialize with browser dimensions', () => {
        expect(component).toBeTruthy();
        expect(component.widthElementNumber).toBe(window.innerWidth);
        expect(component.heightElementNumber).toBe(window.innerHeight);
    });

    describe('Layering Logic (Z-Index)', () => {
        it('should bring the selected window to the front (highest index)', () => {
            // We select the window at index 0
            const target = mockWindows[0];

            component.select(target);

            // After selection:
            // target (win-0) should move to index 2 (length - 1)
            // win-1 (index 1) > 0, so it becomes index 0
            // win-2 (index 2) > 0, so it becomes index 1
            expect(target.index()).toBe(2);
            expect(mockWindows[1].index()).toBe(0);
            expect(mockWindows[2].index()).toBe(1);
        });

        it('should set focus=true on the selected window and focus=false on all others', () => {
            // Pre-set focus on another window
            mockWindows[2].focus = true;

            component.select(mockWindows[0]);

            expect(mockWindows[0].focus).toBe(true);
            expect(mockWindows[1].focus).toBe(false);
            expect(mockWindows[2].focus).toBe(false);
        });

        it('should update focus when selecting a different window', () => {
            // First select win-0
            component.select(mockWindows[0]);
            expect(mockWindows[0].focus).toBe(true);

            // Then select win-1
            component.select(mockWindows[1]);
            expect(mockWindows[1].focus).toBe(true);
            expect(mockWindows[0].focus).toBe(false);
        });

        it('should trigger select when a window emits mousedown', () => {
            vi.spyOn(component, 'select');
            const windowEl = fixture.debugElement.query(By.css('mg-window'));

            windowEl.triggerEventHandler('mousedown', null);

            expect(component.select).toHaveBeenCalledWith(mockWindows[0]);
        });
    });

    describe('Removal Logic', () => {
        it('should delegate removal to MagmaWindows service if context is provided', () => {
            const serviceSpy = {
                removeWindow: vi.fn().mockName('MagmaWindows.removeWindow'),
            };
            fixture.componentRef.setInput('context', serviceSpy);

            component.remove(mockWindows[0]);

            expect(serviceSpy.removeWindow).toHaveBeenCalledWith(mockWindows[0]);
        });

        it('should splice the local array if no context is provided', () => {
            // Explicitly set context to undefined
            fixture.componentRef.setInput('context', undefined);

            const target = mockWindows[1]; // 'win-1'
            component.remove(target);

            expect(mockWindows.length).toBe(2);
            expect(mockWindows.find(w => w.id === 'win-1')).toBeUndefined();
        });

        it('should not throw error when removing a window that does not exist (index === -1)', () => {
            // Explicitly set context to undefined
            fixture.componentRef.setInput('context', undefined);

            // Create a window that is NOT in the array
            const nonExistentWindow = { id: 'win-999', index: signal(99), component: TestComponent } as any;

            const initialLength = mockWindows.length;

            // Act: try to remove a window that doesn't exist
            expect(() => component.remove(nonExistentWindow)).not.toThrow();

            // Assert: array should remain unchanged
            expect(mockWindows.length).toBe(initialLength);
        });

        it('should trigger removal when mg-window emits onClose', async () => {
            vi.spyOn(component, 'remove');
            const windowEl = fixture.debugElement.query(By.css('mg-window'));
            const windowComponent = windowEl.componentInstance;

            // Emit the onClose output event
            windowComponent.onClose.emit();

            // Wait for Angular to process the event
            await Promise.resolve();
            fixture.changeDetectorRef.detectChanges();

            // Verify remove was called with the first window in the current array
            expect(component.remove).toHaveBeenCalled();
            const calledWith = vi.mocked(component.remove).mock.calls[0][0];
            expect(calledWith).toBeDefined();
            expect(calledWith.component).toBe(TestComponent);
        });
    });

    describe('Minimize / Restore / Focus events', () => {
        it('should emit onMinimizeWindow on the context when a window emits onMinimize', async () => {
            const serviceSpy = {
                removeWindow: vi.fn(),
                onMinimizeWindow: { next: vi.fn() },
                onRestoreWindow: { next: vi.fn() },
                onFocusWindow: { next: vi.fn() },
            };
            fixture.componentRef.setInput('context', serviceSpy);
            fixture.changeDetectorRef.detectChanges();

            const windowEl = fixture.debugElement.query(By.css('mg-window'));
            const windowComponent = windowEl.componentInstance;

            windowComponent.onMinimize.emit();
            await Promise.resolve();

            expect(serviceSpy.onMinimizeWindow.next).toHaveBeenCalledWith('win-0');
        });

        it('should emit onRestoreWindow on the context when a window emits onRestore', async () => {
            const serviceSpy = {
                removeWindow: vi.fn(),
                onMinimizeWindow: { next: vi.fn() },
                onRestoreWindow: { next: vi.fn() },
                onFocusWindow: { next: vi.fn() },
            };
            fixture.componentRef.setInput('context', serviceSpy);
            fixture.changeDetectorRef.detectChanges();

            const windowEl = fixture.debugElement.query(By.css('mg-window'));
            const windowComponent = windowEl.componentInstance;

            windowComponent.onRestore.emit();
            await Promise.resolve();

            expect(serviceSpy.onRestoreWindow.next).toHaveBeenCalledWith('win-0');
        });

        it('should emit onFocusWindow on the context when a window emits onFocus', async () => {
            const serviceSpy = {
                removeWindow: vi.fn(),
                onMinimizeWindow: { next: vi.fn() },
                onRestoreWindow: { next: vi.fn() },
                onFocusWindow: { next: vi.fn() },
            };
            fixture.componentRef.setInput('context', serviceSpy);
            fixture.changeDetectorRef.detectChanges();

            const windowEl = fixture.debugElement.query(By.css('mg-window'));
            const windowComponent = windowEl.componentInstance;

            windowComponent.onFocus.emit();
            await Promise.resolve();

            expect(serviceSpy.onFocusWindow.next).toHaveBeenCalledWith('win-0');
        });

        it('should call select() when a window emits onFocus (via onWindowFocus)', async () => {
            vi.spyOn(component, 'select');
            const windowEl = fixture.debugElement.query(By.css('mg-window'));
            const windowComponent = windowEl.componentInstance;

            windowComponent.onFocus.emit();
            await Promise.resolve();

            expect(component.select).toHaveBeenCalledWith(mockWindows[0]);
        });

        it('should call select() when a window emits onRestore (via onWindowRestore)', async () => {
            vi.spyOn(component, 'select');
            const windowEl = fixture.debugElement.query(By.css('mg-window'));
            const windowComponent = windowEl.componentInstance;

            windowComponent.onRestore.emit();
            await Promise.resolve();

            expect(component.select).toHaveBeenCalledWith(mockWindows[0]);
        });
    });

    describe('minimizeById / restoreById', () => {
        it('should call minimize() on the correct MagmaWindow instance', () => {
            const windowEl = fixture.debugElement.query(By.css('mg-window'));
            const windowComponent = windowEl.componentInstance;
            vi.spyOn(windowComponent, 'minimize');

            component.minimizeById('win-0');

            expect(windowComponent.minimize).toHaveBeenCalled();
        });

        it('should not throw when minimizing a non-existent window', () => {
            expect(() => component.minimizeById('non-existent')).not.toThrow();
        });

        it('should call restore() on the correct MagmaWindow instance', () => {
            const windowEl = fixture.debugElement.query(By.css('mg-window'));
            const windowComponent = windowEl.componentInstance;
            vi.spyOn(windowComponent, 'restore');
            vi.spyOn(component, 'select');

            component.restoreById('win-0');

            expect(windowComponent.restore).toHaveBeenCalled();
            expect(component.select).toHaveBeenCalledWith(mockWindows[0]);
        });

        it('should not throw when restoring a non-existent window', () => {
            expect(() => component.restoreById('non-existent')).not.toThrow();
        });
    });

    describe('getWindowPosition', () => {
        it('should return the position relative to the zone', () => {
            const windowEl = fixture.debugElement.query(By.css('mg-window'));
            const windowComponent = windowEl.componentInstance;

            // Set internal position state
            windowComponent.x = [150, 400];
            windowComponent.y = [80, 300];
            windowComponent.initPosition = { x: 50, y: 30 };

            const pos = component.getWindowPosition('win-0');

            expect(pos).toEqual({ x: 100, y: 50 });
        });

        it('should return null for a non-existent window', () => {
            const pos = component.getWindowPosition('non-existent');
            expect(pos).toBeNull();
        });
    });
});
