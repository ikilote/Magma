import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ChangeDetectorRef, ComponentRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { type Mocked, beforeEach, describe, expect, it, vi } from 'vitest';

import { MagmaWindows } from './windows';

import { MagmaWindowsZone } from '../components/window/windows-zone.component';

describe('MagmaWindows Service', () => {
    let service: MagmaWindows;

    // Utilisation de Mocked pour un typage fort
    let overlaySpy: Mocked<Overlay>;
    let overlayRefSpy: Mocked<OverlayRef>;
    let componentRefSpy: Mocked<ComponentRef<MagmaWindowsZone>>;

    beforeEach(() => {
        // 1. Définition des mocks de base
        overlayRefSpy = {
            attach: vi.fn(),
            dispose: vi.fn(),
        } as unknown as Mocked<OverlayRef>;

        componentRefSpy = {
            setInput: vi.fn(),
            instance: {
                cd: {
                    detectChanges: vi.fn(),
                } as unknown as ChangeDetectorRef,
                onWindowFocus: vi.fn(),
                select: vi.fn(),
            },
        } as unknown as Mocked<ComponentRef<MagmaWindowsZone>>;

        overlayRefSpy.attach.mockReturnValue(componentRefSpy);

        // 2. Mock complexe de l'Overlay (Chainage de méthodes)
        overlaySpy = {
            create: vi.fn().mockReturnValue(overlayRefSpy),
            scrollStrategies: {
                block: vi.fn().mockReturnValue({}),
            },
            position: vi.fn().mockReturnValue({
                global: vi.fn().mockReturnThis(), // Permet le chainage
            }),
        } as unknown as Mocked<Overlay>;

        TestBed.configureTestingModule({
            providers: [MagmaWindows, { provide: Overlay, useValue: overlaySpy }],
        });

        service = TestBed.inject(MagmaWindows);
    });

    afterEach(async () => {
        vi.clearAllTimers();
        vi.useRealTimers();

        if (overlayRefSpy.dispose) overlayRefSpy.dispose.mockClear();
        if (componentRefSpy.destroy) componentRefSpy.destroy();
        componentRefSpy = null as any;
        overlayRefSpy = null as any;

        TestBed.resetTestingModule();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should configure the overlay with correct strategies', () => {
        service.openWindow(class {});

        expect(overlaySpy.create).toHaveBeenCalledWith(
            expect.objectContaining({
                hasBackdrop: false,
                panelClass: 'overlay-window',
            }),
        );

        expect(overlaySpy.scrollStrategies.block).toHaveBeenCalled();
        // Vérifie que le chainage global() a été appelé
        expect(overlaySpy.position().global).toHaveBeenCalled();
    });

    describe('openWindow', () => {
        it('should initialize the overlay only once when opening multiple windows', () => {
            const mockComp = class {};
            service.openWindow(mockComp);
            service.openWindow(mockComp);

            expect(overlaySpy.create).toHaveBeenCalledTimes(1);
            expect(service.windows.length).toBe(2);
        });

        it('should assign a unique ID and correct index', () => {
            const win1 = service.openWindow(class {});
            const win2 = service.openWindow(class {});

            expect(win1.id).toMatch(/^window-/);
            expect(win1.index()).toBe(0);
            expect(win2.index()).toBe(1);
        });

        it('should emit the new window via onAddWindow', () => {
            const mockComponent = class {};
            const spy = vi.fn();

            const sub = service.onAddWindow.subscribe(spy);
            service.openWindow(mockComponent);

            expect(spy).toHaveBeenCalledWith(expect.objectContaining({ component: mockComponent }));
            sub.unsubscribe();
        });

        it('should trigger change detection on the zone component', () => {
            service.openWindow(class {});
            expect(componentRefSpy.instance.cd.detectChanges).toHaveBeenCalled();
        });
    });

    describe('removeWindow', () => {
        it('should remove a window by its reference', () => {
            const win = service.openWindow(class {});
            expect(service.windows.length).toBe(1);

            service.removeWindow(win);
            expect(service.windows.length).toBe(0);
        });

        it('should dispose of the overlay when the last window is removed', () => {
            const win = service.openWindow(class {});
            service.removeWindow(win);

            expect(overlayRefSpy.dispose).toHaveBeenCalled();
            expect(service.overlayRef).toBeUndefined();
            expect(service.component).toBeUndefined();
        });

        it('should not dispose overlay if other windows remain', () => {
            const win1 = service.openWindow(class {});
            service.openWindow(class {});

            service.removeWindow(win1);

            expect(service.windows.length).toBe(1);
            expect(overlayRefSpy.dispose).not.toHaveBeenCalled();
        });

        it('should do nothing when trying to remove a non-existent window', () => {
            const win = service.openWindow(class {});
            expect(service.windows.length).toBe(1);

            // Try to remove a window with a non-existent ID
            service.removeWindowById('non-existent-id');

            // Windows array should remain unchanged
            expect(service.windows.length).toBe(1);
            expect(overlayRefSpy.dispose).not.toHaveBeenCalled();
        });
    });

    describe('init (private logic)', () => {
        it('should set the correct inputs to the MagmaWindowsZone component', () => {
            service.openWindow(class {});

            expect(componentRefSpy.setInput).toHaveBeenCalledWith('windows', service.windows);
            expect(componentRefSpy.setInput).toHaveBeenCalledWith('context', service);
        });
    });

    describe('minimizeWindowById', () => {
        it('should delegate to the zone component minimizeById', () => {
            service.openWindow(class {});
            const minimizeSpy = vi.fn();
            componentRefSpy.instance.minimizeById = minimizeSpy;

            service.minimizeWindowById('window-0');

            expect(minimizeSpy).toHaveBeenCalledWith('window-0');
        });

        it('should not throw if no component is present', () => {
            expect(() => service.minimizeWindowById('non-existent')).not.toThrow();
        });
    });

    describe('restoreWindowById', () => {
        it('should delegate to the zone component restoreById', () => {
            service.openWindow(class {});
            const restoreSpy = vi.fn();
            componentRefSpy.instance.restoreById = restoreSpy;

            service.restoreWindowById('window-0');

            expect(restoreSpy).toHaveBeenCalledWith('window-0');
        });

        it('should not throw if no component is present', () => {
            expect(() => service.restoreWindowById('non-existent')).not.toThrow();
        });
    });

    describe('getWindowPosition', () => {
        it('should delegate to the zone component getWindowPosition', () => {
            service.openWindow(class {});
            const positionSpy = vi.fn().mockReturnValue({ x: 100, y: 200 });
            componentRefSpy.instance.getWindowPosition = positionSpy;

            const result = service.getWindowPosition('window-0');

            expect(positionSpy).toHaveBeenCalledWith('window-0');
            expect(result).toEqual({ x: 100, y: 200 });
        });

        it('should return null if no component is present', () => {
            const result = service.getWindowPosition('non-existent');
            expect(result).toBeNull();
        });
    });

    describe('focusWindowById', () => {
        it('should delegate to the zone component select() with the matching window', () => {
            const win1 = service.openWindow(class {});
            const win2 = service.openWindow(class {});

            service.focusWindowById(win1.id);

            expect(componentRefSpy.instance.select).toHaveBeenCalledWith(win1);
            expect(componentRefSpy.instance.select).not.toHaveBeenCalledWith(win2);
        });

        it('should not call select() when the id does not match any window', () => {
            service.openWindow(class {});

            service.focusWindowById('non-existent-id');

            expect(componentRefSpy.instance.select).not.toHaveBeenCalled();
        });

        it('should not throw if no component is present', () => {
            // No openWindow call → no component
            expect(() => service.focusWindowById('any-id')).not.toThrow();
        });
    });

    describe('openWindow (focus parameter)', () => {
        it('should call onWindowFocus when focus is true (default)', () => {
            service.openWindow(class {});

            expect(componentRefSpy.instance.onWindowFocus).toHaveBeenCalled();
        });

        it('should NOT call onWindowFocus when focus is false', () => {
            service.openWindow(class {}, undefined, false);

            expect(componentRefSpy.instance.onWindowFocus).not.toHaveBeenCalled();
        });
    });

    describe('onMinimizeWindow / onRestoreWindow / onFocusWindow subjects', () => {
        it('should expose onMinimizeWindow as a Subject', () => {
            const spy = vi.fn();
            service.onMinimizeWindow.subscribe(spy);
            service.onMinimizeWindow.next('test-id');
            expect(spy).toHaveBeenCalledWith('test-id');
        });

        it('should expose onRestoreWindow as a Subject', () => {
            const spy = vi.fn();
            service.onRestoreWindow.subscribe(spy);
            service.onRestoreWindow.next('test-id');
            expect(spy).toHaveBeenCalledWith('test-id');
        });

        it('should expose onFocusWindow as a Subject', () => {
            const spy = vi.fn();
            service.onFocusWindow.subscribe(spy);
            service.onFocusWindow.next('test-id');
            expect(spy).toHaveBeenCalledWith('test-id');
        });
    });
});
