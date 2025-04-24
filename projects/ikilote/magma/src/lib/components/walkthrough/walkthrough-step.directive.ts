import { CdkPortal } from '@angular/cdk/portal';
import { Directive, booleanAttribute, inject, input, output } from '@angular/core';

@Directive({
    selector: 'ng-template[mg-walkthrough-step]',
    providers: [{ provide: CdkPortal }],
})
export class MagmaWalkthroughStep extends CdkPortal {
    portal = inject(CdkPortal);

    name = input.required<string>();
    group = input<string>();
    selector = input.required<string>();
    previousStep = input<string>();
    previousButtonName = input<string>('Previous');
    nextStep = input<string>();
    nextButtonName = input<string>('Next');
    close = input(false, { transform: booleanAttribute });
    closeButtonName = input<string>('Close');
    showElement = input(false, { transform: booleanAttribute });
    clickElementOrigin = input(false, { transform: booleanAttribute });
    clickElementActive = input(false, { transform: booleanAttribute });
    backdropAction = input<'none' | 'close' | 'next' | 'clickElement'>();

    clickElement = output<void>();
}
