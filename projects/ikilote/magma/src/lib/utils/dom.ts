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
 * a short delay so any overlay covering that point is fully removed first.
 *
 * Typical use-case: "click-through" behaviour — close an overlay on backdrop
 * click and forward the same click to whatever is underneath, so the user
 * does not have to click twice.
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
        const target = document.elementFromPoint(x, y);
        if (target) {
            target.dispatchEvent(
                new MouseEvent(eventType, {
                    bubbles: true,
                    cancelable: true,
                    clientX: x,
                    clientY: y,
                    button,
                }),
            );
        }
    });
}
