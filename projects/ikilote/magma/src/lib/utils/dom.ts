export function getParentElementByClass(element: HTMLElement, cssClass: string): HTMLElement | undefined {
    return containClasses(element, cssClass.trim().split(/\s+/))
        ? element
        : element.parentElement
          ? getParentElementByClass(element.parentElement, cssClass)
          : undefined;
}

export function containClasses(element: HTMLElement, cssClasses: string[]): boolean {
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
