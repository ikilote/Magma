import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnChanges,
    SimpleChanges,
    input,
    viewChild,
} from '@angular/core';

import { MagmaWalkthroughStep } from './walkthrough-step.directive';
import { MagmaWalkthrough } from './walkthrough.component';

export function throwWalkthroughContentAlreadyAttachedError() {
    throw Error('Attempting to attach walkthrough content after content is already attached');
}

@Component({
    selector: 'mg-walkthrough-content',
    templateUrl: './walkthrough-content.component.html',
    styleUrls: ['./walkthrough-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, PortalModule],
})
export class MagmaWalkthroughContent implements OnChanges {
    readonly host = input.required<MagmaWalkthrough>();
    readonly portal = input.required<MagmaWalkthroughStep>();
    readonly element = input.required<HTMLElement | null>();

    elementContent = viewChild.required<ElementRef<HTMLDialogElement>>('element');

    ngOnChanges(changes: SimpleChanges): void {
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

                    // click on original element
                    const actionOrigin = this.portal().clickElementOrigin();
                    if (target && actionOrigin) {
                        clone.addEventListener('click', () => element.click());
                    }

                    // click on copy element
                    const action = this.portal().clickElementActive();
                    console.log(action);
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
        this.host().changeStep(this.portal().nextStep()!);
    }

    previous() {
        this.host().changeStep(this.portal().previousStep()!);
    }

    close() {
        this.host().close();
    }
}
