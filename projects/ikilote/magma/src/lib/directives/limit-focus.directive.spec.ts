import { Component, ElementRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaLimitFocusDirective, MagmaLimitFocusFirstDirective, focusRules } from './limit-focus.directive';

/** Function to simulate Tab and actually move focus */
function simulateTab(reverse = false) {
    const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        code: 'Tab',
        keyCode: 9,
        shiftKey: reverse, // Shift+Tab for reverse navigation
        bubbles: true,
        cancelable: true,
    });

    document.activeElement?.dispatchEvent(event);

    // If default behavior wasn't prevented, manually move focus
    if (!event.defaultPrevented) {
        const focusableElements = Array.from(document.querySelectorAll<any>(focusRules)).filter(
            el => !el.disabled && el.offsetParent !== null,
        );

        const currentIndex = focusableElements.indexOf(document.activeElement);
        const nextIndex = reverse
            ? (currentIndex - 1 + focusableElements.length) % focusableElements.length
            : (currentIndex + 1) % focusableElements.length;

        focusableElements[nextIndex]?.focus();
    }
}

@Component({
    template: `
        <div #container limitFocus>
            <input id="input1" />
            <button id="button1">Button 1</button>
            <button disabled>Button disabled</button>
            <div>
                <input limitFocusFirst="1" id="input2" />
            </div>
            <div>
                <button limitFocusFirst="2" id="button2">Button 2</button>
                <button disabled>Button disabled</button>
            </div>
        </div>
    `,
    imports: [MagmaLimitFocusDirective, MagmaLimitFocusFirstDirective],
})
class TestHostComponent {
    container = viewChild.required<ElementRef<HTMLDivElement>>('container');
}

