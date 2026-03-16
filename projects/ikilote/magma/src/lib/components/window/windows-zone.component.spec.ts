import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AbstractWindowComponent, MagmaWindowInfos } from './window.component';
import { MagmaWindowsZone } from './windows-zone.component';

@Component({ selector: 'mg-test', template: `<button (click)="close()">close</button>` })
class TestComponent extends AbstractWindowComponent {}

describe('MagmaWindowsZone', () => {
    let component: MagmaWindowsZone;
    let fixture: ComponentFixture<MagmaWindowsZone>;
    let mockWindows: MagmaWindowInfos[];

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [MagmaWindowsZone] }).compileComponents();

        fixture = TestBed.createComponent(MagmaWindowsZone);
        component = fixture.componentInstance;

        // Create a set of dummy windows
        mockWindows = [
            { id: 'win-0', index: 0, component: TestComponent } as any,
            { id: 'win-1', index: 1, component: TestComponent } as any,
            { id: 'win-2', index: 2, component: TestComponent } as any,
        ];

        // Using the modern setInput API for Signal inputs
        fixture.componentRef.setInput('windows', mockWindows);
        fixture.detectChanges();
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
            expect(target.index).toBe(2);
            expect(mockWindows[1].index).toBe(0);
            expect(mockWindows[2].index).toBe(1);
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

        it('should trigger removal when mg-window emits onClose', () => {
            vi.spyOn(component, 'remove');
            const windowEl = fixture.debugElement.query(By.css('mg-window'));

            windowEl.triggerEventHandler('onClose', null);

            expect(component.remove).toHaveBeenCalledWith(mockWindows[0]);
        });
    });
});
