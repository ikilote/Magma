/**
 * Walks up the DOM tree from `element` to find the nearest ancestor
 * (or the element itself) that has all the CSS classes listed in `cssClass`.
 *
 * @param element   Starting DOM element.
 * @param cssClass  Space-separated list of CSS classes that the target must have.
 * @returns The matching element, or `undefined` if none is found.
 */
export function getParentElementByClass(element: HTMLElement, cssClass: string): HTMLElement | undefined {
    return containClasses(element, cssClass.trim().split(/\s+/))
        ? element
        : element.parentElement
          ? getParentElementByClass(element.parentElement, cssClass)
          : undefined;
}

/**
 * Returns `true` if the element's `classList` contains **all** of the given CSS classes.
 *
 * @param element    Target DOM element.
 * @param cssClasses Array of CSS class names that must all be present.
 * @returns `true` when every class is found, `false` otherwise (including when `classList` is absent).
 */
export function containClasses(element: HTMLElement | SVGSVGElement, cssClasses: string[]): boolean {
    if (!element.classList) {
        return false;
    }
    for (const cssClass of cssClasses) {
        if (!element.classList.contains(cssClass)) {
            return false;
        }
    }
    return true;
}

/**
 * Shadow-DOM-aware equivalent of `Element.closest()`.
 *
 * `Element.closest()` stops at the shadow boundary and cannot find an ancestor
 * that lives in a parent shadow tree or in the light DOM above a shadow host.
 * This function walks up through the regular DOM using `parentElement`, and
 * when it reaches the top of a shadow tree it crosses the boundary via
 * `getRootNode().host` to continue the search in the outer document.
 *
 * @param element   Starting element.
 * @param selector  CSS selector to match against each ancestor.
 * @returns The nearest matching ancestor (including the element itself), or
 *          `null` if none is found up to the document root.
 */
export function deepClosest(element: Element | null, selector: string): Element | null {
    let current: Element | null = element;
    while (current) {
        if (current.matches(selector)) {
            return current;
        }
        if (current.parentElement) {
            current = current.parentElement;
        } else {
            // Top of a shadow root — jump to the host element in the outer tree
            const root = current.getRootNode();
            current = root instanceof ShadowRoot ? root.host : null;
        }
    }
    return null;
}

/**
 * Shadow-DOM-aware equivalent of `document.querySelector()`.
 *
 * `document.querySelector()` cannot find elements that live inside a shadow
 * root.  This function performs a depth-first search starting from `root`,
 * recursing into every open `shadowRoot` it encounters so that elements nested
 * arbitrarily deep in shadow trees are reachable.
 *
 * @param selector  CSS selector to match.
 * @param root      Search root. Defaults to `document`.
 * @returns The first matching element in depth-first order, or `null`.
 */
export function deepQuerySelector<T extends Element = Element>(
    selector: string,
    root: Document | Element | ShadowRoot = document,
): T | null {
    const found = root.querySelector<T>(selector);
    if (found) {
        return found;
    }
    for (const el of Array.from(root.querySelectorAll('*'))) {
        if (el.shadowRoot) {
            const inner = deepQuerySelector<T>(selector, el.shadowRoot);
            if (inner) {
                return inner;
            }
        }
    }
    return null;
}

/**
 * Returns the deepest focused element, traversing nested shadow roots.
 *
 * `document.activeElement` stops at the shadow host when focus is inside a
 * shadow tree. This function recursively follows `shadowRoot.activeElement`
 * until it reaches the actual focused element.
 *
 * @param root  Starting document or shadow root. Defaults to `document`.
 * @returns The deepest active element, or `null` if nothing is focused.
 */
export function deepActiveElement(root: Document | ShadowRoot = document): Element | null {
    const active = root.activeElement;
    return active?.shadowRoot ? (deepActiveElement(active.shadowRoot) ?? active) : active;
}

/**
 * Shadow-DOM-aware equivalent of `Element.contains()`.
 *
 * `Element.contains()` does not cross shadow boundaries, so an element inside
 * a shadow tree will not be detected as a descendant of the shadow host.
 * This function first tries the native check, then recursively searches the
 * shadow roots of all descendants.
 *
 * @param container  The ancestor element to search within.
 * @param target     The element to look for.
 * @returns `true` if `target` is `container` or a (shadow) descendant of it.
 */
export function deepContains(container: Element, target: Element): boolean {
    if (container.contains(target)) {
        return true;
    }
    for (const el of Array.from(container.querySelectorAll('*'))) {
        if (el.shadowRoot && deepContains(el.shadowRoot as unknown as Element, target)) {
            return true;
        }
    }
    return false;
}

