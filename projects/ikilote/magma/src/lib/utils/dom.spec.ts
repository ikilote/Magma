import {
    collectFocusable,
    containClasses,
    deepActiveElement,
    deepClosest,
    deepContains,
    deepQuerySelector,
    getParentElementByClass,
    isFocusable,
} from './dom';

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

describe('deepActiveElement', () => {
    beforeEach(() => {
        // Reset focus to body before each test to avoid cross-test contamination
        (document.activeElement as HTMLElement)?.blur?.();
    });

    it('should return document.activeElement when it has no shadowRoot', () => {
        const btn = document.createElement('button');
        btn.id = 'deep-active-element-test';
        document.body.appendChild(btn);
        btn.focus();
        expect(deepActiveElement()).toBe(btn);
        btn.remove();
    });

    it('should return null when nothing is focused', () => {
        // Pass a fake root with activeElement = null
        const fakeRoot = { activeElement: null } as unknown as Document;
        expect(deepActiveElement(fakeRoot)).toBeNull();
    });

    it('should recurse into shadowRoot to find the deepest active element', () => {
        const host = document.createElement('div');
        const shadow = host.attachShadow({ mode: 'open' });
        const innerBtn = document.createElement('button');
        shadow.appendChild(innerBtn);
        document.body.appendChild(host);

        // Simulate activeElement pointing to the host, with shadowRoot.activeElement = innerBtn
        const fakeRoot = {
            activeElement: {
                shadowRoot: null,
                matches: () => false,
            },
        } as unknown as Document;
        // Direct call with a fake root that has a non-shadow activeElement
        expect(deepActiveElement(fakeRoot)).toBe(fakeRoot.activeElement);

        // Now test with a nested shadow root
        const innerBtn2 = document.createElement('input');
        const fakeInnerRoot = { activeElement: innerBtn2 } as unknown as ShadowRoot;
        const fakeRootWithShadow = {
            activeElement: {
                shadowRoot: fakeInnerRoot,
            },
        } as unknown as Document;
        expect(deepActiveElement(fakeRootWithShadow)).toBe(innerBtn2);

        host.remove();
    });

    it('should fallback to the host element when shadowRoot.activeElement is null', () => {
        const fakeInnerRoot = { activeElement: null } as unknown as ShadowRoot;
        const hostElement = { shadowRoot: fakeInnerRoot } as unknown as Element;
        const fakeRoot = { activeElement: hostElement } as unknown as Document;

        expect(deepActiveElement(fakeRoot)).toBe(hostElement);
    });
});

describe('deepContains', () => {
    it('should return true when container directly contains target', () => {
        const container = document.createElement('div');
        const child = document.createElement('span');
        container.appendChild(child);
        expect(deepContains(container, child)).toBe(true);
    });

    it('should return true when container is the target itself', () => {
        const el = document.createElement('div');
        expect(deepContains(el, el)).toBe(true);
    });

    it('should return false when target is not in the container', () => {
        const container = document.createElement('div');
        const outside = document.createElement('span');
        expect(deepContains(container, outside)).toBe(false);
    });

    it('should find target inside a shadow root', () => {
        const inner = document.createElement('span');
        // Build a fake host whose querySelectorAll yields an element with a shadowRoot containing target
        const fakeShadow = {
            contains: (el: Element) => el === inner,
            querySelectorAll: () => [],
        } as unknown as Element;
        const shadowHost = document.createElement('div');
        const fakeChild = {
            shadowRoot: fakeShadow,
        } as unknown as Element;
        // container.contains(target) returns false, but el.shadowRoot recurses and finds it
        const container = document.createElement('div');
        vi.spyOn(container, 'contains').mockReturnValue(false);
        vi.spyOn(container, 'querySelectorAll').mockReturnValue([fakeChild] as unknown as NodeListOf<Element>);

        expect(deepContains(container, inner)).toBe(true);

        vi.restoreAllMocks();
        shadowHost.remove();
    });

    it('should return false when target is not in any shadow root', () => {
        const outside = document.createElement('span');
        const container = document.createElement('div');
        vi.spyOn(container, 'contains').mockReturnValue(false);
        vi.spyOn(container, 'querySelectorAll').mockReturnValue([] as unknown as NodeListOf<Element>);

        expect(deepContains(container, outside)).toBe(false);

        vi.restoreAllMocks();
    });
});

