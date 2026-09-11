import { containClasses, getParentElementByClass } from './dom';

describe('DOM Utility Functions', () => {
    let testElement: HTMLElement;
    let parentElement: HTMLElement;
    let grandParentElement: HTMLElement;

    // Helper function to create a DOM structure for testing
    function createTestDOM() {
        // Create a nested DOM structure
        grandParentElement = document.createElement('div');
        grandParentElement.className = 'grandparent foo';

        parentElement = document.createElement('div');
        parentElement.className = 'parent bar';

        testElement = document.createElement('div');
        testElement.className = 'child baz';

        grandParentElement.appendChild(parentElement);
        parentElement.appendChild(testElement);

        document.body.appendChild(grandParentElement);
    }

    // Helper function to clean up the DOM after tests
    function cleanupTestDOM() {
        document.body.removeChild(grandParentElement);
    }

    beforeEach(() => {
        createTestDOM();
    });

    afterEach(() => {
        cleanupTestDOM();
    });

    // 1. Tests for `containClasses`
    describe('containClasses', () => {
        it('should return true if the element contains all specified classes', () => {
            // Test: Element contains all classes
            const result = containClasses(parentElement, ['parent', 'bar']);
            expect(result).toBe(true);
        });

        it('should return false if the element is missing any class', () => {
            // Test: Element is missing at least one class
            const result = containClasses(parentElement, ['parent', 'missing']);
            expect(result).toBe(false);
        });

        it('should return false if the element has no classList', () => {
            // Test: Element has no classList property
            const fakeElement = { classList: undefined } as unknown as HTMLElement;
            const result = containClasses(fakeElement, ['any']);
            expect(result).toBe(false);
        });

        it('should handle empty class list', () => {
            // Test: Empty class list should return true (vacuously true)
            const result = containClasses(parentElement, []);
            expect(result).toBe(true);
        });

        it('should handle multiple spaces in class names', () => {
            // Test: Multiple spaces in class names are trimmed
            const element = document.createElement('div');
            element.className = 'foo   bar  baz';
            const result = containClasses(element, ['foo', 'bar', 'baz']);
            expect(result).toBe(true);
        });
    });

    // 2. Tests for `getParentElementByClass`
    describe('getParentElementByClass', () => {
        it('should return the element itself if it contains all specified classes', () => {
            // Test: Element itself matches the classes
            const result = getParentElementByClass(parentElement, 'parent bar');
            expect(result).toBe(parentElement);
        });

        it('should return the parent element if it contains all specified classes', () => {
            // Test: Parent element matches the classes
            const result = getParentElementByClass(testElement, 'parent bar');
            expect(result).toBe(parentElement);
        });

        it('should return the grandparent element if it contains all specified classes', () => {
            // Test: Grandparent element matches the classes
            const result = getParentElementByClass(testElement, 'grandparent foo');
            expect(result).toBe(grandParentElement);
        });

        it('should return undefined if no parent contains all specified classes', () => {
            // Test: No parent matches the classes
            const result = getParentElementByClass(testElement, 'nonexistent');
            expect(result).toBeUndefined();
        });

        it('should handle multiple class names separated by spaces', () => {
            // Test: Multiple class names in a single string
            const result = getParentElementByClass(testElement, 'parent  bar');
            expect(result).toBe(parentElement);
        });

        it('should return undefined if the element has no parent', () => {
            // Test: Element has no parent
            const orphanElement = document.createElement('div');
            const result = getParentElementByClass(orphanElement, 'any');
            expect(result).toBeUndefined();
        });

        it('should handle extra whitespace in the class parameter', () => {
            // Test: Extra whitespace in the class parameter is trimmed
            const result = getParentElementByClass(testElement, '   parent    bar   ');
            expect(result).toBe(parentElement);
        });
    });

    // 3. Edge cases
    describe('Edge Cases', () => {
        it('should handle SVG elements without classList', () => {
            // Test: SVG elements may not have a classList property
            const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            const result = containClasses(svgElement, ['any']);
            expect(result).toBe(false);
        });

        it('should handle elements with empty className', () => {
            // Test: Element with empty className
            const emptyElement = document.createElement('div');
            emptyElement.className = '';
            const result = containClasses(emptyElement, ['any']);
            expect(result).toBe(false);
        });
    });
});

