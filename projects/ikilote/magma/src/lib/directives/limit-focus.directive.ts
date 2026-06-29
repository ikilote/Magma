import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';

import { numberAttributeOrUndefined } from '../utils/coercion';
import { Subscriptions } from '../utils/subscriptions';

export const focusRules =
    'a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])';

@Directive({
    selector: '[limitFocusFirst]',
})
export class MagmaLimitFocusFirstDirective implements OnInit, OnDestroy {
    private readonly host = inject(MagmaLimitFocusDirective);
    readonly focusElement = inject<ElementRef<HTMLDivElement>>(ElementRef);

    readonly limitFocusFirst = input.required({ transform: numberAttributeOrUndefined });

    ngOnInit(): void {
        this.host.add(this);
    }

    ngOnDestroy(): void {
        this.host.remove(this);
    }
}

@Directive({
    selector: '[limitFocus]',
    host: {
        tabindex: '-1',
    },
    exportAs: 'limitFocus',
})
export class MagmaLimitFocusDirective implements OnDestroy {
    readonly focusElement = inject<ElementRef<HTMLDivElement>>(ElementRef);

    private items: MagmaLimitFocusFirstDirective[] = [];

    private sub = Subscriptions.instance();
    private focusOrigin: HTMLElement | null = null;
    private observer: MutationObserver | undefined;

    focusRules = focusRules;

    constructor() {
        setTimeout(() => {
            this.focusOrigin = document.activeElement as HTMLElement | null;
            this.limitFocus(this.focusElement);
        });
    }

    focus() {
        this.items
            ?.filter(item => item.limitFocusFirst() !== undefined)
            ?.reduce(
                (minItem, item) => (item.limitFocusFirst()! < minItem.limitFocusFirst()! ? item : minItem),
                this.items[0],
            )
            ?.focusElement.nativeElement.focus();
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
        this.focusOrigin?.focus();
        this.sub.clear();
    }

    add(item: MagmaLimitFocusFirstDirective) {
        this.items.push(item);
    }

    remove(item: MagmaLimitFocusFirstDirective) {
        this.items.splice(this.items.indexOf(item), 1);
    }

    limitFocus(element: ElementRef<HTMLDivElement>) {
        const div = element?.nativeElement;
        if (div) {
            div.focus();

            // Wrap in an object so both closures share the same reference
            const state = { listElement: this.firstLastFocusableElement(div) };

            div.addEventListener('keydown', event => {
                this.keydown(event, state.listElement);
            });

            this.observer = new MutationObserver(mutationsList => {
                this.mutations(mutationsList, state, div);
            });
            this.observer.observe(div, { attributes: true, childList: true, subtree: true });
        }
    }

    private keydown(event: KeyboardEvent, listElement: HTMLElement[]) {
        if (event.key === 'Tab') {
            const list = listElement.filter(e => this.filter(e));
            const firstFocusableElement = list[0];
            const lastFocusableElement = list[list.length - 1];
            const active = document.activeElement as HTMLElement | null;

            // If the focused element is inside the container but not in the
            // tab-cycle list (e.g. a tabpanel with tabindex="-1" that received
            // programmatic focus), let the browser handle Tab naturally so it
            // moves to the next element inside the container. Only trap when
            // focus has escaped outside the container entirely.
            const container = this.focusElement.nativeElement;
            const isInsideContainer = active ? container.contains(active) : false;

            if (event.shiftKey) {
                if (active === firstFocusableElement) {
                    event.preventDefault();
                    lastFocusableElement.focus();
                } else if (!isInsideContainer) {
                    lastFocusableElement.focus();
                }
            } else {
                if (active === lastFocusableElement) {
                    event.preventDefault();
                    firstFocusableElement.focus();
                } else if (!isInsideContainer) {
                    firstFocusableElement.focus();
                }
            }
            event.stopPropagation();
        }
    }

    private filter(e: HTMLElement) {
        return (
            getComputedStyle(e).display !== 'none' &&
            getComputedStyle(e).display !== 'contents' &&
            getComputedStyle(e).contentVisibility !== 'hidden' &&
            getComputedStyle(e).visibility !== 'hidden' &&
            e.checkVisibility() &&
            e.tabIndex !== -1
        );
    }

    private mutations(mutationsList: MutationRecord[], state: { listElement: HTMLElement[] }, div: HTMLDivElement) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                state.listElement = this.firstLastFocusableElement(div);
                return;
            }
        }
    }

    private firstLastFocusableElement(div: HTMLDivElement): HTMLElement[] {
        const focusableElements = div.querySelectorAll<HTMLElement>(this.focusRules);
        return Array.from(focusableElements);
    }
}
