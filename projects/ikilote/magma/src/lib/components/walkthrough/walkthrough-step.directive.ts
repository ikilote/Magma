import { CdkPortal } from '@angular/cdk/portal';
import { Directive, booleanAttribute, inject, input, output } from '@angular/core';

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
    showElement = input(false, { transform: booleanAttribute });
    clickElementOrigin = input(false, { transform: booleanAttribute });
    clickElementActive = input(false, { transform: booleanAttribute });

    clickElement = output<void>();
}