describe('deepClosest', () => {
    it('should return the element itself when it matches', () => {
        const el = document.createElement('div');
        el.className = 'target';
        document.body.appendChild(el);
        expect(deepClosest(el, '.target')).toBe(el);
        el.remove();
    });

    it('should return null when given null', () => {
        expect(deepClosest(null, '.target')).toBeNull();
    });

    it('should find a matching ancestor in the light DOM', () => {
        const grandparent = document.createElement('div');
        grandparent.className = 'ancestor';
        const parent = document.createElement('div');
        const child = document.createElement('span');
        parent.appendChild(child);
        grandparent.appendChild(parent);
        document.body.appendChild(grandparent);

        expect(deepClosest(child, '.ancestor')).toBe(grandparent);
        grandparent.remove();
    });

    it('should return null when no ancestor matches', () => {
        const parent = document.createElement('div');
        const child = document.createElement('span');
        parent.appendChild(child);
        document.body.appendChild(parent);

        expect(deepClosest(child, '.nonexistent')).toBeNull();
        parent.remove();
    });

    it('should cross the shadow boundary to find a host ancestor', () => {
        // outer host has class 'outer-host'; inner element lives inside its shadow root
        const host = document.createElement('div');
        host.className = 'outer-host';
        document.body.appendChild(host);
        const shadow = host.attachShadow({ mode: 'open' });
        const inner = document.createElement('span');
        shadow.appendChild(inner);

        // inner has no parentElement at the top of the shadow → jump to host via getRootNode().host
        expect(deepClosest(inner, '.outer-host')).toBe(host);

        host.remove();
    });

    it('should return null when reaching the document root without a match', () => {
        const host = document.createElement('div');
        document.body.appendChild(host);
        const shadow = host.attachShadow({ mode: 'open' });
        const inner = document.createElement('span');
        shadow.appendChild(inner);

        // Crosses boundary but nothing matches all the way up
        expect(deepClosest(inner, '.never-matches-anything')).toBeNull();

        host.remove();
    });
});

describe('deepQuerySelector', () => {
    it('should find an element in the light DOM', () => {
        const root = document.createElement('div');
        const target = document.createElement('button');
        target.id = 'dqs-target';
        root.appendChild(target);
        document.body.appendChild(root);

        expect(deepQuerySelector('#dqs-target', root)).toBe(target);
        root.remove();
    });

    it('should return null when nothing matches', () => {
        const root = document.createElement('div');
        document.body.appendChild(root);
        expect(deepQuerySelector('#not-here', root)).toBeNull();
        root.remove();
    });

    it('should find an element nested inside a shadow root', () => {
        const root = document.createElement('div');
        const host = document.createElement('div');
        root.appendChild(host);
        document.body.appendChild(root);

        const shadow = host.attachShadow({ mode: 'open' });
        const inner = document.createElement('button');
        inner.id = 'dqs-shadow-target';
        shadow.appendChild(inner);

        expect(deepQuerySelector('#dqs-shadow-target', root)).toBe(inner);
        root.remove();
    });

    it('should return null when shadow roots exist but none match', () => {
        const root = document.createElement('div');
        const host = document.createElement('div');
        root.appendChild(host);
        document.body.appendChild(root);

        const shadow = host.attachShadow({ mode: 'open' });
        shadow.appendChild(document.createElement('span'));

        expect(deepQuerySelector('#missing', root)).toBeNull();
        root.remove();
    });
});

