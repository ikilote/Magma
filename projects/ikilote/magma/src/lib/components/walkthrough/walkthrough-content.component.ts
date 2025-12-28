import { ConnectedOverlayPositionChange, ConnectionPositionPair } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    inject,
    input,
    signal,
    viewChild,
} from '@angular/core';

import { debounceTime, fromEvent } from 'rxjs';

import { MagmaWalkthroughStep } from './walkthrough-step.directive';
import { MagmaWalkthrough } from './walkthrough.component';

import { MagmaLimitFocusDirective, MagmaLimitFocusFirstDirective } from '../../directives/limit-focus.directive';
import { Subscriptions } from '../../utils/subscriptions';

@Component({
    selector: 'mg-walkthrough-content',
    templateUrl: './walkthrough-content.component.html',
    styleUrl: './walkthrough-content.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [PortalModule, MagmaLimitFocusFirstDirective],
    hostDirectives: [MagmaLimitFocusDirective],
})
export class MagmaWalkthroughContent implements OnInit, OnChanges, OnDestroy {
    private readonly focusElement = inject(MagmaLimitFocusDirective);

    readonly host = input.required<MagmaWalkthrough>();
    readonly portal = input.required<MagmaWalkthroughStep>();
    readonly element = input.required<HTMLElement | null>();
    readonly position = input<ConnectedOverlayPositionChange>();

    private elementContent = viewChild.required<ElementRef<HTMLDialogElement>>('element');

    private subs = Subscriptions.instance();
    clone: HTMLElement | undefined;

    protected top = signal(false);
    protected right = signal(false);

    ngOnInit() {
        this.subs.push(
            fromEvent(window, 'resize')
                .pipe(debounceTime(10))
                .subscribe(() => {
                    this.resize();
                }),
        );
    }

    resize() {
        const element = this.element();
        if (this.clone && element) {
            const style = this.clone.style;
            if (style.width !== element.offsetWidth + 'px') {
                style.width = element.offsetWidth + 'px';
            }
            if (style.margin !== '0px') {
                style.margin = '0px';
            }
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        const position = changes['position'];
        if (position) {
            this.testPosition(position.currentValue.connectionPair);
        }

        if (changes['element']) {
            const target = this.elementContent().nativeElement;

            const portal = this.portal();
            portal.start.emit();

            if (portal.showElement()) {
                // clean before clone
                while (target.lastElementChild) {
                    target.removeChild(target.lastElementChild);
                }
                const element = this.element();
                if (element) {
                    setTimeout(() => {
                        const clone = element.cloneNode(true) as HTMLElement;
                        clone.style.width = element.offsetWidth + 'px';
                        clone.style.margin = '0px';
                        this.clone = clone;

                        // click on original element
                        const actionOrigin = portal.clickElementOrigin();
                        if (target && actionOrigin) {
                            clone.addEventListener('click', () => element.click());
                        }

                        // click on copy element
                        const action = portal.clickElementActive();
                        if (action) {
                            clone.addEventListener('click', () => portal.clickElement.emit());
                        }

                        target.appendChild(clone);
                    });
                }
            } else {
                target.textContent = '';
            }
        }
    }

    next() {
        const portal = this.portal();
        portal.clickNext.emit();
        setTimeout(() => {
            this.host().changeStep(portal.nextStep(), portal.group());
        }, 10);
    }

    previous() {
        const portal = this.portal();
        portal.clickPrevious.emit();
        setTimeout(() => {
            this.host().changeStep(portal.previousStep(), portal.group());
        }, 10);
    }

    close() {
        this.portal().clickClose.emit();
        setTimeout(() => {
            this.host().close();
        }, 10);
    }

    update() {
        setTimeout(() => {
            this.focusElement.focus();
        });
    }

    ngOnDestroy(): void {
        this.subs.clear();
    }

    testPosition(connectionPair: ConnectionPositionPair) {
        this.right.set(connectionPair.originX === 'end');
        this.top.set(connectionPair.originY === 'top');
    }

    @HostListener('document:keydown.escape')
    escape() {
        const portal = this.portal();
        if (portal.close()) {
            this.close();
        } else if (portal.nextStep()) {
            this.next();
        }
    }
}
