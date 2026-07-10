import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import type { Mocked } from 'vitest';

import { AbstractWindowComponent, MagmaWindow } from './window.component';

import { MagmaResizeHostElement } from '../../directives/resizer';

@Component({
    selector: 'mg-test',
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `<button (click)="close()">close</button>`,
})
class TestComponent extends AbstractWindowComponent {}

class MockDragSpy {
    setFreeDragPosition = vi.fn();
    disabled = false;
}

describe('MagmaWindow', () => {
    let component: MagmaWindow;
    let fixture: ComponentFixture<MagmaWindow>;
    let mockResizeHost: Mocked<MagmaResizeHostElement>;

    beforeEach(async () => {
        vi.useFakeTimers();
        mockResizeHost = {
            select: vi.fn().mockName('MagmaResizeHostElement.select'),
            remove: vi.fn().mockName('MagmaResizeHostElement.remove'),
        } as unknown as Mocked<MagmaResizeHostElement>;

        await TestBed.configureTestingModule({ imports: [MagmaWindow] }).compileComponents();

        fixture = TestBed.createComponent(MagmaWindow);
        component = fixture.componentInstance;
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(async () => {
        fixture?.destroy();
        vi.clearAllTimers();
        vi.useRealTimers();
        TestBed.resetTestingModule();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Open/Close', () => {
        it('should open the window', () => {
            component.open();
            expect(component.isOpen()).toBe(true);
        });

        it('should close the window and emit onClose', () => {
            vi.spyOn(component.onClose, 'emit');
            component.open();
            component.close();
            expect(component.isOpen()).toBe(false);
            expect(component.onClose.emit).toHaveBeenCalled();
        });

        it('should render and initialize when isOpen is true', async () => {
            fixture.componentRef.setInput('isOpen', true);
            fixture.changeDetectorRef.detectChanges();

            // simulate ngInit (directive MagmaNgInit in template   )
            component.winInit();
            vi.advanceTimersByTime(0); // for setTimeout in winInit

            const content = fixture.debugElement.query(By.css('.content'));
            expect(content).not.toBeNull();
            expect(component['isOpen']()).toBe(true);
        });

        it('should not render anything if isOpen is false', () => {
            fixture.componentRef.setInput('isOpen', false);
            fixture.changeDetectorRef.detectChanges();
            const content = fixture.debugElement.query(By.css('.content'));
            expect(content).toBeNull();
        });
    });

    describe('Drag and Drop', () => {
        beforeEach(() => {
            const mockEl = { nativeElement: document.createElement('div') };
            // @ts-ignore
            vi.spyOn(component, 'elementWin').mockReturnValue([mockEl] as any);
        });

        it('should update position on drag', () => {
            const mockDragEvent = {
                distance: { x: 10, y: 20 },
                source: { element: { nativeElement: {} } }, // Ajouté pour éviter l'erreur
            } as any;

            component.drag(mockDragEvent);
            expect(component.x[0]).toBeGreaterThan(0);
        });

        it('should update internal coordinates after drag ends', () => {
            fixture.componentRef.setInput('isOpen', true);
            fixture.changeDetectorRef.detectChanges();

            const mockDragEnd = {
                distance: { x: 50, y: 100 },
                source: { element: { nativeElement: {} } },
            } as CdkDragEnd;

            // Mock the zone to avoid offsetWidth errors on null
            vi.spyOn<any, any>(component, 'getZone').mockReturnValue({ offsetWidth: 1000, offsetHeight: 1000 });

            component.drag(mockDragEnd);

            // The coordinates x[0] and y[0] must have been incremented.
            expect(component['x'][0]).toBeGreaterThanOrEqual(50);
            expect(component['y'][0]).toBeGreaterThanOrEqual(100);
        });

        it('should trigger drag method when cdkDragEnded event is emitted from template', () => {
            fixture.componentRef.setInput('isOpen', true);
            fixture.changeDetectorRef.detectChanges();

            vi.spyOn(component, 'drag');
            vi.spyOn<any, any>(component, 'getZone').mockReturnValue({ offsetWidth: 1000, offsetHeight: 1000 });

            const contentElement = fixture.debugElement.query(By.css('.content'));
            expect(contentElement).toBeTruthy();

            const mockDragEndEvent = {
                distance: { x: 30, y: 40 },
                source: { element: { nativeElement: {} } },
            } as CdkDragEnd;

            // Trigger the cdkDragEnded event from the template
            contentElement.triggerEventHandler('cdkDragEnded', mockDragEndEvent);

            expect(component.drag).toHaveBeenCalledWith(mockDragEndEvent);
        });
    });

    describe('Positioning & Resizing', () => {
        let mockElement: HTMLDivElement;

        beforeEach(() => {
            fixture.componentRef.setInput('isOpen', true);
            fixture.changeDetectorRef.detectChanges();
            component.winInit();
            vi.advanceTimersByTime(0);

            mockElement = document.createElement('div');
            mockElement.style.width = '200px';
            mockElement.style.height = '100px';
            mockElement.style.display = 'block';
            mockElement.style.position = 'absolute';

            document.body.appendChild(mockElement);

            // Mock signals: we simulate the return of ViewChildren/ViewChild
            // If they are signals, we mock the function itself
            // @ts-ignore
            vi.spyOn(component, 'elementWin').mockReturnValue([{ nativeElement: mockElement }] as any);

            // Initialisation par défaut pour éviter les undefined
            component['x'] = [0, 0];
            component['y'] = [0, 0];
            component['initPosition'] = { x: 0, y: 0 };
        });

        it('should update LEFT: increases width and shifts X position', () => {
            component['x'] = [100, 200];
            const cdkDragInstance = component['cdkDrag']()?.[0];
            const setFreeDragPositionSpy = vi.spyOn(cdkDragInstance, 'setFreeDragPosition');

            // Act: We move the left edge from 100 to 80
            component.update('left', [80, 200]);

            // Assert
            expect(mockElement.style.width).toBe('220px'); // 100 - 80 + 200
            expect(setFreeDragPositionSpy).toHaveBeenCalledWith(expect.objectContaining({ x: 80 }));
        });

        it('should update RIGHT: increases width and updates internal state', () => {
            component['x'] = [0, 100];

            // Act
            component.update('right', [0, 300]);

            // Assert
            expect(mockElement.style.width).toBe('300px');
            // If it still fails here, check that your code correctly does: this.x[1] = args[1]
            expect(component['x'][1]).toBe(300);
        });

        it('should update TOP: increases height and shifts Y position', () => {
            component['y'] = [100, 200];
            const cdkDragInstance = component['cdkDrag']()?.[0];
            const setFreeDragPositionSpy = vi.spyOn(cdkDragInstance, 'setFreeDragPosition');

            // Act
            component.update('top', [70, 200]);

            // Assert
            expect(mockElement.style.height).toBe('230px'); // 100 - 70 + 200
            expect(setFreeDragPositionSpy).toHaveBeenCalledWith(expect.objectContaining({ y: 70 }));
        });

        it('should update BOTTOM: increases height while keeping Y position static', () => {
            component['y'] = [50, 100];

            // Act
            component.update('bottom', [50, 150]);

            expect(mockElement.style.height).toBe('150px');
            expect(component['y'][0]).toBe(50);
        });

        it('should NOT update LEFT when data[0] <= initPosition.x', () => {
            component['x'] = [100, 200];
            component['initPosition'] = { x: 100, y: 0 };
            const initialWidth = mockElement.style.width;

            // Act: data[0] (50) is NOT > initPosition.x (100)
            component.update('left', [50, 200]);

            // Assert: width should not change
            expect(mockElement.style.width).toBe(initialWidth);
        });

        it('should NOT update RIGHT when data[1] <= initPosition.x', () => {
            component['x'] = [100, 200];
            component['initPosition'] = { x: 150, y: 0 };
            const initialWidth = mockElement.style.width;

            // Act: data[1] (100) is NOT > initPosition.x (150)
            component.update('right', [100, 100]);

            // Assert: width should not change
            expect(mockElement.style.width).toBe(initialWidth);
        });

        it('should NOT update BOTTOM when data[1] <= initPosition.y', () => {
            component['y'] = [50, 100];
            component['initPosition'] = { x: 0, y: 200 };
            const initialHeight = mockElement.style.height;

            // Act: data[1] (150) is NOT > initPosition.y (200)
            component.update('bottom', [50, 150]);

            // Assert: height should not change
            expect(mockElement.style.height).toBe(initialHeight);
        });

        it('should NOT update LEFT position when size !== element.offsetWidth', () => {
            component['x'] = [100, 200];
            component['initPosition'] = { x: 0, y: 0 };

            // Mock offsetWidth to be different from calculated size
            Object.defineProperty(mockElement, 'offsetWidth', {
                value: 999, // Different from calculated size
                configurable: true,
            });

            const cdkDragInstance = component['cdkDrag']()?.[0];
            const setFreeDragPositionSpy = vi.spyOn(cdkDragInstance, 'setFreeDragPosition');

            // Act
            component.update('left', [80, 200]);

            // Assert: setFreeDragPosition should NOT be called
            expect(setFreeDragPositionSpy).not.toHaveBeenCalled();
        });

        it('should NOT update TOP position when data[0] <= initPosition.y', () => {
            component['y'] = [100, 200];
            component['initPosition'] = { x: 0, y: 150 };

            const cdkDragInstance = component['cdkDrag']()?.[0];
            const setFreeDragPositionSpy = vi.spyOn(cdkDragInstance, 'setFreeDragPosition');

            // Act: data[0] (70) is NOT > initPosition.y (150)
            component.update('top', [70, 200]);

            // Assert: setFreeDragPosition should NOT be called
            expect(setFreeDragPositionSpy).not.toHaveBeenCalled();
        });

        it('should NOT update TOP position when size !== element.offsetHeight', () => {
            component['y'] = [100, 200];
            component['initPosition'] = { x: 0, y: 0 };

            // Mock offsetHeight to be different from calculated size
            Object.defineProperty(mockElement, 'offsetHeight', {
                value: 999, // Different from calculated size
                configurable: true,
            });

            const cdkDragInstance = component['cdkDrag']()?.[0];
            const setFreeDragPositionSpy = vi.spyOn(cdkDragInstance, 'setFreeDragPosition');

            // Act
            component.update('top', [70, 200]);

            // Assert: setFreeDragPosition should NOT be called (even though height style is set)
            expect(setFreeDragPositionSpy).not.toHaveBeenCalled();
        });

        it('should call updatePosition when position change', () => {
            vi.spyOn(component, 'updatePosition');
            fixture.componentRef.setInput('position', 'center');
            fixture.changeDetectorRef.detectChanges();
            expect(component.updatePosition).toHaveBeenCalledWith();
        });

        it('should not call updatePosition with other input', () => {
            vi.spyOn(component, 'updatePosition');
            fixture.componentRef.setInput('bar', 'false');
            fixture.changeDetectorRef.detectChanges();
            expect(component.updatePosition).not.toHaveBeenCalledWith();
        });
    });

    describe('getZone() - Boundary Selection', () => {
        let zoneElement: HTMLElement;

        beforeEach(() => {
            // Create a dummy zone element in the real DOM for querySelector to find
            zoneElement = document.createElement('div');
            zoneElement.id = 'test-zone';
            document.body.appendChild(zoneElement);
        });

        afterEach(() => {
            // Clean up the DOM to avoid polluting other tests
            if (zoneElement.parentNode) {
                document.body.removeChild(zoneElement);
            }
        });

        it('should return the element if zoneSelector input is provided', () => {
            fixture.componentRef.setInput('zoneSelector', '#test-zone');

            const result = component['getZone']();

            expect(result).toBe(zoneElement);
        });

        it('should return the element from the component infos if zoneSelector input is missing', () => {
            fixture.componentRef.setInput('zoneSelector', undefined);
            fixture.componentRef.setInput('component', {
                zoneSelector: '#test-zone',
                id: 'win-1',
            } as any);

            const result = component['getZone']();

            expect(result).toBe(zoneElement);
        });

        it('should prioritize the direct zoneSelector input over the component infos', () => {
            // Create a second zone
            const specificZone = document.createElement('div');
            specificZone.id = 'specific-zone';
            document.body.appendChild(specificZone);

            fixture.componentRef.setInput('zoneSelector', '#specific-zone');
            fixture.componentRef.setInput('component', {
                zoneSelector: '#test-zone',
            } as any);

            const result = component['getZone']();

            expect(result).toBe(specificZone);

            // Cleanup specific zone
            document.body.removeChild(specificZone);
        });

        it('should return null if no selector is provided', () => {
            fixture.componentRef.setInput('zoneSelector', undefined);
            fixture.componentRef.setInput('component', undefined);

            const result = component['getZone']();

            expect(result).toBeNull();
        });

        it('should return null if the selector does not match any element', () => {
            fixture.componentRef.setInput('zoneSelector', '#non-existent-id');

            const result = component['getZone']();

            expect(result).toBeNull();
        });
    });

    describe('Title Bar', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('isOpen', true);
            fixture.componentRef.setInput('bar', true);
            fixture.componentRef.setInput('bar-title', 'Test Window');
            fixture.componentRef.setInput('bar-buttons', true);
            fixture.changeDetectorRef.detectChanges();
        });

        it('should display title bar if bar is true', () => {
            const titleBar = fixture.debugElement.query(By.css('.window-title-bar'));
            expect(titleBar).toBeTruthy();
        });

        it('should display title bar if bar is false', () => {
            fixture.componentRef.setInput('bar', false);
            fixture.changeDetectorRef.detectChanges();
            const titleBar = fixture.debugElement.query(By.css('.window-title-bar'));
            expect(titleBar).toBeNull();
        });

        it('should display title from comp.bar.title when barTitle input is not provided', () => {
            fixture.componentRef.setInput('bar-title', undefined);
            fixture.componentRef.setInput('component', {
                id: 'test-win',
                bar: { active: true, title: 'Component Title', buttons: true },
                index: signal(0),
            } as any);
            fixture.changeDetectorRef.detectChanges();

            const titleEl = fixture.debugElement.query(By.css('.window-title-text'));
            expect(titleEl).toBeTruthy();
            expect(titleEl.nativeElement.textContent.trim()).toBe('Component Title');
        });

        it('should display buttons from comp.bar.buttons when barButtons input is not provided', () => {
            fixture.componentRef.setInput('bar-buttons', undefined);
            fixture.componentRef.setInput('component', {
                id: 'test-win',
                bar: { active: true, title: 'Test', buttons: true },
                index: signal(0),
            } as any);
            fixture.changeDetectorRef.detectChanges();

            const buttonsEl = fixture.debugElement.query(By.css('.window-title-buttons'));
            expect(buttonsEl).toBeTruthy();
            const buttons = fixture.debugElement.queryAll(By.css('.window-title-buttons button'));
            expect(buttons.length).toBeGreaterThan(0);
        });

        it('should toggle fullscreen on button click', () => {
            const button = fixture.debugElement.query(By.css('.window-title-buttons button.bar-resize'));
            button.triggerEventHandler('click', null);
            // @ts-ignore
            expect(component.fullscreen()).toBe(true);
        });

        it('should display the title correctly', () => {
            const titleEl = fixture.debugElement.query(By.css('.window-title-text'));
            expect(titleEl.nativeElement.textContent).toContain('Test Window');
        });

        it('should toggle fullscreen when change is called', () => {
            const changeButton = fixture.debugElement.query(By.css('button.bar-resize'));

            // Act
            changeButton.triggerEventHandler('click', null);
            expect(component['fullscreen']()).toBe(true);

            // Check icon change
            fixture.changeDetectorRef.detectChanges();
            expect(fixture.debugElement.query(By.css('.icon-minimize-2'))).toBeTruthy();
        });

        it('should emit onClose and call remove when close is clicked', () => {
            const closeSpy = vi.spyOn(component.onClose, 'emit');
            const hostSpy = {
                remove: vi.fn().mockName('MagmaResizeHostElement.remove'),
            };
            fixture.componentRef.setInput('resizerHost', hostSpy);

            const closeButton = fixture.debugElement.query(By.css('button.bar-close'));
            closeButton.triggerEventHandler('click', null);

            expect(closeSpy).toHaveBeenCalled();
            expect(hostSpy.remove).toHaveBeenCalledWith(component);
            expect(component.isOpen()).toBe(false);

            // Check no window
            fixture.changeDetectorRef.detectChanges();
            const content = fixture.debugElement.query(By.css('div.content'));
            expect(content).toBeNull();
        });

        it('should hide/show window when minimize/restore is called', () => {
            const changeButton = fixture.debugElement.query(By.css('button.bar-minimize'));

            // Act
            changeButton.triggerEventHandler('click', null);
            expect(component['minimized']()).toBe(true);

            // Check no window
            fixture.changeDetectorRef.detectChanges();
            const content = fixture.debugElement.query(By.css('div.content'));
            expect(content).toBeNull();

            // Act
            component.restore();
            fixture.changeDetectorRef.detectChanges();
            const content2 = fixture.debugElement.query(By.css('div.content'));
            expect(content2).toBeDefined();
        });
    });

    describe('Dynamic Component', () => {
        it('should render dynamic component if provided', async () => {
            const mockComponentInfo = {
                component: TestComponent, // A real little component
                id: 'test',
                index: signal(0),
            } as any;

            fixture.componentRef.setInput('isOpen', true);
            fixture.componentRef.setInput('component', mockComponentInfo);
            fixture.changeDetectorRef.detectChanges();
            vi.advanceTimersByTime(0); // Allow time for the outlet to initialize
            fixture.changeDetectorRef.detectChanges();

            const button1 = fixture.debugElement.query(By.css('mg-test button'));
            expect(button1).not.toBeNull();

            // close
            vi.spyOn(component.onClose, 'emit');
            button1.nativeElement.click();
            expect(component.onClose.emit).toHaveBeenCalled();
        });
    });

    describe('Initial Position', () => {
        it('should use zone when zone is define', () => {
            // @ts-ignore
            vi.spyOn(component, 'getZone').mockReturnValue({
                getBoundingClientRect: () =>
                    ({
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: 0,
                        height: 0,
                    }) as DOMRect,
            } as any);
            // @ts-ignore
            component.elementRef = {
                nativeElement: { getBoundingClientRect: () => ({ left: 0, top: 0 }) },
            };
            component.ngOnInit();
            fixture.changeDetectorRef.detectChanges();

            // @ts-ignore
            expect(component.initPosition).toEqual({ x: 0, y: 0 });
            expect(component.x[0]).toBe(0);
            expect(component.y[0]).toBe(0);
        });

        it('should use zone when zone is define and change element position', () => {
            // @ts-ignore
            vi.spyOn(component, 'getZone').mockReturnValue({
                getBoundingClientRect: () =>
                    ({
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: 0,
                        height: 0,
                    }) as DOMRect,
            } as any);
            // @ts-ignore
            component.elementRef = {
                nativeElement: { getBoundingClientRect: () => ({ left: 250, top: 350 }) },
            };
            component.ngOnInit();
            fixture.changeDetectorRef.detectChanges();

            // @ts-ignore
            expect(component.initPosition).toEqual({ x: -250, y: -350 });
            expect(component.x[0]).toBe(0);
            expect(component.y[0]).toBe(0);
        });

        it('should position is center', () => {
            fixture.componentRef.setInput('position', 'center');
            // @ts-ignore
            vi.spyOn(component, 'getZone').mockReturnValue({
                getBoundingClientRect: () =>
                    ({
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: 0,
                        height: 0,
                    }) as DOMRect,
                offsetWidth: 500,
                offsetHeight: 500,
            } as any);
            // @ts-ignore
            component.elementRef = {
                nativeElement: {
                    getBoundingClientRect: () => ({ left: 250, top: 350 }),
                    offsetWidth: 100,
                    offsetHeight: 100,
                },
            };
            component.ngOnInit();
            fixture.changeDetectorRef.detectChanges();

            // @ts-ignore
            expect(component.initPosition).toEqual({ x: -250, y: -350 });
            expect(component.x[0]).toBe(-50);
            expect(component.y[0]).toBe(-150);
        });

        it('should position is center when no zone', () => {
            fixture.componentRef.setInput('position', 'center');
            // Mocking innerWidth
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 500,
            });

            // Mocking innerHeight
            Object.defineProperty(window, 'innerHeight', {
                writable: true,
                configurable: true,
                value: 500,
            });

            // @ts-ignore
            component.elementRef = {
                nativeElement: {
                    getBoundingClientRect: () => ({ left: 250, top: 350 }),
                    offsetWidth: 100,
                    offsetHeight: 100,
                },
            };
            component.ngOnInit();
            fixture.changeDetectorRef.detectChanges();

            // @ts-ignore
            expect(component.initPosition).toEqual({ x: 0, y: 0 });
            expect(component.x[0]).toBe(200);
            expect(component.y[0]).toBe(200);
        });

        it('should position is {x, y}', () => {
            fixture.componentRef.setInput('position', { x: 10, y: 20 });
            // @ts-ignore
            vi.spyOn(component, 'getZone').mockReturnValue({
                getBoundingClientRect: () =>
                    ({
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: 0,
                        height: 0,
                    }) as DOMRect,
                offsetWidth: 500,
                offsetHeight: 500,
            } as any);
            // @ts-ignore
            component.elementRef = {
                nativeElement: {
                    getBoundingClientRect: () => ({ left: 250, top: 350 }),
                    offsetWidth: 100,
                    offsetHeight: 100,
                },
            };
            component.ngOnInit();
            fixture.changeDetectorRef.detectChanges();

            // @ts-ignore
            expect(component.initPosition).toEqual({ x: -250, y: -350 });
            expect(component.x[0]).toBe(-240);
            expect(component.y[0]).toBe(-330);
        });
    });

    describe('Event Handling', () => {
        it('should select window on mousedown', () => {
            // Ensure that the mock has been correctly passed to the component
            fixture.componentRef.setInput('resizerHost', mockResizeHost);
            fixture.changeDetectorRef.detectChanges();

            component.mousedown();

            // Instead of the complete object, we just check the call
            expect(mockResizeHost.select).toHaveBeenCalled();
        });
    });

    describe('change() - Fullscreen Toggling', () => {
        let mockElement: HTMLDivElement;
        let dragSpy: MockDragSpy;

        beforeEach(() => {
            // 1. Create the mock element and the spy for CdkDrag
            mockElement = document.createElement('div');
            dragSpy = new MockDragSpy();

            // 2. Mock the signals (elementWin and cdkDrag)
            // @ts-ignore
            vi.spyOn(component, 'elementWin').mockReturnValue([{ nativeElement: mockElement }] as any);
            // @ts-ignore
            vi.spyOn(component, 'cdkDrag').mockReturnValue([dragSpy] as any);

            // 3. Mock getZone to return fixed dimensions for the test
            vi.spyOn<any, any>(component, 'getZone').mockReturnValue({
                offsetWidth: 1920,
                offsetHeight: 1080,
            });

            // 4. Set initial position
            component['initPosition'] = { x: 0, y: 0 };
        });

        it('should enter fullscreen: maximize size and reset position to initPosition', () => {
            // Ensure we start in windowed mode
            component['fullscreen'].set(false);

            component.change();

            // Verify state change
            expect(component['fullscreen']()).toBe(true);

            // Verify it moved to the container's top-left (initPosition)
            expect(component?.['cdkDrag']()?.[0]?.setFreeDragPosition).toHaveBeenCalledWith({ x: 0, y: 0 });

            // Verify styles match the zone dimensions we mocked
            expect(mockElement.style.width).toBe('1920px');
            expect(mockElement.style.height).toBe('1080px');
        });

        it('should exit fullscreen: restore saved window coordinates and dimensions', () => {
            // 1. Setup: Start in fullscreen with specific saved "windowed" values
            component['fullscreen'].set(true);

            // Stored coordinates: pos(50, 60), size(400x300)
            component['x'] = [50, 400];
            component['y'] = [60, 300];

            // 2. Act
            component.change();

            // 3. Assert
            expect(component['fullscreen']()).toBe(false);

            // Verify it restored the Drag position to our stored x[0] and y[0]
            expect(component?.['cdkDrag']()?.[0]?.setFreeDragPosition).toHaveBeenCalledWith({ x: 50, y: 60 });

            // Verify it restored the Element size to our stored x[1] and y[1]
            expect(mockElement.style.width).toBe('400px');
            expect(mockElement.style.height).toBe('300px');
        });

        it('should use window dimensions if getZone returns null', () => {
            // Mock getZone to return null to test the fallback (window.innerWidth)
            (component as any).getZone.mockReturnValue(null);
            component['fullscreen'].set(false);

            component.change();

            expect(mockElement.style.width).toBe(window.innerWidth + 'px');
            expect(mockElement.style.height).toBe(window.innerHeight + 'px');
        });
    });

    describe('Fixed & Over', () => {
        it('should window not over', () => {
            fixture.componentRef.setInput('over', false);

            fixture.changeDetectorRef.detectChanges();

            // Assert
            expect(window.getComputedStyle(component['elementRef'].nativeElement).getPropertyValue('--index')).toBe(
                '0',
            );
        });

        it('should window over', () => {
            fixture.componentRef.setInput('over', true);

            fixture.changeDetectorRef.detectChanges();

            // Assert
            expect(window.getComputedStyle(component['elementRef'].nativeElement).getPropertyValue('--index')).toBe(
                '1000',
            );
        });

        it('should window not fixed', () => {
            fixture.componentRef.setInput('fixed', false);
            fixture.componentRef.setInput('isOpen', true);
            fixture.changeDetectorRef.detectChanges();

            // Assert

            expect(component['cdkDrag']()?.[0]?.disabled).toBe(false);
        });

        it('should window fixed', () => {
            fixture.componentRef.setInput('fixed', true);
            fixture.componentRef.setInput('isOpen', true);
            fixture.changeDetectorRef.detectChanges();

            // Assert
            expect(component['cdkDrag']()?.[0]?.disabled).toBe(true);
        });

        it('should disable drag when fixed is an edge string', () => {
            fixture.componentRef.setInput('fixed', 'bottom');
            fixture.componentRef.setInput('isOpen', true);
            fixture.changeDetectorRef.detectChanges();

            expect(component['cdkDrag']()?.[0]?.disabled).toBe(true);
        });

        it('should add fixed-edge and fixed-top class to host when fixed is "top"', () => {
            fixture.componentRef.setInput('fixed', 'top');
            fixture.componentRef.setInput('isOpen', true);
            fixture.changeDetectorRef.detectChanges();

            const host = fixture.debugElement.nativeElement as HTMLElement;
            expect(host.classList.contains('fixed-edge')).toBe(true);
            expect(host.classList.contains('fixed-top')).toBe(true);
        });

        it('should add fixed-edge and fixed-bottom class to host when fixed is "bottom"', () => {
            fixture.componentRef.setInput('fixed', 'bottom');
            fixture.componentRef.setInput('isOpen', true);
            fixture.changeDetectorRef.detectChanges();

            const host = fixture.debugElement.nativeElement as HTMLElement;
            expect(host.classList.contains('fixed-edge')).toBe(true);
            expect(host.classList.contains('fixed-bottom')).toBe(true);
        });

        it('should add fixed-edge and fixed-left class to host when fixed is "left"', () => {
            fixture.componentRef.setInput('fixed', 'left');
            fixture.componentRef.setInput('isOpen', true);
            fixture.changeDetectorRef.detectChanges();

            const host = fixture.debugElement.nativeElement as HTMLElement;
            expect(host.classList.contains('fixed-edge')).toBe(true);
            expect(host.classList.contains('fixed-left')).toBe(true);
        });

        it('should add fixed-edge and fixed-right class to host when fixed is "right"', () => {
            fixture.componentRef.setInput('fixed', 'right');
            fixture.componentRef.setInput('isOpen', true);
            fixture.changeDetectorRef.detectChanges();

            const host = fixture.debugElement.nativeElement as HTMLElement;
            expect(host.classList.contains('fixed-edge')).toBe(true);
            expect(host.classList.contains('fixed-right')).toBe(true);
        });

        it('should not add fixed-edge class when fixed is true (boolean)', () => {
            fixture.componentRef.setInput('fixed', true);
            fixture.componentRef.setInput('isOpen', true);
            fixture.changeDetectorRef.detectChanges();

            const host = fixture.debugElement.nativeElement as HTMLElement;
            expect(host.classList.contains('fixed-edge')).toBe(false);
            expect(host.classList.contains('fixed-top')).toBe(false);
        });

        it('should not add fixed-edge class when fixed is false', () => {
            fixture.componentRef.setInput('fixed', false);
            fixture.componentRef.setInput('isOpen', true);
            fixture.changeDetectorRef.detectChanges();

            const host = fixture.debugElement.nativeElement as HTMLElement;
            expect(host.classList.contains('fixed-edge')).toBe(false);
        });

        it('should apply edge-fixed from component infos when no direct input', () => {
            fixture.componentRef.setInput('fixed', undefined);
            fixture.componentRef.setInput('isOpen', true);
            fixture.componentRef.setInput('component', {
                id: 'test-win',
                fixed: 'right',
                index: signal(0),
            } as any);
            fixture.changeDetectorRef.detectChanges();

            const host = fixture.debugElement.nativeElement as HTMLElement;
            expect(host.classList.contains('fixed-edge')).toBe(true);
            expect(host.classList.contains('fixed-right')).toBe(true);
            expect(component['cdkDrag']()?.[0]?.disabled).toBe(true);
        });
    });

    describe('getDragBoundary()', () => {
        let zoneElement: HTMLElement;

        beforeEach(() => {
            zoneElement = document.createElement('div');
            zoneElement.id = 'boundary-zone';
            document.body.appendChild(zoneElement);
        });

        afterEach(() => {
            if (zoneElement.parentNode) {
                document.body.removeChild(zoneElement);
            }
        });

        it('should return "body" when no zoneSelector is provided', () => {
            fixture.componentRef.setInput('zoneSelector', undefined);
            fixture.componentRef.setInput('component', undefined);

            const result = component.getDragBoundary();

            expect(result).toBe('body');
        });

        it('should return the selector when the zone element is an ancestor of the component', () => {
            zoneElement.appendChild(fixture.debugElement.nativeElement);
            fixture.componentRef.setInput('zoneSelector', '#boundary-zone');

            const result = component.getDragBoundary();

            expect(result).toBe('#boundary-zone');
        });

        it('should return "body" when the zone element is NOT an ancestor (overlay mode)', () => {
            fixture.componentRef.setInput('zoneSelector', '#boundary-zone');

            const result = component.getDragBoundary();

            expect(result).toBe('body');
        });

        it('should return "body" when the selector does not match any element', () => {
            fixture.componentRef.setInput('zoneSelector', '#non-existent');

            const result = component.getDragBoundary();

            expect(result).toBe('body');
        });

        it('should use component infos zoneSelector as fallback', () => {
            zoneElement.appendChild(fixture.debugElement.nativeElement);
            fixture.componentRef.setInput('zoneSelector', undefined);
            fixture.componentRef.setInput('component', {
                id: 'test-win',
                zoneSelector: '#boundary-zone',
                index: signal(0),
            } as any);

            const result = component.getDragBoundary();

            expect(result).toBe('#boundary-zone');
        });
    });

    describe('constrainPosition()', () => {
        beforeEach(() => {
            const mockEl = document.createElement('div');
            Object.defineProperty(mockEl, 'offsetWidth', { value: 200, configurable: true });
            Object.defineProperty(mockEl, 'offsetHeight', { value: 150, configurable: true });
            // @ts-ignore
            vi.spyOn(component, 'elementWin').mockReturnValue([{ nativeElement: mockEl }] as any);

            vi.spyOn<any, any>(component, 'getZone').mockReturnValue({
                offsetWidth: 1000,
                offsetHeight: 600,
            });

            component['initPosition'] = { x: 0, y: 0 };
        });

        it('should not change a point within the zone bounds', () => {
            const result = component.constrainPosition({ x: 100, y: 100 }, null);
            expect(result).toEqual({ x: 100, y: 100 });
        });

        it('should clamp X to min (initPosition.x) when point is too far left', () => {
            component['initPosition'] = { x: 10, y: 0 };
            const result = component.constrainPosition({ x: -50, y: 100 }, null);
            expect(result.x).toBe(10);
        });

        it('should clamp X to max when point exceeds zone width', () => {
            // maxX = 1000 - 200 + 0 = 800
            const result = component.constrainPosition({ x: 900, y: 100 }, null);
            expect(result.x).toBe(800);
        });

        it('should clamp Y to min (initPosition.y) when point is too far up', () => {
            component['initPosition'] = { x: 0, y: 20 };
            const result = component.constrainPosition({ x: 100, y: -10 }, null);
            expect(result.y).toBe(20);
        });

        it('should clamp Y to max when point exceeds zone height', () => {
            // maxY = 600 - 150 + 0 = 450
            const result = component.constrainPosition({ x: 100, y: 500 }, null);
            expect(result.y).toBe(450);
        });

        it('should use window dimensions when getZone returns null', () => {
            (component as any).getZone.mockReturnValue(null);

            Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: true });
            Object.defineProperty(window, 'innerHeight', { value: 1080, configurable: true });

            // maxX = 1920 - 200 = 1720, maxY = 1080 - 150 = 930
            const result = component.constrainPosition({ x: 2000, y: 1000 }, null);
            expect(result).toEqual({ x: 1720, y: 930 });
        });

        it('should account for initPosition offsets', () => {
            component['initPosition'] = { x: -100, y: -50 };
            // minX = -100, maxX = 1000 - 200 + (-100) = 700
            // minY = -50, maxY = 600 - 150 + (-50) = 400

            const result = component.constrainPosition({ x: -200, y: -80 }, null);
            expect(result).toEqual({ x: -100, y: -50 });
        });
    });

    describe('Edge-fixed initialization', () => {
        it('should NOT call updatePosition in ngOnInit when edge-fixed', () => {
            fixture.componentRef.setInput('fixed', 'bottom');
            fixture.componentRef.setInput('isOpen', true);
            fixture.changeDetectorRef.detectChanges();

            vi.spyOn(component, 'updatePosition');
            component.ngOnInit();

            expect(component.updatePosition).not.toHaveBeenCalled();
        });

        it('should call updatePosition in ngOnInit when NOT edge-fixed', () => {
            fixture.componentRef.setInput('fixed', true);
            fixture.componentRef.setInput('isOpen', true);
            fixture.changeDetectorRef.detectChanges();

            vi.spyOn(component, 'updatePosition');
            // @ts-ignore
            vi.spyOn(component, 'getZone').mockReturnValue(null);
            component.ngOnInit();

            expect(component.updatePosition).toHaveBeenCalled();
        });

        it('should NOT call updatePosition in winInit when edge-fixed', () => {
            fixture.componentRef.setInput('fixed', 'left');
            fixture.componentRef.setInput('isOpen', true);
            fixture.changeDetectorRef.detectChanges();

            vi.spyOn(component, 'updatePosition');
            component.winInit();
            vi.advanceTimersByTime(0);

            expect(component.updatePosition).not.toHaveBeenCalled();
        });

        it('should call updatePosition in winInit when NOT edge-fixed (first render)', () => {
            fixture.componentRef.setInput('isOpen', true);
            fixture.changeDetectorRef.detectChanges();

            vi.spyOn(component, 'updatePosition');
            component.winInit();
            vi.advanceTimersByTime(0);

            expect(component.updatePosition).toHaveBeenCalled();
        });

        it('should restore drag position in winInit when restoring from minimize', () => {
            fixture.componentRef.setInput('isOpen', true);
            fixture.changeDetectorRef.detectChanges();

            component['x'] = [120, 400];
            component['y'] = [80, 300];

            // Simulate restore flow
            component.minimize();
            fixture.changeDetectorRef.detectChanges();
            component.restore();
            fixture.changeDetectorRef.detectChanges();

            const dragSpy = new MockDragSpy();
            // @ts-ignore
            vi.spyOn(component, 'cdkDrag').mockReturnValue([dragSpy] as any);

            component.winInit();
            vi.advanceTimersByTime(0);

            expect(dragSpy.setFreeDragPosition).toHaveBeenCalledWith({ x: 120, y: 80 });
        });

        it('should set position:absolute on host when edge-fixed', () => {
            fixture.componentRef.setInput('fixed', 'top');
            fixture.componentRef.setInput('isOpen', true);
            fixture.changeDetectorRef.detectChanges();

            const host = fixture.debugElement.nativeElement as HTMLElement;
            expect(host.style.position).toBe('absolute');
        });

        it('should NOT set position:absolute on host when fixed is boolean true', () => {
            fixture.componentRef.setInput('fixed', true);
            fixture.componentRef.setInput('isOpen', true);
            fixture.changeDetectorRef.detectChanges();

            const host = fixture.debugElement.nativeElement as HTMLElement;
            expect(host.style.position).toBe('');
        });
    });
});