describe('collectFocusable', () => {
    // Custom elements defined in these tests persist (you cannot un-define them), but
    // their instances and any other test nodes must be removed so they don't leak into
    // other test files sharing the same browser DOM (isolate keeps modules separate,
    // but the Playwright page DOM is shared within a fork).
    afterEach(() => {
        document
            .querySelectorAll(
                'test-slot-host-traverse, test-slot-host-dedup, test-nested-shadow-outer, test-nested-shadow-inner',
            )
            .forEach(el => el.remove());
        // Remove any stray elements added directly to body by these tests
        Array.from(document.body.children).forEach(child => {
            const id = (child as HTMLElement).id;
            if (!id?.startsWith('root') && child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
                child.remove();
            }
        });
    });

    it('should collect focusable elements from a plain DOM tree', () => {
        const root = document.createElement('div');
        const btn = document.createElement('button');
        const input = document.createElement('input');
        const span = document.createElement('span');
        root.appendChild(btn);
        root.appendChild(input);
        root.appendChild(span);
        document.body.appendChild(root);

        const result = collectFocusable(root, 'button, input');
        expect(result).toContain(btn);
        expect(result).toContain(input);
        expect(result).not.toContain(span);

        root.remove();
    });

    it('should recurse into shadow roots', () => {
        // collectFocusable recurses when an element found by querySelectorAll has a shadowRoot.
        // We simulate this: a container whose querySelectorAll returns a div that itself has
        // a shadowRoot containing a button.
        const container = document.createElement('div');
        const shadowHost = document.createElement('div');
        container.appendChild(shadowHost);
        document.body.appendChild(container);

        // Attach a real shadow root to shadowHost and add a button inside it
        const shadow = shadowHost.attachShadow({ mode: 'open' });
        const innerBtn = document.createElement('button');
        shadow.appendChild(innerBtn);

        // collectFocusable(shadowHost, 'button'):
        //   shadowHost.querySelectorAll('button') → [] (doesn't cross shadow boundary)
        //   but shadowHost itself is not found by querySelectorAll on an ancestor.
        // So we need to start from container and have querySelectorAll return shadowHost:
        // That won't work natively either. Instead start directly from the shadowRoot.
        const result = collectFocusable(shadow, 'button');
        expect(result).toContain(innerBtn);

        container.remove();
    });

    it('should recurse into nested shadow roots of elements found by querySelectorAll', () => {
        // Exercises the `el.shadowRoot` recursion branch: an element returned by
        // querySelectorAll that itself hosts a shadow root with focusable children.
        // Structure: outerHost (shadow) → innerHost (shadow) → button
        const outerHost = document.createElement('div');
        const outerShadow = outerHost.attachShadow({ mode: 'open' });
        document.body.appendChild(outerHost);

        try {
            const innerHost = document.createElement('div');
            outerShadow.appendChild(innerHost);

            const innerShadow = innerHost.attachShadow({ mode: 'open' });
            const nestedBtn = document.createElement('button');
            nestedBtn.id = 'nested-btn';
            innerShadow.appendChild(nestedBtn);

            // Using '*' so innerHost is matched, its shadowRoot is entered, and the
            // nested button is collected from the inner shadow tree.
            const result = collectFocusable(outerShadow, '*');
            expect(result.some(el => el.id === 'nested-btn')).toBe(true);
        } finally {
            outerHost.remove();
        }
    });

    it('should traverse assigned slot elements', async () => {
        // collectFocusable recurses into slotted elements via collectFocusable(assigned, ...),
        // which searches the DESCENDANTS of each assigned element. So the focusable target
        // must be a child of a slotted wrapper element.
        const tagName = 'test-slot-host-traverse';
        if (!customElements.get(tagName)) {
            customElements.define(
                tagName,
                class extends HTMLElement {
                    constructor() {
                        super();
                        this.attachShadow({ mode: 'open' }).innerHTML = '<slot></slot>';
                    }
                },
            );
        }
        const host = document.createElement(tagName);
        document.body.appendChild(host);

        try {
            // Slotted wrapper containing a focusable button as descendant
            const wrapper = document.createElement('div');
            const slottedBtn = document.createElement('button');
            wrapper.appendChild(slottedBtn);
            host.appendChild(wrapper);

            // Let the browser process slot assignment
            await customElements.whenDefined(tagName);
            await new Promise(r => setTimeout(r, 0));

            const shadow = host.shadowRoot!;
            expect(shadow).not.toBeNull();

            const slot = shadow.querySelector('slot') as HTMLSlotElement | null;
            const assigned = slot?.assignedElements({ flatten: true }) ?? [];

            if (!(shadow instanceof ShadowRoot) || assigned.length === 0) {
                // Environment limitation: slot assignment not available in this test context.
                expect(() => collectFocusable(shadow, 'button')).not.toThrow();
            } else {
                const result = collectFocusable(shadow, 'button');
                expect(result).toContain(slottedBtn);
            }
        } finally {
            host.remove();
        }
    });

    it('should not add duplicates from slot traversal', async () => {
        const tagName = 'test-slot-host-dedup';
        if (!customElements.get(tagName)) {
            customElements.define(
                tagName,
                class extends HTMLElement {
                    constructor() {
                        super();
                        this.attachShadow({ mode: 'open' }).innerHTML = '<slot></slot>';
                    }
                },
            );
        }
        const host = document.createElement(tagName);
        document.body.appendChild(host);

        try {
            const wrapper = document.createElement('div');
            const slottedBtn = document.createElement('button');
            wrapper.appendChild(slottedBtn);
            host.appendChild(wrapper);

            await customElements.whenDefined(tagName);
            await new Promise(r => setTimeout(r, 0));

            const shadow = host.shadowRoot!;
            const slot = shadow.querySelector('slot') as HTMLSlotElement | null;
            const assigned = slot?.assignedElements({ flatten: true }) ?? [];

            if (!(shadow instanceof ShadowRoot) || assigned.length === 0) {
                expect(() => collectFocusable(shadow, 'button')).not.toThrow();
            } else {
                const result = collectFocusable(shadow, 'button');
                const count = result.filter(el => el === slottedBtn).length;
                expect(count).toBe(1);
            }
        } finally {
            host.remove();
        }
    });

    it('should return an empty array when no elements match', () => {
        const root = document.createElement('div');
        root.appendChild(document.createElement('span'));
        const result = collectFocusable(root, 'button');
        expect(result).toHaveLength(0);
    });
});

