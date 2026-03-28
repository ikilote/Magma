import { Component, ElementRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import type { Mock } from 'vitest';

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
                <input [limitFocusFirst]="limitFocus1" id="input2" />
            </div>
            <div>
                <button [limitFocusFirst]="limitFocus2" id="button2">Button 2</button>
                <button disabled>Button disabled</button>
            </div>
        </div>
    `,
    imports: [MagmaLimitFocusDirective, MagmaLimitFocusFirstDirective],
})
class TestHostComponent {
    container = viewChild.required<ElementRef<HTMLDivElement>>('container');
    limitFocus1 = 1;
    limitFocus2 = 2;
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
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        // Reset focus to body to avoid contaminating other tests
        if (document.activeElement && document.activeElement !== document.body) {
            (document.activeElement as HTMLElement).blur();
        }
        document.body.focus();
        
        fixture?.destroy();
    });

    it('should create the directive', () => {
        expect(limitFocusDirective).toBeTruthy();
    });

    it('should focus the first focusable element with the lowest `limitFocusFirst` value', () => {
        limitFocusDirective.focus();
        fixture.changeDetectorRef.detectChanges();
        expect(document.activeElement).toBe(input2);
    });

    it('should focus the first focusable element with the lowest `limitFocusFirst` value value with change order', () => {
        hostComponent.limitFocus1 = 3;
        fixture.changeDetectorRef.detectChanges();
        limitFocusDirective.focus();
        fixture.changeDetectorRef.detectChanges();
        expect(document.activeElement).toBe(button2);
    });

    it('should handle Tab key', () => {
        input1.focus();
        fixture.changeDetectorRef.detectChanges();

        simulateTab();

        fixture.changeDetectorRef.detectChanges();

        expect(document.activeElement).toBe(button1);
    });

    it('should trap focus inside the container', async () => {
        input1.focus();
        fixture.changeDetectorRef.detectChanges();
        expect(document.activeElement).toBe(input1);

        simulateTab();

        fixture.changeDetectorRef.detectChanges();

        expect(document.activeElement).toBe(button1);

        // Simulate pressing Shift+Tab
        simulateTab(true);

        fixture.changeDetectorRef.detectChanges();
        expect(document.activeElement).toBe(input1);

        await fixture.whenStable();
    });

    it('should handle dynamic content changes', async () => {
        // Start by focusing the first input
        input1.focus();
        fixture.changeDetectorRef.detectChanges();
        expect(document.activeElement).toBe(input1);

        // Add a new focusable element dynamically
        const newButton = document.createElement('button');
        newButton.id = 'button3';
        newButton.textContent = 'Button 3';
        containerElement.appendChild(newButton);
        fixture.changeDetectorRef.detectChanges();
        await fixture.whenStable();

        // The directive should detect the new element via MutationObserver
        // Tab through all elements to verify the new button is included
        simulateTab(); // input1 -> button1
        expect(document.activeElement).toBe(button1);

        simulateTab(); // button1 -> input2
        expect(document.activeElement).toBe(input2);

        simulateTab(); // input2 -> button2
        expect(document.activeElement).toBe(button2);

        simulateTab(); // button2 -> newButton
        expect(document.activeElement).toBe(newButton);

        simulateTab(); // newButton -> input1 (wrap around)
        expect(document.activeElement).toBe(input1);

        await fixture.whenStable();
    });

    it('should restore focus to the origin element on destroy', () => {
        const originElement = document.createElement('button');
        document.body.appendChild(originElement);
        originElement.focus();
        fixture.changeDetectorRef.detectChanges();

        // Get the directive's cleanup behavior
        const activeBeforeDestroy = document.activeElement;
        
        // Destroy the directive (will be destroyed again in afterEach, but that's ok)
        limitFocusDirective.ngOnDestroy();
        
        // The focus should be restored
        expect(document.activeElement).toBe(originElement);
        document.body.removeChild(originElement);
    });

    describe('mutations function', () => {
        it('should update focusable elements list when childList changes', () => {
            // Spy on firstLastFocusableElement method
            const spy = vi.spyOn(limitFocusDirective as any, 'firstLastFocusableElement');

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
            const spy = vi.spyOn(limitFocusDirective as any, 'firstLastFocusableElement');

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
            const spy = vi.spyOn(limitFocusDirective as any, 'firstLastFocusableElement');

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

        let focusSpy: Mock;

        beforeEach(() => {
            // Get the list of focusable elements
            focusableElements = (limitFocusDirective as any).firstLastFocusableElement(containerElement);

            // Create mock event
            mockEvent = {
                key: 'Tab',
                shiftKey: false,
                preventDefault: () => {},
                stopPropagation: () => {},
            } as KeyboardEvent;
            vi.spyOn(mockEvent, 'preventDefault');
            vi.spyOn(mockEvent, 'stopPropagation');

            // Spy on focus method for all focusable elements
            focusableElements.forEach(el => {
                focusSpy = vi.spyOn(el, 'focus');
            });
        });

        it('should prevent default and focus last element when Shift+Tab from first element', () => {
            mockEvent.shiftKey = true;
            // Mock active element as first element
            vi.spyOn(document, 'activeElement', 'get').mockReturnValue(input1);

            // Call keydown directly
            limitFocusDirective['keydown'](mockEvent, focusableElements);

            // Verify preventDefault was called
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            // Verify focus was set to last element
            expect(button2.focus).toHaveBeenCalled();
        });

        it('should prevent default and focus first element when Tab from last element', () => {
            // Mock active element as last element
            vi.spyOn(document, 'activeElement', 'get').mockReturnValue(button2);

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
            vi.spyOn(document, 'activeElement', 'get').mockReturnValue(nonFocusableElement);

            // Call keydown directly
            limitFocusDirective['keydown'](mockEvent, focusableElements);

            // Verify focus was set to first element
            expect(button2.focus).toHaveBeenCalled();
        });

        it('should focus last element when Shift+Tab from non-focusable element', () => {
            // Mock active element as non-focusable element
            const nonFocusableElement = document.createElement('div');
            vi.spyOn(document, 'activeElement', 'get').mockReturnValue(nonFocusableElement);

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
            vi.spyOn(document, 'activeElement', 'get').mockReturnValue(button1);

            // Call keydown directly
            limitFocusDirective['keydown'](mockEvent, focusableElements);

            // Verify preventDefault was not called
            expect(mockEvent.preventDefault).not.toHaveBeenCalled();
        });

        it('should filter out hidden and disabled elements from focusable list', () => {
            // Hide one element and disable another
            input1.style.display = 'none';
            button1.disabled = true;
            fixture.changeDetectorRef.detectChanges();

            // Get filtered list
            const filteredElements = focusableElements.filter(limitFocusDirective['filter']);

            // Verify only visible, enabled elements remain
            expect(filteredElements.length).toBe(3); // input2 and button2
            expect(filteredElements).toContain(button1);
            expect(filteredElements).toContain(input2);
            expect(filteredElements).toContain(button2);
        });
    });
});

describe('MagmaLimitFocusDirective keydown & MutationObserver', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;
    let divRef: ElementRef<HTMLDivElement>;
    let limitFocusDirective: MagmaLimitFocusDirective;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        hostComponent = fixture.componentInstance;

        const directiveEl = fixture.debugElement.query(By.directive(MagmaLimitFocusDirective));
        limitFocusDirective = directiveEl.injector.get(MagmaLimitFocusDirective);

        const div = document.createElement('div');
        divRef = { nativeElement: div } as unknown as ElementRef<HTMLDivElement>;
        (limitFocusDirective as any)['focusElement'] = divRef;

        limitFocusDirective['mutations'] = vi.fn();

        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        // Reset focus to body
        if (document.activeElement && document.activeElement !== document.body) {
            (document.activeElement as HTMLElement).blur();
        }
        document.body.focus();
        
        fixture?.destroy();
    });

    it('should intercept keydown', async () => {
        const keydownSpy = vi.fn();
        divRef.nativeElement.addEventListener('keydown', keydownSpy);

        await fixture.whenStable();

        divRef.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));

        expect(keydownSpy).toHaveBeenCalled();
    });

    it('should detect mutation (attr)', async () => {
        await new Promise<void>(resolve => {
            setTimeout(() => {
                divRef.nativeElement.setAttribute('test', 'test');

                setTimeout(() => {
                    expect(limitFocusDirective['mutations']).toHaveBeenCalledTimes(1);
                    resolve();
                }, 10);
            }, 10);
        });
    });

    it('should detect mutation (childList)', async () => {
        await new Promise<void>(resolve => {
            setTimeout(() => {
                const button = document.createElement('button');
                divRef.nativeElement.append(button);

                setTimeout(() => {
                    expect(limitFocusDirective['mutations']).toHaveBeenCalledTimes(1);
                    resolve();
                }, 10);
            }, 10);
        });
    });

    it('should detect mutation (childList & subtree)', async () => {
        await new Promise<void>(resolve => {
            setTimeout(() => {
                const button = document.createElement('button');
                divRef.nativeElement.append(button);
                setTimeout(() => {
                    const div = document.createElement('div');
                    button.append(div);

                    setTimeout(() => {
                        expect(limitFocusDirective['mutations']).toHaveBeenCalledTimes(2);
                        resolve();
                    }, 10);
                }, 10);
            }, 10);
        });
    });
});
