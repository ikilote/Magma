import { ConnectedPosition, FlexibleConnectedPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, ComponentRef, contentChildren, inject } from '@angular/core';

import { MagmaWalkthroughContent } from './walkthrough-content.component';
import { MagmaWalkthroughStep } from './walkthrough-step.directive';

import { Subscriptions } from '../../utils/subscriptions';

export const magmaWalkthroughConnectedPosition: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 10 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -10 },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 10 },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -10 },
];

@Component({
    selector: 'mg-walkthrough',
    template: '',
    exportAs: 'walkthrough',
})
export class MagmaWalkthrough {
    private content: ComponentRef<MagmaWalkthroughContent> | undefined = undefined;
    private overlayRef: OverlayRef | undefined = undefined;
    private positionStrategy: FlexibleConnectedPositionStrategy | undefined = undefined;

    private readonly overlay = inject(Overlay);
    stepsDirective = contentChildren(MagmaWalkthroughStep);

    private subs = Subscriptions.instance();

    start(params?: { group?: string }) {
        const firstIndex = this.stepsDirective().findIndex(
            step => step.group() === params?.group && step.name() === 'first',
        );

        if (firstIndex !== -1) {
            const element = document.querySelector(this.stepsDirective()[firstIndex].selector());
            if (element) {
                const overlayRef = this.overlay.create({
                    hasBackdrop: true,
                    backdropClass: 'walkthrough-backdrop',
                    panelClass: 'overlay-panel',
                    scrollStrategy: this.overlay.scrollStrategies.block(),
                    positionStrategy: this.overlay
                        .position()
                        .flexibleConnectedTo(element)
                        .withPositions(magmaWalkthroughConnectedPosition),
                });
                const userProfilePortal = new ComponentPortal(MagmaWalkthroughContent);
                const component = overlayRef.attach(userProfilePortal);
                component.setInput('host', this);
                component.setInput('portal', this.stepsDirective()[firstIndex]);
                component.setInput('element', element as HTMLElement);

                this.positionStrategy = overlayRef.getConfig().positionStrategy as FlexibleConnectedPositionStrategy;

                this.subs.push(
                    this.positionStrategy.positionChanges.subscribe(position => {
                        component.setInput('position', position);
                    }),
                );

                this.content = component;
                this.overlayRef = overlayRef;
            }
        }
    }

    changeStep(stepName?: string, group?: string) {
        if (!stepName) {
            this.close();
            return;
        }

        const firstIndex = this.stepsDirective().findIndex(step => group === step.group() && stepName === step.name());
        if (this.content && firstIndex !== -1) {
            this.content.setInput('portal', this.stepsDirective()[firstIndex]);

            const element = document.querySelector(this.stepsDirective()[firstIndex].selector());
            if (element && this.positionStrategy) {
                this.positionStrategy.setOrigin(element);
                this.positionStrategy.apply();
                this.positionStrategy.reapplyLastPosition();
            }

            this.content.setInput('element', element as HTMLElement | null);
        }
    }

    close() {
        this.overlayRef?.detach();
        this.content = undefined;
        this.overlayRef = undefined;
        this.subs.clear();
    }
}