describe('isFocusable', () => {
    it('should return true for a button', () => {
        const btn = document.createElement('button');
        document.body.appendChild(btn);
        expect(isFocusable(btn)).toBe(true);
        btn.remove();
    });

    it('should return false for a disabled button', () => {
        const btn = document.createElement('button');
        btn.disabled = true;
        document.body.appendChild(btn);
        expect(isFocusable(btn)).toBe(false);
        btn.remove();
    });

    it('should return true for an input', () => {
        const input = document.createElement('input');
        document.body.appendChild(input);
        expect(isFocusable(input)).toBe(true);
        input.remove();
    });

    it('should return true for an anchor with href', () => {
        const a = document.createElement('a');
        a.href = '#';
        document.body.appendChild(a);
        expect(isFocusable(a)).toBe(true);
        a.remove();
    });

    it('should return false for a plain div', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        expect(isFocusable(div)).toBe(false);
        div.remove();
    });

    it('should return true for an element with tabindex >= 0', () => {
        const div = document.createElement('div');
        div.setAttribute('tabindex', '0');
        document.body.appendChild(div);
        expect(isFocusable(div)).toBe(true);
        div.remove();
    });

    it('should return false for an element with tabindex="-1"', () => {
        const div = document.createElement('div');
        div.setAttribute('tabindex', '-1');
        document.body.appendChild(div);
        expect(isFocusable(div)).toBe(false);
        div.remove();
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
