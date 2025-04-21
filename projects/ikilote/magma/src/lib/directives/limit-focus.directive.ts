import { AfterContentInit, Directive, ElementRef, OnDestroy, contentChildren, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { Subscriptions } from '../utils/subscriptions';

@Directive({
    selector: '[limitFocusFirst]',
})
export class MagmaLimitFocusFirstDirective {
    focusElement = inject<ElementRef<HTMLDivElement>>(ElementRef);
}

@Directive({
    selector: '[limitFocus]',
    host: {
        tabindex: '0',
    },
})
export class MagmaLimitFocusDirective implements OnDestroy, AfterContentInit {
    readonly focusElement = inject<ElementRef<HTMLDivElement>>(ElementRef);

    readonly focusFirstElement = contentChildren(MagmaLimitFocusFirstDirective);

    private sub = Subscriptions.instance();
    private focusOrigin: HTMLElement | null = null;
    private observer: MutationObserver | undefined;

    constructor() {
        setTimeout(() => {
            this.focusOrigin = document.activeElement as HTMLElement | null;
            this.limitFocus(this.focusElement);
        });

        this.sub.push(
            toObservable(this.focusFirstElement).subscribe(element => {
                console.log('element >>b>', element);
                element?.[0]?.focusElement?.nativeElement?.focus();
            }),
        );
    }

    ngAfterContentInit() {
        setTimeout(() => {
            console.log('element >>a>', this.focusFirstElement());
        });
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
        this.focusOrigin?.focus();
        this.sub.clear();
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
