import { CdkPortal } from '@angular/cdk/portal';
import { Directive, booleanAttribute, inject, input } from '@angular/core';

@Directive({
    selector: 'ng-template[mg-walkthrough-step]',
    providers: [{ provide: CdkPortal }],
})
export class MagmaWalkthroughStep extends CdkPortal {
    portal = inject(CdkPortal);

    name = input.required<string>();
    selector = input.required<string>();
    previousStep = input<string>();
    nextStep = input<string>();
    close = input(false, { transform: booleanAttribute });
}