describe('MagmaLimitFocusDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;
    let containerElement: HTMLDivElement;
    let input1: HTMLInputElement;
    let input2: HTMLInputElement;
    let button1: HTMLButtonElement;
    let button2: HTMLButtonElement;
    let limitFocusDirective: MagmaLimitFocusDirective;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        hostComponent = fixture.componentInstance;

        containerElement = hostComponent.container().nativeElement;
        input1 = containerElement.querySelector('#input1')!;
        input2 = containerElement.querySelector('#input2')!;
        button1 = containerElement.querySelector('#button1')!;
        button2 = containerElement.querySelector('#button2')!;

        const directiveEl = fixture.debugElement.query(By.directive(MagmaLimitFocusDirective));
        limitFocusDirective = directiveEl.injector.get(MagmaLimitFocusDirective);
        fixture.detectChanges();
    });

    // Test: Should create the directive
    it('should create the directive', () => {
        expect(limitFocusDirective).toBeTruthy();
    });

    // Test: Should focus the first focusable element with the lowest `limitFocusFirst` value
    it('should focus the first focusable element with the lowest `limitFocusFirst` value', () => {
        limitFocusDirective.focus();
        fixture.detectChanges();
        expect(document.activeElement).toBe(input2);
    });

    it('should handle Tab key', () => {
        input1.focus();
        fixture.detectChanges();

        simulateTab();

        fixture.detectChanges();

        expect(document.activeElement).toBe(button1);
    });

    // Test: Should trap focus inside the container
    it('should trap focus inside the container', fakeAsync(() => {
        input1.focus();
        fixture.detectChanges();
        expect(document.activeElement).toBe(input1);

        simulateTab();

        fixture.detectChanges();

        expect(document.activeElement).toBe(button1);

        // Simulate pressing Shift+Tab
        simulateTab(true);

        fixture.detectChanges();
        expect(document.activeElement).toBe(input1);

        tick();
    }));

    it('should handle dynamic content changes', fakeAsync(() => {
        // Start by focusing the first input
        input1.focus();
        fixture.detectChanges();
        expect(document.activeElement).toBe(input1);

        // Simulate pressing Tab to move focus to the next element
        simulateTab();
        expect(document.activeElement).toBe(button1);
        tick();

        // Add a new focusable element dynamically
        const newButton = document.createElement('button');
        newButton.id = 'button3';
        newButton.textContent = 'Button 3';
        containerElement.appendChild(newButton);
        fixture.detectChanges();

        // Simulate pressing Tab again to move focus to the next element
        simulateTab();

        expect(document.activeElement).toBe(input2);

        tick();

        // Simulate pressing Tab again to move focus to the next element
        simulateTab();
        expect(document.activeElement).toBe(button2);

        tick();

        // Simulate pressing Tab again to move focus to the newly added button
        simulateTab();

        expect(document.activeElement).toBe(newButton);

        tick();
    }));

    //  Test: Should restore focus to the origin element on destroy
    it('should restore focus to the origin element on destroy', () => {
        const originElement = document.createElement('button');
        document.body.appendChild(originElement);
        originElement.focus();
        fixture.detectChanges();

        // Destroy the directive
        fixture.destroy();
        expect(document.activeElement).toBe(originElement);
        document.body.removeChild(originElement);
    });

    describe('mutations function', () => {
        it('should update focusable elements list when childList changes', () => {
            // Spy on firstLastFocusableElement method
            const spy = spyOn(limitFocusDirective as any, 'firstLastFocusableElement').and.callThrough();

            // Create a MutationRecord for childList change
            const mutation = {
                type: 'childList',
                target: containerElement,
                addedNodes: [document.createElement('div')],
                removedNodes: [],
                previousSibling: null,
                nextSibling: null,
                attributeName: null,
                attributeNamespace: null,
                oldValue: null,
            } as unknown as MutationRecord;

            // Get initial list of focusable elements
            const initialList = (limitFocusDirective as any).firstLastFocusableElement(containerElement);

            // Call mutations with the mutation record
            limitFocusDirective['mutations']([mutation], initialList, containerElement);

            // Verify firstLastFocusableElement was called
            expect(spy).toHaveBeenCalledWith(containerElement);
            expect(spy).toHaveBeenCalledTimes(2);
        });

        it('should update focusable elements list when attributes change', () => {
            // Spy on firstLastFocusableElement method
            const spy = spyOn(limitFocusDirective as any, 'firstLastFocusableElement').and.callThrough();

            // Create a MutationRecord for attribute change
            const mutation = {
                type: 'attributes',
                target: input1,
                addedNodes: [],
                removedNodes: [],
                previousSibling: null,
                nextSibling: null,
                attributeName: 'disabled',
                attributeNamespace: null,
                oldValue: null,
            } as unknown as MutationRecord;

            // Get initial list of focusable elements
            const initialList = (limitFocusDirective as any).firstLastFocusableElement(containerElement);

            // Call mutations with the mutation record
            limitFocusDirective['mutations']([mutation], initialList, containerElement);

            // Verify firstLastFocusableElement was called
            expect(spy).toHaveBeenCalledWith(containerElement);
            expect(spy).toHaveBeenCalledTimes(2);
        });

        it('should not update focusable elements list for other mutation types', () => {
            // Spy on firstLastFocusableElement method
            const spy = spyOn(limitFocusDirective as any, 'firstLastFocusableElement');

            // Create a MutationRecord for a different type
            const mutation = {
                type: 'characterData',
                target: containerElement,
                addedNodes: [],
                removedNodes: [],
                previousSibling: null,
                nextSibling: null,
                attributeName: null,
                attributeNamespace: null,
                oldValue: null,
            } as unknown as MutationRecord;

            // Get initial list of focusable elements
            const initialList = (limitFocusDirective as any).firstLastFocusableElement(containerElement);

            // Call mutations with the mutation record
            limitFocusDirective['mutations']([mutation], initialList, containerElement);

            // Verify firstLastFocusableElement was not called
            expect(spy).toHaveBeenCalledTimes(1);
        });
    });

    describe('keydown function', () => {
        let focusableElements: HTMLElement[];
        let mockEvent: any;

        let focusSpy: jasmine.Spy;

        beforeEach(() => {
            // Get the list of focusable elements
            focusableElements = (limitFocusDirective as any).firstLastFocusableElement(containerElement);

            // Create mock event
            mockEvent = { key: 'Tab', shiftKey: false, preventDefault: () => {} } as KeyboardEvent;
            spyOn(mockEvent, 'preventDefault');

            // Spy on focus method for all focusable elements
            focusableElements.forEach(el => {
                focusSpy = spyOn(el, 'focus').and.callThrough();
            });
        });

        it('should prevent default and focus last element when Shift+Tab from first element', () => {
            mockEvent.shiftKey = true;
            // Mock active element as first element
            spyOnProperty(document, 'activeElement', 'get').and.returnValue(input1);

            // Call keydown directly
            limitFocusDirective['keydown'](mockEvent, focusableElements);

            // Verify preventDefault was called
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            // Verify focus was set to last element
            expect(button2.focus).toHaveBeenCalled();
        });

        it('should prevent default and focus first element when Tab from last element', () => {
            // Mock active element as last element
            spyOnProperty(document, 'activeElement', 'get').and.returnValue(button2);

            // Call keydown directly
            limitFocusDirective['keydown'](mockEvent, focusableElements);

            // Verify preventDefault was called
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            // Verify focus was set to first element
            expect(input1.focus).toHaveBeenCalled();
        });

        it('should focus first element when Tab from non-focusable element', () => {
            mockEvent.shiftKey = true;

            // Mock active element as non-focusable element
            const nonFocusableElement = document.createElement('div');
            spyOnProperty(document, 'activeElement', 'get').and.returnValue(nonFocusableElement);

            // Call keydown directly
            limitFocusDirective['keydown'](mockEvent, focusableElements);

            // Verify focus was set to first element
            expect(button2.focus).toHaveBeenCalled();
        });

        it('should focus last element when Shift+Tab from non-focusable element', () => {
            // Mock active element as non-focusable element
            const nonFocusableElement = document.createElement('div');
            spyOnProperty(document, 'activeElement', 'get').and.returnValue(nonFocusableElement);

            // Call keydown directly
            limitFocusDirective['keydown'](mockEvent, focusableElements);

            // Verify focus was set to last element
            expect(input1.focus).toHaveBeenCalled();
        });

        it('should not prevent default for non-Tab keys', () => {
            mockEvent.key = 'Enter';

            // Call keydown directly
            limitFocusDirective['keydown'](mockEvent, focusableElements);

            // Verify preventDefault was not called
            expect(mockEvent.preventDefault).not.toHaveBeenCalled();
        });

        it('should not prevent default when Tab is pressed but active element is in the list', () => {
            // Mock active element as element in the middle of the list
            spyOnProperty(document, 'activeElement', 'get').and.returnValue(button1);

            // Call keydown directly
            limitFocusDirective['keydown'](mockEvent, focusableElements);

            // Verify preventDefault was not called
            expect(mockEvent.preventDefault).not.toHaveBeenCalled();
        });

        it('should filter out hidden and disabled elements from focusable list', () => {
            // Hide one element and disable another
            input1.style.display = 'none';
            button1.disabled = true;
            fixture.detectChanges();

            // Get filtered list
            const filteredElements = focusableElements.filter(
                e =>
                    getComputedStyle(e).display !== 'none' &&
                    getComputedStyle(e).visibility !== 'hidden' &&
                    e.tabIndex !== -1,
            );

            // Verify only visible, enabled elements remain
            expect(filteredElements.length).toBe(3); // input2 and button2
            expect(filteredElements).toContain(button1);
            expect(filteredElements).toContain(input2);
            expect(filteredElements).toContain(button2);
        });
    });
});