describe('redispatchAtPoint', () => {
    let redispatchAtPoint: (x: number, y: number, eventType: string, button?: number) => void;

    beforeEach(async () => {
        ({ redispatchAtPoint } = await import('./dom'));
        vi.useFakeTimers();
        vi.clearAllMocks();
    });

    afterEach(() => {
        // Drain any pending timers so they don't bleed into the next test's spy
        vi.runAllTimers();
        vi.useRealTimers();
    });

    it('should dispatch a click MouseEvent with correct coordinates after a tick', () => {
        const target = document.createElement('button');
        document.body.appendChild(target);
        vi.spyOn(document, 'elementFromPoint').mockReturnValue(target);
        const clickListener = vi.fn();
        target.addEventListener('click', clickListener);

        redispatchAtPoint(10, 20, 'click');
        expect(clickListener).not.toHaveBeenCalled(); // not yet — deferred

        vi.advanceTimersByTime(0);
        expect(clickListener).toHaveBeenCalledTimes(1);

        const evt = clickListener.mock.calls[0][0] as MouseEvent;
        expect(evt.clientX).toBe(10);
        expect(evt.clientY).toBe(20);
        expect(evt.button).toBe(0);

        target.remove();
    });

    it('should dispatch mousedown and mouseup before click', () => {
        const target = document.createElement('input');
        document.body.appendChild(target);
        vi.spyOn(document, 'elementFromPoint').mockReturnValue(target);

        const order: string[] = [];
        target.addEventListener('mousedown', () => order.push('mousedown'));
        target.addEventListener('mouseup', () => order.push('mouseup'));
        target.addEventListener('click', () => order.push('click'));

        redispatchAtPoint(10, 20, 'click');
        vi.advanceTimersByTime(0);

        expect(order).toEqual(['mousedown', 'mouseup', 'click']);

        target.remove();
    });

    it('should NOT dispatch mousedown/mouseup for non-click event types', () => {
        const target = document.createElement('div');
        document.body.appendChild(target);
        vi.spyOn(document, 'elementFromPoint').mockReturnValue(target);

        const mousedownListener = vi.fn();
        target.addEventListener('mousedown', mousedownListener);

        redispatchAtPoint(5, 5, 'contextmenu', 2);
        vi.advanceTimersByTime(0);

        expect(mousedownListener).not.toHaveBeenCalled();

        target.remove();
    });

    it('should pass the button parameter to all dispatched events', () => {
        const target = document.createElement('button');
        document.body.appendChild(target);
        vi.spyOn(document, 'elementFromPoint').mockReturnValue(target);
        const contextListener = vi.fn();
        target.addEventListener('contextmenu', contextListener);

        redispatchAtPoint(5, 5, 'contextmenu', 2);
        vi.advanceTimersByTime(0);

        expect(contextListener).toHaveBeenCalledTimes(1);
        expect((contextListener.mock.calls[0][0] as MouseEvent).button).toBe(2);

        target.remove();
    });

    it('should not dispatch when elementFromPoint returns null', () => {
        vi.spyOn(document, 'elementFromPoint').mockReturnValue(null);

        expect(() => {
            redispatchAtPoint(0, 0, 'click');
            vi.advanceTimersByTime(0);
        }).not.toThrow();
    });

    it('should not dispatch when x is non-finite', () => {
        const spy = vi.spyOn(document, 'elementFromPoint').mockReturnValue(null);

        redispatchAtPoint(Infinity, 0, 'click');
        vi.advanceTimersByTime(0);

        expect(spy).not.toHaveBeenCalled();
    });

    it('should not dispatch when y is non-finite', () => {
        const spy = vi.spyOn(document, 'elementFromPoint').mockReturnValue(null);

        redispatchAtPoint(0, NaN, 'click');
        vi.advanceTimersByTime(0);

        expect(spy).not.toHaveBeenCalled();
    });

    it('should dispatch a bubbling, cancelable event', () => {
        const target = document.createElement('div');
        document.body.appendChild(target);
        vi.spyOn(document, 'elementFromPoint').mockReturnValue(target);
        const listener = vi.fn();
        document.body.addEventListener('click', listener);

        redispatchAtPoint(0, 0, 'click');
        vi.advanceTimersByTime(0);

        expect(listener).toHaveBeenCalledTimes(1);
        expect((listener.mock.calls[0][0] as MouseEvent).bubbles).toBe(true);
        expect((listener.mock.calls[0][0] as MouseEvent).cancelable).toBe(true);

        document.body.removeEventListener('click', listener);
        target.remove();
    });
});
