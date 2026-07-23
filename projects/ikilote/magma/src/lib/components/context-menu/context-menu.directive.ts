import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Directive, HostListener, booleanAttribute, inject, input } from '@angular/core';

import { ContextMenuData, ContextMenuMode, MagmaContextMenuComponent } from './context-menu.component';

const connectedPosition: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
];

@Directive()
export abstract class AbstractContextMenuComponent {
    context = input<MagmaContextMenu<any>>();
}

@Directive({
    selector: '[contextMenu]',
})
export class MagmaContextMenu<T> {
    private readonly overlay = inject(Overlay);

    static _overlayRef?: OverlayRef;

    contextMenu = input<ContextMenuData<T>>();
    contextMenuMode = input<ContextMenuMode>('default');
    contextMenuDisabled = input(false, { transform: booleanAttribute });

    open(event: MouseEvent, menuData?: ContextMenuData<T>, mode?: ContextMenuMode): boolean {
        event.preventDefault();
        event.stopPropagation();

        if (this.contextMenuDisabled()) {
            return false;
        }

        const menuItems = menuData || this.contextMenu();
        const menuMode = mode || this.contextMenuMode();

        if (!menuItems?.contextMenu?.length) {
            return false;
        }

        const overlayRef = this.overlay.create({
            hasBackdrop: true,
            backdropClass: 'overlay-backdrop',
            panelClass: 'overlay-panel',
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy: this.overlay
                .position()
                .flexibleConnectedTo({ x: event.clientX, y: event.clientY })
                .withPositions(connectedPosition),
        });

        const portal = new ComponentPortal(MagmaContextMenuComponent);
        const componentRef = overlayRef.attach(portal);

        componentRef.setInput('items', menuItems);
        componentRef.setInput('mode', menuMode);
        componentRef.setInput('context', this);

        overlayRef.backdropClick().subscribe((event: MouseEvent) => {
            overlayRef.dispose();
            MagmaContextMenu._overlayRef = undefined;

            // Redispatch the click/contextmenu to the element beneath the backdrop
            const x = event.clientX;
            const y = event.clientY;
            if (isFinite(x) && isFinite(y)) {
                const elementBelow = document.elementFromPoint(x, y);
                if (elementBelow) {
                    const eventType = event.button === 2 ? 'contextmenu' : 'click';
                    elementBelow.dispatchEvent(
                        new MouseEvent(eventType, {
                            bubbles: true,
                            cancelable: true,
                            clientX: x,
                            clientY: y,
                            button: event.button,
                        }),
                    );
                }
            }
        });

        MagmaContextMenu._overlayRef = overlayRef;
        return true;
    }

    @HostListener('contextmenu', ['$event'])
    onContextMenu(event: MouseEvent) {
        this.open(event);
    }

    @HostListener('window:contextmenu', ['$event'])
    onContextMenuContext(event: MouseEvent) {
        if (MagmaContextMenu._overlayRef) {
            this.close(event);
        }
    }

    @HostListener('window:auxclick', ['$event'])
    onContextMenuAux(event: MouseEvent) {
        if (event.button === 1 && MagmaContextMenu._overlayRef) {
            this.close(event);
        }
    }

    close(event?: MouseEvent) {
        if (MagmaContextMenu._overlayRef) {
            MagmaContextMenu._overlayRef.dispose();
            MagmaContextMenu._overlayRef = undefined;
        }
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
    }
}
