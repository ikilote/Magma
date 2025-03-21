import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    booleanAttribute,
    inject,
    input,
    output,
    signal,
    viewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { Subscriptions } from '../../utils/subscriptions';

@Component({
    selector: 'mg-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.open]': 'isOpen()',
    },
})
export class MagmaDialog implements OnDestroy {
    // inject

    private readonly cd = inject(ChangeDetectorRef);

    // input

    readonly closeButton = input(false, { transform: booleanAttribute });
    readonly closeBackdrop = input(false, { transform: booleanAttribute });

    // output

    readonly onClose = output();

    // viewChild

    focusElement = viewChild<ElementRef<HTMLDivElement>>('focus');

    // host

    isOpen = signal(false);

    private sub = Subscriptions.instance();
    private focusOrigin: HTMLElement | null = null;
    private observer: MutationObserver | undefined;

    constructor() {
        this.sub.push(
            toObservable(this.focusElement).subscribe(element => {
                if (element) {
                    this.focusOrigin = document.activeElement as HTMLElement | null;
                    this.limitFocus(element);
                }
            }),
        );
    }

    ngOnDestroy(): void {
        this.sub.clear();
        this.observer?.disconnect();
    }

    @HostListener('click')
    onClick() {
        if (this.closeBackdrop()) {
            this.close();
        }
    }

    open() {
        console.log('open');
        this.isOpen.set(true);
    }

    close() {
        this.isOpen.set(false);
        this.onClose.emit();
        this.observer?.disconnect();
        if (this.focusOrigin) {
            this.focusOrigin.focus();
        }
    }

    _propagationStop(event: Event) {
        event.stopPropagation();
        window.dispatchEvent(new CustomEvent('dialog-click', { detail: event }));
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
