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

            let listElement = this.firstLastFocusableElement(div);

            div.addEventListener('keydown', event => {
                this.keydown(event, listElement);
            });

            this.observer = new MutationObserver(mutationsList => {
                this.mutations(mutationsList, listElement, div);
            });
            this.observer.observe(div, { attributes: true, childList: true, subtree: true });
        }
    }

    private keydown(event: KeyboardEvent, listElement: HTMLElement[]) {
        if (event.key === 'Tab') {
            const list = listElement.filter(
                e =>
                    getComputedStyle(e).display !== 'none' &&
                    getComputedStyle(e).visibility !== 'hidden' &&
                    e.tabIndex !== -1,
            );
            const firstFocusableElement = list[0];
            const lastFocusableElement = list[list.length - 1];

            if (event.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    event.preventDefault();
                    lastFocusableElement.focus();
                }
                if (!list.find(e => e === document.activeElement)) {
                    lastFocusableElement.focus();
                }
            } else if (document.activeElement === lastFocusableElement) {
                event.preventDefault();
                firstFocusableElement.focus();
            } else if (!list.find(e => e === document.activeElement)) {
                firstFocusableElement.focus();
            }
        }
    }

    private mutations(mutationsList: MutationRecord[], listElement: HTMLElement[], div: HTMLDivElement) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                listElement = this.firstLastFocusableElement(div);
                return;
            }
        }
    }

    private firstLastFocusableElement(div: HTMLDivElement): HTMLElement[] {
        const focusableElements = div.querySelectorAll<HTMLElement>(this.focusRules);
        return Array.from(focusableElements);
    }
}
