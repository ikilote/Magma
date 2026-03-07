import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { MagmaWindows } from './windows';

import { MagmaWindowsZone } from '../components/window/windows-zone.component';

describe('MagmaWindows Service', () => {
    let service: MagmaWindows;
    let overlaySpy: jasmine.SpyObj<Overlay>;
    let overlayRefSpy: jasmine.SpyObj<OverlayRef>;
    let componentRefSpy: jasmine.SpyObj<ComponentRef<MagmaWindowsZone>>;
    beforeEach(() => {
        // 1. Create the spies
        overlayRefSpy = jasmine.createSpyObj('OverlayRef', ['attach', 'dispose']);
        componentRefSpy = jasmine.createSpyObj('ComponentRef', ['setInput']);

        // Setup the mock instance for the zone component
        (componentRefSpy as any).instance = {
            cd: jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']),
        };

        overlayRefSpy.attach.and.returnValue(componentRefSpy);

        // 2. Setup the Overlay Spy with nested strategy methods
        overlaySpy = jasmine.createSpyObj('Overlay', ['create', 'position']);

        // This is the specific fix for your error:
        overlaySpy.scrollStrategies = {
            block: jasmine.createSpy('block').and.returnValue({} as any),
        } as any;

        // Fix for the position strategy chain
        overlaySpy.position.and.returnValue({
            global: jasmine.createSpy('global').and.returnValue({} as any),
        } as any);

        overlaySpy.create.and.returnValue(overlayRefSpy);

        TestBed.configureTestingModule({
            providers: [MagmaWindows, { provide: Overlay, useValue: overlaySpy }],
        });

        service = TestBed.inject(MagmaWindows);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should configure the overlay with correct strategies', () => {
        service.openWindow(class {});

        expect(overlaySpy.create).toHaveBeenCalledWith(
            jasmine.objectContaining({
                hasBackdrop: false,
                panelClass: 'overlay-window',
            }),
        );

        // Verify that the strategies were actually called
        expect(overlaySpy.scrollStrategies.block).toHaveBeenCalled();
        expect(overlaySpy.position().global).toHaveBeenCalled();
    });

    describe('openWindow', () => {
        it('should initialize the overlay only once when opening the first window', () => {
            const mockComponent = class {};

            service.openWindow(mockComponent);
            service.openWindow(mockComponent);

            expect(overlaySpy.create).toHaveBeenCalledTimes(1);
            expect(service.windows.length).toBe(2);
        });

        it('should assign a unique ID and correct index to new windows', () => {
            const mockComponent = class {};
            const window1 = service.openWindow(mockComponent);
            const window2 = service.openWindow(mockComponent);

            expect(window1.id).toContain('window-');
            expect(window1.index).toBe(0);
            expect(window2.index).toBe(1);
        });

        it('should emit the new window via onAddWindow subject', done => {
            const mockComponent = class {};
            service.onAddWindow.subscribe(window => {
                expect(window.component).toBe(mockComponent);
                done();
            });
            service.openWindow(mockComponent);
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

        it('should not dispose of the overlay if other windows are still open', () => {
            const win1 = service.openWindow(class {});
            service.openWindow(class {});

            service.removeWindow(win1);

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
});
