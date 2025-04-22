import { ConnectedOverlayPositionChange, ConnectionPositionPair } from '@angular/cdk/overlay-module.d-CSrPj90C';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    inject,
    input,
    signal,
    viewChild,
} from '@angular/core';

import { Subscriptions } from '@ikilote/magma';

import { debounceTime, fromEvent } from 'rxjs';

import { MagmaWalkthroughStep } from './walkthrough-step.directive';
import { MagmaWalkthrough, magmaWalkthroughConnectedPosition } from './walkthrough.component';

import { MagmaLimitFocusDirective, MagmaLimitFocusFirstDirective } from '../../directives/limit-focus.directive';

@Component({
    selector: 'mg-walkthrough-content',
    templateUrl: './walkthrough-content.component.html',
    styleUrls: ['./walkthrough-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, PortalModule, MagmaLimitFocusFirstDirective],
    hostDirectives: [MagmaLimitFocusDirective],
})
export class MagmaWalkthroughContent implements OnChanges, OnDestroy {
    private readonly focusElement = inject(MagmaLimitFocusDirective);

    readonly host = input.required<MagmaWalkthrough>();
    readonly portal = input.required<MagmaWalkthroughStep>();
    readonly element = input.required<HTMLElement | null>();
    readonly position = input.required<ConnectedOverlayPositionChange>();

    private elementContent = viewChild.required<ElementRef<HTMLDialogElement>>('element');

    private subs = Subscriptions.instance();
    private clone: HTMLElement | undefined;

    protected top = signal(false);
    protected right = signal(false);

    constructor() {
        this.subs.push(
            fromEvent(window, 'resize')
                .pipe(debounceTime(100))
                .subscribe(() => {
                    const element = this.element();
                    if (this.clone && element) {
                        const clone = element.cloneNode(true) as HTMLElement;
                        this.clone.style.width = element.offsetWidth + 'px';
                        this.clone.style.margin = '0px';
                    }

                    if (this.position()) {
                        this.testPosition(this.position().connectionPair);
                    }
                }),
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['position']) {
            this.testPosition(changes['position'].currentValue.connectionPair);
        }

        if (changes['element']) {
            const target = this.elementContent().nativeElement;
            if (this.portal().showElement()) {
                while (target.lastElementChild) {
                    target.removeChild(target.lastElementChild);
                }
                const element = this.element();
                if (element) {
                    const clone = element.cloneNode(true) as HTMLElement;
                    clone.style.width = element.offsetWidth + 'px';
                    clone.style.margin = '0px';
                    this.clone = clone;

                    // click on original element
                    const actionOrigin = this.portal().clickElementOrigin();
                    if (target && actionOrigin) {
                        clone.addEventListener('click', () => element.click());
                    }

                    // click on copy element
                    const action = this.portal().clickElementActive();
                    console.log('action:', action);
                    if (action) {
                        clone.addEventListener('click', () => this.portal().clickElement.emit());
                    }

                    target.appendChild(clone);
                }
            } else {
                target.textContent = '';
            }
        }
    }

    next() {
        this.host().changeStep(this.portal().nextStep(), this.portal().group());
    }

    previous() {
        this.host().changeStep(this.portal().previousStep(), this.portal().group());
    }

    close() {
        this.host().close();
    }

    update() {
        setTimeout(() => {
            this.focusElement.focus();
        });
    }

    ngOnDestroy(): void {
        this.subs.clear();
    }

    protected testPosition(connectionPair: ConnectionPositionPair) {
        const index = magmaWalkthroughConnectedPosition.indexOf(connectionPair);
        switch (index) {
            case 1:
                this.right.set(false);
                this.top.set(true);
                break;
            case 2:
                this.right.set(true);
                this.top.set(false);
                break;
            case 3:
                this.right.set(true);
                this.top.set(true);
                break;
            default:
                this.right.set(false);
                this.top.set(false);
                break;
        }
    }
}
