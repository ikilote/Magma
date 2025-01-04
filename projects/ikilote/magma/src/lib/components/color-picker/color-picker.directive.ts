import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Directive, HostListener, booleanAttribute, inject, input } from '@angular/core';

import { ColorPickerComponent } from './color-picker.component';

const connectedPosition: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
];

@Directive({
    selector: '[colorPicker]',
})
export class MagmaColorPicker {
    private readonly overlay = inject(Overlay);

    static _overlayRef?: OverlayRef;

    contextMenuDisabled = input(false, { transform: booleanAttribute });

    @HostListener('contextmenu', ['$event'])
    async onContextMenu(event: MouseEvent) {
        if (this.contextMenuDisabled()) {
            return;
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
        const userProfilePortal = new ComponentPortal(ColorPickerComponent);

        const component = overlayRef.attach(userProfilePortal);
        // component.setInput('items', this.contextMenu());
        // component.setInput('mode', this.contextMenuMode());

        overlayRef.backdropClick().subscribe(() => {
            overlayRef.dispose();
            MagmaColorPicker._overlayRef = undefined;
        });

        MagmaColorPicker._overlayRef = overlayRef;

        event.preventDefault();
        event.stopPropagation();
    }

    @HostListener('window:contextmenu', ['$event'])
    onContextMenuContext(event: MouseEvent) {
        if (MagmaColorPicker._overlayRef) {
            this.close(event);
        }
    }

    @HostListener('window:auxclick', ['$event'])
    onContextMenuAux(event: MouseEvent) {
        if (event.button === 1 && MagmaColorPicker._overlayRef) {
            this.close(event);
        }
    }

    private close(event: MouseEvent) {
        MagmaColorPicker._overlayRef!.dispose();
        MagmaColorPicker._overlayRef = undefined;
        event.preventDefault();
        event.stopPropagation();
    }
}
