import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';

import { numberAttributeOrUndefined } from '../utils/coercion';
import { Subscriptions } from '../utils/subscriptions';

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

            const firstFocusableElement = div;
            let lastFocusableElement = this.lastFocusableElement(div);

            div.addEventListener('keydown', e => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusableElement) {
                            e.preventDefault();
                            lastFocusableElement.focus();
                        }
                    } else if (document.activeElement === lastFocusableElement) {
                        e.preventDefault();
                        firstFocusableElement.focus();
                    }
                }
            });

            this.observer = new MutationObserver(mutationsList => {
                for (const mutation of mutationsList) {
                    if (mutation.type == 'childList' || mutation.type == 'attributes') {
                        lastFocusableElement = this.lastFocusableElement(div);
                        return;
                    }
                }
            });
            this.observer.observe(div, { attributes: true, childList: true, subtree: true });
        }
    }

    private lastFocusableElement(div: HTMLDivElement) {
        const focusableElements = div.querySelectorAll<HTMLElement>(
            'a[href], button:not(:disabled), input:not(:disabled), [tabindex="0"]',
        );
        return focusableElements[focusableElements.length - 1];
    }
}
