import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AbstractWindowComponent, MagmaWindow } from './window.component';

import { MagmaResizeHostElement } from '../../directives/resizer';

@Component({ selector: 'mg-test', template: `<button (click)="close()">close</button>` })
class TestComponent extends AbstractWindowComponent {}

describe('MagmaWindow', () => {
    let component: MagmaWindow;
    let fixture: ComponentFixture<MagmaWindow>;
    let mockResizeHost: jasmine.SpyObj<MagmaResizeHostElement>;

    beforeEach(async () => {
        mockResizeHost = jasmine.createSpyObj('MagmaResizeHostElement', ['select', 'remove']);

        await TestBed.configureTestingModule({
            imports: [MagmaWindow],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaWindow);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Open/Close', () => {
        it('should open the window', () => {
            component.open();
            expect(component.isOpen()).toBeTrue();
        });

        it('should close the window and emit onClose', () => {
            spyOn(component.onClose, 'emit');
            component.open();
            component.close();
            expect(component.isOpen()).toBeFalse();
            expect(component.onClose.emit).toHaveBeenCalled();
        });

        it('should render and initialize when isOpen is true', fakeAsync(() => {
            fixture.componentRef.setInput('isOpen', true);
            fixture.detectChanges();

            // simulate ngInit (directive MagmaNgInit in template   )
            component.winInit();
            tick(); // for setTimeout in winInit

            const content = fixture.debugElement.query(By.css('.content'));
            expect(content).not.toBeNull();
            expect(component['isOpen']()).toBeTrue();
        }));

        it('should not render anything if isOpen is false', () => {
            fixture.componentRef.setInput('isOpen', false);
            fixture.detectChanges();
            const content = fixture.debugElement.query(By.css('.content'));
            expect(content).toBeNull();
        });
    });

    describe('Drag and Drop', () => {
        beforeEach(() => {
            const mockEl = { nativeElement: document.createElement('div') };
            // @ts-ignore
            spyOn(component, 'elementWin').and.returnValue([mockEl] as any);
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
            fixture.detectChanges();

            const mockDragEnd = {
                distance: { x: 50, y: 100 },
                source: { element: { nativeElement: {} } },
            } as CdkDragEnd;

            // Mock the zone to avoid offsetWidth errors on null
            spyOn<any>(component, 'getZone').and.returnValue({ offsetWidth: 1000, offsetHeight: 1000 });

            component.drag(mockDragEnd);

            // The coordinates x[0] and y[0] must have been incremented.
            expect(component['x'][0]).toBeGreaterThanOrEqual(50);
            expect(component['y'][0]).toBeGreaterThanOrEqual(100);
        });
    });

    describe('Positioning & Resizing', () => {
        let mockElement: HTMLDivElement;
        let dragSpy: jasmine.SpyObj<any>;

        beforeEach(fakeAsync(() => {
            fixture.componentRef.setInput('isOpen', true);
            fixture.detectChanges();
            component.winInit();
            tick();

            mockElement = document.createElement('div');
            mockElement.style.width = '200px';
            mockElement.style.height = '100px';
            mockElement.style.display = 'block';
            mockElement.style.position = 'absolute';

            document.body.appendChild(mockElement);

            dragSpy = jasmine.createSpyObj('CdkDrag', ['setFreeDragPosition']);

            // Mock signals: we simulate the return of ViewChildren/ViewChild
            // If they are signals, we mock the function itself
            // @ts-ignore
            spyOn(component, 'elementWin').and.returnValue([{ nativeElement: mockElement }] as any);
            // @ts-ignore
            spyOn(component, 'cdkDrag').and.returnValue([dragSpy] as any);

            // Initialisation par défaut pour éviter les undefined
            component['x'] = [0, 0];
            component['y'] = [0, 0];
            component['initPosition'] = { x: 0, y: 0 };
        }));

        it('should update LEFT: increases width and shifts X position', () => {
            component['x'] = [100, 200];

            // Act: We move the left edge from 100 to 80
            component.update('left', [80, 200]);

            // Assert
            expect(mockElement.style.width).toBe('220px'); // 100 - 80 + 200
            expect(dragSpy.setFreeDragPosition).toHaveBeenCalledWith(jasmine.objectContaining({ x: 80 }));
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

            // Act
            component.update('top', [70, 200]);

            // Assert
            expect(mockElement.style.height).toBe('230px'); // 100 - 70 + 200
            expect(dragSpy.setFreeDragPosition).toHaveBeenCalledWith(jasmine.objectContaining({ y: 70 }));
        });

        it('should update BOTTOM: increases height while keeping Y position static', () => {
            component['y'] = [50, 100];

            // Act
            component.update('bottom', [50, 150]);

            expect(mockElement.style.height).toBe('150px');
            expect(component['y'][0]).toBe(50);
        });
    });

    describe('Title Bar', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('isOpen', true);
            fixture.componentRef.setInput('bar', true);
            fixture.componentRef.setInput('bar-title', 'Test Window');
            fixture.componentRef.setInput('bar-buttons', true);
            fixture.detectChanges();
        });

        it('should display title bar if bar is true', () => {
            const titleBar = fixture.debugElement.query(By.css('.window-title-bar'));
            expect(titleBar).toBeTruthy();
        });

        it('should display title bar if bar is false', () => {
            fixture.componentRef.setInput('bar', false);
            fixture.detectChanges();
            const titleBar = fixture.debugElement.query(By.css('.window-title-bar'));
            expect(titleBar).toBeNull();
        });

        it('should toggle fullscreen on button click', () => {
            const button = fixture.debugElement.query(By.css('.window-title-buttons button'));
            button.triggerEventHandler('click', null);
            // @ts-ignore
            expect(component.fullscreen()).toBeTrue();
        });

        it('should display the title correctly', () => {
            const titleEl = fixture.debugElement.query(By.css('.window-title-text'));
            expect(titleEl.nativeElement.textContent).toContain('Test Window');
        });

        it('should toggle fullscreen when change is called', () => {
            const changeButton = fixture.debugElement.query(By.css('button'));

            // Act
            changeButton.triggerEventHandler('click', null);
            expect(component['fullscreen']()).toBeTrue();

            // Check icon change
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css('.icon-minimize-2'))).toBeTruthy();
        });

        it('should emit onClose and call remove when close is clicked', () => {
            const closeSpy = spyOn(component.onClose, 'emit');
            const hostSpy = jasmine.createSpyObj('MagmaResizeHostElement', ['remove']);
            fixture.componentRef.setInput('resizerHost', hostSpy);

            const closeButton = fixture.debugElement.queryAll(By.css('button'))[1];
            closeButton.triggerEventHandler('click', null);

            expect(closeSpy).toHaveBeenCalled();
            expect(hostSpy.remove).toHaveBeenCalledWith(component);
            expect(component.isOpen()).toBeFalse();
        });
    });

    describe('Dynamic Component', () => {
        it('should render dynamic component if provided', fakeAsync(() => {
            const mockComponentInfo = {
                component: TestComponent, // A real little component
                id: 'test',
            } as any;

            fixture.componentRef.setInput('isOpen', true);
            fixture.componentRef.setInput('component', mockComponentInfo);
            fixture.detectChanges();
            tick(); // Allow time for the outlet to initialize
            fixture.detectChanges();

            const button1 = fixture.debugElement.query(By.css('mg-test button'));
            expect(button1).not.toBeNull();

            // close
            spyOn(component.onClose, 'emit');
            button1.nativeElement.click();
            expect(component.onClose.emit).toHaveBeenCalled();
        }));
    });

    describe('Initial Position', () => {
        it('should center the window if position is center', () => {
            fixture.componentRef.setInput('position', 'center');
            component.ngOnInit();
            expect(component.x[0]).toBeGreaterThan(0);
            expect(component.y[0]).toBeGreaterThan(0);
        });
    });

    describe('Event Handling', () => {
        it('should select window on mousedown', () => {
            // Ensure that the mock has been correctly passed to the component
            fixture.componentRef.setInput('resizerHost', mockResizeHost);
            fixture.detectChanges();

            component.mousedown();

            // Instead of the complete object, we just check the call
            expect(mockResizeHost.select).toHaveBeenCalled();
        });
    });
});
