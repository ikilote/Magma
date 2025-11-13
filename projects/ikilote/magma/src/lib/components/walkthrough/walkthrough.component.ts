import { ConnectedPosition, FlexibleConnectedPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, ComponentRef, contentChildren, inject } from '@angular/core';

import { MagmaWalkthroughContent } from './walkthrough-content.component';
import { MagmaWalkthroughStep } from './walkthrough-step.directive';

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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagmaWalkthrough {
    private content: ComponentRef<MagmaWalkthroughContent> | undefined = undefined;
    private overlayRef: OverlayRef | undefined = undefined;
    private positionStrategy: FlexibleConnectedPositionStrategy | undefined = undefined;

    overlayComponent: MagmaWalkthroughContent | undefined = undefined;

    private readonly overlay = inject(Overlay);
    stepsDirective = contentChildren(MagmaWalkthroughStep);

    private portal: MagmaWalkthroughStep | undefined = undefined;

    start(params?: { group?: string }) {
        const firstIndex = this.stepsDirective().findIndex(
            step => step.group() === params?.group && step.name() === 'first',
        );

        if (firstIndex !== -1) {
            this.portal = this.stepsDirective()[firstIndex];

            const element = document.querySelector(this.portal.selector());
            if (element) {
                element.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });
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
                overlayRef.backdropClick().subscribe(this.backdropAction);
                const userProfilePortal = new ComponentPortal(MagmaWalkthroughContent);
                const component = overlayRef.attach(userProfilePortal);
                component.setInput('host', this);
                component.setInput('portal', this.portal);
                component.setInput('element', element as HTMLElement);

                this.overlayComponent = component.instance;

                this.positionStrategy = overlayRef.getConfig().positionStrategy as FlexibleConnectedPositionStrategy;

                this.positionStrategy.positionChanges.subscribe(position => {
                    component.setInput('position', position);
                });

                this.content = component;
                this.overlayRef = overlayRef;

                setTimeout(() => {
                    this.overlayRef?.updatePosition();
                }, 10);
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
            this.portal = this.stepsDirective()[firstIndex];
            this.content.setInput('portal', this.portal);

            const element = document.querySelector(this.portal.selector());
            if (element && this.positionStrategy) {
                element.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });
                this.positionStrategy.setOrigin(element);
                this.positionStrategy.apply();
                this.positionStrategy.reapplyLastPosition();
            }

            this.content.setInput('element', element as HTMLElement | null);

            setTimeout(() => {
                this.overlayRef?.updatePosition();
            }, 10);
        }
    }

    close() {
        this.overlayRef?.dispose();
        this.content = undefined;
        this.overlayRef = undefined;
        this.overlayComponent = undefined;
    }

    private backdropAction() {
        switch (this.portal?.backdropAction()) {
            case 'close':
                this.close();
                break;
            case 'next':
                if (this.portal.nextStep()) {
                    this.changeStep(this.portal.nextStep(), this.portal.group());
                }
                break;
            case 'clickElement':
                if (this.portal.clickElementActive() || this.portal.clickElementOrigin()) {
                    this.content?.instance.clone?.click();
                }
                break;
            default:
        }
    }
}
