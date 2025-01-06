import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
    Directive,
    ElementRef,
    HostListener,
    OnDestroy,
    OutputRefSubscription,
    booleanAttribute,
    inject,
    input,
    output,
} from '@angular/core';

import { MagmaColorPickerComponent } from './color-picker.component';

const connectedPosition: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
];

@Directive({
    selector: '[colorPicker]',
    host: {
        '[class.color-picker]': 'true',
    },
})
export class MagmaColorPicker implements OnDestroy {
    private readonly overlay = inject(Overlay);
    private readonly element = inject(ElementRef<HTMLElement>);

    readonly colorPicker = input<string>();
    readonly colorPickerAlpha = input(false, { transform: booleanAttribute });
    readonly colorPickerDisabled = input(false, { transform: booleanAttribute });

    static _overlayRef?: OverlayRef;

    colorChange = output<string>();
    colorClose = output<string>();

    private updateEmit?: OutputRefSubscription;

    @HostListener('click', ['$event'])
    async onContextMenu(event: MouseEvent) {
        if (this.colorPickerDisabled()) {
            return;
        }

        const overlayRef = this.overlay.create({
            hasBackdrop: true,
            backdropClass: 'overlay-backdrop',
            panelClass: 'overlay-panel',
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy: this.overlay
                .position()
                .flexibleConnectedTo(this.element)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                ]),
        });
        const userProfilePortal = new ComponentPortal(MagmaColorPickerComponent);

        let color = this.colorPicker();
        let initColor = color;

        const component = overlayRef.attach(userProfilePortal);
        component.setInput('color', this.colorPicker());
        component.setInput('alpha', this.colorPickerAlpha());
        component.setInput('embedded', true);

        this.updateEmit = component.instance.colorChange.subscribe(value => {
            this.colorChange.emit(value);
            color = value;
        });

        overlayRef.backdropClick().subscribe(() => {
            this.close();
            if (color && color !== initColor) {
                this.colorClose.emit(color);
            }
        });

        MagmaColorPicker._overlayRef = overlayRef;

        event.preventDefault();
        event.stopPropagation();
    }

    ngOnDestroy(): void {
        this.updateEmit?.unsubscribe();
    }

    @HostListener('document:keydown.escape', ['$event'])
    escape() {
        this.close();
    }

    private close() {
        MagmaColorPicker._overlayRef!.dispose();
        MagmaColorPicker._overlayRef = undefined;
    }
}
