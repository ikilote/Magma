import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

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
export class MagmaWalkthroughContent {
    readonly host = input.required<MagmaWalkthrough>();
    readonly portal = input.required<MagmaWalkthroughStep>();

    next() {
        this.host().next(this.portal().nextStep()!);
    }
}