/**
 * Collects all focusable elements matching `selector` within `root`,
 * recursively descending into shadow roots and distributed slot content.
 *
 * A plain `querySelectorAll` cannot pierce shadow boundaries. This function
 * walks the regular DOM, and whenever it encounters an element with an open
 * shadow root it recurses into it. Slot-assigned nodes are also traversed so
 * that light-DOM children projected into a shadow tree are not missed.
 *
 * @param root      The element or shadow root to start from.
 * @param selector  CSS selector identifying focusable elements.
 * @param result    Accumulator array (pass an empty array on the first call).
 */
export function collectFocusable(
    root: Element | ShadowRoot,
    selector: string,
    result: HTMLElement[] = [],
): HTMLElement[] {
    for (const el of Array.from(root.querySelectorAll<HTMLElement>(selector))) {
        result.push(el);
        if (el.shadowRoot) {
            collectFocusable(el.shadowRoot, selector, result);
        }
    }
    if (root instanceof ShadowRoot) {
        for (const slot of Array.from(root.querySelectorAll('slot'))) {
            for (const assigned of (slot as HTMLSlotElement).assignedElements({ flatten: true })) {
                if (!result.includes(assigned as HTMLElement)) {
                    collectFocusable(assigned, selector, result);
                }
            }
        }
    }
    return result;
}

/**
 * CSS selector that matches all natively focusable elements.
 * Shared between `isFocusable` and `redispatchAtPoint`, and re-exported for
 * use in directives (e.g. `limit-focus`) so the definition lives in one place.
 */
export const focusableSelector =
    'a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled), ' +
    'select:not(:disabled), [tabindex]:not([tabindex="-1"]), ' +
    '[contenteditable]:not([contenteditable="false"]), details > summary, ' +
    'audio[controls], video[controls]';

/**
 * Returns `true` if the element is focusable (matches {@link focusableSelector}).
 *
 * This covers all standard interactive elements: links, buttons, form controls,
 * elements with a non-negative `tabindex`, editable regions, `<summary>`, and
 * media elements with browser-native controls.  Disabled controls are excluded.
 */
export function isFocusable(el: Element): boolean {
    return el.matches(focusableSelector);
}

/**
 * Dispatch a mouse event to the element visually located at (x, y) after
 * the overlay stack has been fully cleared from the DOM.
 *
 * Typical use-case: "click-through" behaviour — close an overlay on backdrop
 * click and forward the same click to whatever is underneath, so the user
 * does not have to click twice.
 *
 * For a `'click'` event type, the full sequence `mousedown → mouseup → click`
 * is dispatched so that focus-triggering elements (inputs, buttons, etc.)
 * behave as if the user truly clicked on them.
 *
 * The CDK overlay container is temporarily hidden from hit-testing via
 * `pointer-events: none` before calling `elementFromPoint`, ensuring the
 * target element beneath any remaining overlay artifacts is found correctly.
 *
 * @param x         Client X coordinate of the original event.
 * @param y         Client Y coordinate of the original event.
 * @param eventType DOM event type to redispatch (e.g. `'click'`, `'contextmenu'`).
 * @param button    Mouse button index (0 = left, 1 = middle, 2 = right).
 */
export function redispatchAtPoint(x: number, y: number, eventType: string, button = 0): void {
    if (!isFinite(x) || !isFinite(y)) {
        return;
    }
    setTimeout(() => {
        // Temporarily remove the overlay container from hit-testing so that
        // any residual backdrop / pane does not intercept elementFromPoint.
        const overlayContainer = document.querySelector<HTMLElement>('.cdk-overlay-container');
        const previousPointerEvents = overlayContainer?.style.pointerEvents ?? '';
        if (overlayContainer) {
            overlayContainer.style.pointerEvents = 'none';
        }

        const target = document.elementFromPoint(x, y);

        if (overlayContainer) {
            overlayContainer.style.pointerEvents = previousPointerEvents;
        }

        if (!target) {
            return;
        }

        const init: MouseEventInit = {
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y,
            button,
        };

        if (eventType === 'click') {
            target.dispatchEvent(new MouseEvent('mousedown', init));
            target.dispatchEvent(new MouseEvent('mouseup', init));
        }
        target.dispatchEvent(new MouseEvent(eventType, init));

        // If the target is a focusable element (or contains one), focus it
        // explicitly — synthetic mouse events do not trigger native focus on inputs.
        const focusable = isFocusable(target)
            ? (target as HTMLElement)
            : (target.querySelector<HTMLElement>(focusableSelector) ?? null);
        focusable?.focus();
    });
}
