export function getParentElementByClass(element: HTMLElement, cssClass: string): HTMLElement | undefined {
    return containClasses(element, cssClass.trim().split(/\s+/))
        ? element
        : element.parentElement
          ? getParentElementByClass(element.parentElement, cssClass)
          : undefined;
}

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
/** Returns true if the element is natively focusable as a form control. */
function isFocusable(el: Element): boolean {
    const tag = el.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select';
}

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

        // If the target is a focusable form element (or contains one), focus it
        // explicitly — synthetic mouse events do not trigger native focus on inputs.
        const focusable = isFocusable(target)
            ? (target as HTMLElement)
            : (target.querySelector<HTMLElement>('input, textarea, select, [tabindex]') ?? null);
        focusable?.focus();
    });
}
