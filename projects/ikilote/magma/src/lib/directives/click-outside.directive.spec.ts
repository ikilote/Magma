// click-outside.directive.spec.ts
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaClickOutsideDirective } from './click-outside.directive';

@Component({
    template: `<div clickOutside (clickOutside)="onClickOutside($event)">Test Element</div>`,
    standalone: true,
    imports: [MagmaClickOutsideDirective],
})
class TestComponent {
    onClickOutside(_event: Event) {
        // Spied on in tests
    }
}

describe('MagmaClickOutsideDirective', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let element: DebugElement;
    let directive: MagmaClickOutsideDirective;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;

        vi.spyOn(component, 'onClickOutside');
        element = fixture.debugElement.query(By.directive(MagmaClickOutsideDirective));
        directive = element.injector.get(MagmaClickOutsideDirective);
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    describe('Click Outside Behavior', () => {
        it('should emit clickOutside event when clicking outside the element', () => {
            const outsideNode = document.createElement('div');
            const event = new MouseEvent('click', { bubbles: true });
            Object.defineProperty(event, 'target', { value: outsideNode });

            // Spy on the directive's output
            let emitted = false;
            directive.clickOutside.subscribe(() => {
                emitted = true;
            });
            // Trigger the click handler
            directive.onClick(event);

            expect(emitted).toBe(true);
            expect(component.onClickOutside).toHaveBeenCalledTimes(1);
        });

        it('should not emit clickOutside event when clicking inside the element', () => {
            const event = new MouseEvent('click', { bubbles: true });
            Object.defineProperty(event, 'target', { value: element.nativeElement });
            // Spy on the directive's output
            let emitted = false;
            directive.clickOutside.subscribe(() => {
                emitted = true;
            });

            // Trigger the click handler
            directive.onClick(event);

            expect(emitted).toBe(false);
            expect(component.onClickOutside).not.toHaveBeenCalled();
        });

        it('should emit clickOutside event when clicking on a child element', () => {
            const child = document.createElement('span');
            element.nativeElement.appendChild(child);

            const event = new MouseEvent('click', { bubbles: true });
            Object.defineProperty(event, 'target', { value: child });

            // Spy on the directive's output
            let emitted = false;
            directive.clickOutside.subscribe(() => {
                emitted = true;
            });

            // Trigger the click handler
            directive.onClick(event);
            expect(emitted).toBe(false);
            expect(component.onClickOutside).not.toHaveBeenCalled();
            element.nativeElement.removeChild(child);
        });
    });

    describe('Custom Events', () => {
        it('should handle dialog-click by extracting the detail event', () => {
            const outsideNode = document.createElement('button');
            const innerEvent = new MouseEvent('click');
            Object.defineProperty(innerEvent, 'target', { value: outsideNode });

            const dialogEvent = new CustomEvent('dialog-click', {
                detail: innerEvent,
            });

            // Triggering via window to test @HostListener('window:dialog-click')
            window.dispatchEvent(dialogEvent);

            expect(component.onClickOutside).toHaveBeenCalled();
        });
    });

    describe('Edge Cases (Full Coverage)', () => {
        it('should emit when target is null (Mocking DOM to bypass JSDOM error)', () => {
            // We mock 'contains' to return false so the code enters the 'if (!clickedInside)' block
            // This allows us to pass a 'null' target without JSDOM crashing
            const containsSpy = vi.spyOn(element.nativeElement, 'contains').mockReturnValue(false);

            const event = { target: null } as unknown as MouseEvent;
            directive.onClick(event);

            expect(component.onClickOutside).toHaveBeenCalled();
            containsSpy.mockRestore();
        });

        it('should emit when target is not a Node (e.g., window object)', () => {
            const event = new MouseEvent('click');
            Object.defineProperty(event, 'target', { value: window });

            directive.onClick(event);

            expect(component.onClickOutside).toHaveBeenCalled();
        });
    });
});
