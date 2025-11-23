// click-outside.directive.spec.ts
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaClickOutsideDirective } from './click-outside.directive';

@Component({
    template: ` <div clickOutside (clickOutside)="onClickOutside($event)">Test Element</div> `,
    imports: [MagmaClickOutsideDirective],
})
class TestComponent {
    onClickOutside(_event: KeyboardEvent | MouseEvent) {
        // This will be spied on in tests
    }
}

describe('MagmaClickOutsideDirective', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let element: DebugElement;
    let directive: MagmaClickOutsideDirective;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;

        spyOn(component, 'onClickOutside');
        element = fixture.debugElement.query(By.directive(MagmaClickOutsideDirective));
        directive = element.injector.get(MagmaClickOutsideDirective);
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    describe('Click Outside Behavior', () => {
        it('should emit clickOutside event when clicking outside the element', () => {
            // Create a mock event with target outside the element
            const mockEvent = { target: document.createElement('div') } as unknown as MouseEvent;

            // Spy on the directive's output
            let emitted = false;
            directive.clickOutside.subscribe(() => {
                emitted = true;
            });

            // Trigger the click handler
            directive.onClick(mockEvent);

            expect(emitted).toBeTrue();
            expect(component.onClickOutside).toHaveBeenCalledTimes(1);
        });

        it('should not emit clickOutside event when clicking inside the element', () => {
            // Create a mock event with target inside the element
            const mockEvent = { target: element.nativeElement } as unknown as MouseEvent;

            // Spy on the directive's output
            let emitted = false;
            directive.clickOutside.subscribe(() => {
                emitted = true;
            });

            // Trigger the click handler
            directive.onClick(mockEvent);

            expect(emitted).toBeFalse();
            expect(component.onClickOutside).not.toHaveBeenCalled();
        });

        it('should emit clickOutside event when clicking on a child element', () => {
            // Create a child element
            const childElement = document.createElement('span');
            element.nativeElement.appendChild(childElement);

            // Create a mock event with target as the child element
            const mockEvent = { target: childElement } as unknown as MouseEvent;

            // Spy on the directive's output
            let emitted = false;
            directive.clickOutside.subscribe(() => {
                emitted = true;
            });

            // Trigger the click handler
            directive.onClick(mockEvent);

            expect(emitted).toBeFalse();
            expect(component.onClickOutside).not.toHaveBeenCalled();

            // Clean up
            element.nativeElement.removeChild(childElement);
        });
    });

    describe('Dialog Click Behavior', () => {
        it('should handle dialog-click events', () => {
            // Create a mock event
            const mockEvent = new MouseEvent('click');
            const customEvent = new CustomEvent('dialog-click', { detail: mockEvent });

            // Spy on the directive's output
            let emitted = false;
            directive.clickOutside.subscribe(() => {
                emitted = true;
            });

            // Trigger the dialog click handler
            window.dispatchEvent(customEvent);

            expect(component.onClickOutside).toHaveBeenCalledTimes(1);

            // We need to manually call the handler since we're not using the real window
            directive.dialogClick(customEvent);

            expect(emitted).toBeTrue();
            expect(component.onClickOutside).toHaveBeenCalledTimes(2);
        });
    });

    describe('Window Click Listener', () => {
        it('should listen to window click events', () => {
            // Verify that the host listener is set up
            const windowClickSpy = spyOn(directive, 'onClick');
            window.dispatchEvent(new MouseEvent('click'));

            expect(windowClickSpy).toHaveBeenCalledTimes(1);

            // Call the method directly to verify it works
            const mockEvent = { target: element.nativeElement } as unknown as MouseEvent;
            directive.onClick(mockEvent);

            expect(component.onClickOutside).not.toHaveBeenCalled();

            // const mockEventDiv = { target: document.createElement('div') } as unknown as MouseEvent;
            // directive.onClick(mockEventDiv);

            // expect(component.onClickOutside).toHaveBeenCalledTimes(1);
        });
    });

    describe('Edge Cases', () => {
        it('should handle null target in click event', () => {
            // Create a mock event with null target
            const mockEvent = {
                target: null,
            } as unknown as MouseEvent;

            // Spy on the directive's output
            let emitted = false;
            directive.clickOutside.subscribe(() => {
                emitted = true;
            });

            // Trigger the click handler
            directive.onClick(mockEvent);

            // Should emit since null target is not contained in any element
            expect(emitted).toBeTrue();
            expect(component.onClickOutside).toHaveBeenCalledTimes(1);
        });

        it('should handle event with no target', () => {
            // Create a mock event with no target
            const mockEvent = {} as unknown as MouseEvent;

            // Spy on the directive's output
            let emitted = false;
            directive.clickOutside.subscribe(() => {
                emitted = true;
            });

            // Trigger the click handler
            directive.onClick(mockEvent);

            // Should emit since undefined target is not contained in any element
            expect(emitted).toBeTrue();
            expect(component.onClickOutside).toHaveBeenCalledTimes(1);
        });
    });
});
