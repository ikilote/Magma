import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, ComponentRef, contentChildren, inject } from '@angular/core';

import { MagmaWalkthroughContent } from './walkthrough-content.component';
import { MagmaWalkthroughStep } from './walkthrough-step.directive';

const connectedPosition: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
];

@Component({
    selector: 'mg-walkthrough',
    template: '',
    exportAs: 'walkthrough',
})
export class MagmaWalkthrough {
    private content: ComponentRef<MagmaWalkthroughContent> | undefined = undefined;
    private overlayRef: OverlayRef | undefined = undefined;

    private readonly overlay = inject(Overlay);
    stepsDirective = contentChildren(MagmaWalkthroughStep);

    start() {
        const firstIndex = this.stepsDirective().findIndex(step => step.name() === 'first');

        if (firstIndex !== -1) {
            const element = document.querySelector(this.stepsDirective()[firstIndex].selector());
            if (element) {
                const overlayRef = this.overlay.create({
                    hasBackdrop: true,
                    backdropClass: 'overlay-backdrop',
                    panelClass: 'overlay-panel',
                    scrollStrategy: this.overlay.scrollStrategies.block(),
                    positionStrategy: this.overlay
                        .position()
                        .flexibleConnectedTo(element)
                        .withPositions(connectedPosition),
                });
                const userProfilePortal = new ComponentPortal(MagmaWalkthroughContent);
                const component = overlayRef.attach(userProfilePortal);
                component.setInput('host', this);
                component.setInput('portal', this.stepsDirective()[firstIndex]);

                this.content = component;
                this.overlayRef = overlayRef;
            }
        }
    }

    next(stepName: string) {
        const firstIndex = this.stepsDirective().findIndex(step => step.name() === stepName);
        if (this.content && firstIndex !== -1) {
            this.content.setInput('portal', this.stepsDirective()[firstIndex]);
            const element = document.querySelector(this.stepsDirective()[firstIndex].selector());
            if (element) {
                this.overlayRef?.updatePositionStrategy(
                    this.overlay.position().flexibleConnectedTo(element).withPositions(connectedPosition),
                );
            }
        }
    }
}
