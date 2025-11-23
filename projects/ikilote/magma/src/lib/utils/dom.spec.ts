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
            expect(result).toBeTrue();
        });

        it('should return false if the element is missing any class', () => {
            // Test: Element is missing at least one class
            const result = containClasses(parentElement, ['parent', 'missing']);
            expect(result).toBeFalse();
        });

        it('should return false if the element has no classList', () => {
            // Test: Element has no classList property
            const fakeElement = { classList: undefined } as unknown as HTMLElement;
            const result = containClasses(fakeElement, ['any']);
            expect(result).toBeFalse();
        });

        it('should handle empty class list', () => {
            // Test: Empty class list should return true (vacuously true)
            const result = containClasses(parentElement, []);
            expect(result).toBeTrue();
        });

        it('should handle multiple spaces in class names', () => {
            // Test: Multiple spaces in class names are trimmed
            const element = document.createElement('div');
            element.className = 'foo   bar  baz';
            const result = containClasses(element, ['foo', 'bar', 'baz']);
            expect(result).toBeTrue();
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
            expect(result).toBeFalse();
        });

        it('should handle elements with empty className', () => {
            // Test: Element with empty className
            const emptyElement = document.createElement('div');
            emptyElement.className = '';
            const result = containClasses(emptyElement, ['any']);
            expect(result).toBeFalse();
        });
    });
});
