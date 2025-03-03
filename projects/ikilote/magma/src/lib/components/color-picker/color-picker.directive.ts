import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
    ComponentRef,
    Directive,
    ElementRef,
    HostListener,
    OnChanges,
    OnDestroy,
    OutputRefSubscription,
    SimpleChanges,
    booleanAttribute,
    inject,
    input,
    output,
} from '@angular/core';

import { MagmaColorPickerComponent, MagmaColorPickerTexts } from './color-picker.component';

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
        '[tabIndex]': 'colorPickerDisabled() ? -1 : 0',
    },
})
export class MagmaColorPicker implements OnDestroy, OnChanges {
    private readonly overlay = inject(Overlay);
    private readonly element = inject(ElementRef<HTMLElement>);

    readonly colorPicker = input<string>();
    readonly colorPickerAlpha = input(false, { transform: booleanAttribute });
    readonly colorPickerDisabled = input(false, { transform: booleanAttribute });
    readonly colorPickerReadonly = input(false, { transform: booleanAttribute });
    readonly colorPickerClearButton = input(false, { transform: booleanAttribute });
    readonly colorPickerTexts = input<MagmaColorPickerTexts>();
    readonly colorPickerPalette = input<string[] | undefined>();
    readonly colorPickerDatalist = input<string[] | undefined>();

    static _overlayRef?: OverlayRef;
    static _component?: ComponentRef<MagmaColorPickerComponent>;

    colorChange = output<string>();
    colorClose = output<string>();

    private updateEmit?: OutputRefSubscription;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['colorPickerAlpha']) {
            MagmaColorPicker._component?.setInput('alpha', changes['colorPickerAlpha'].currentValue);
        }
    }

    @HostListener('click', ['$event'])
    async open(event?: MouseEvent) {
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
                .withPositions(connectedPosition),
        });
        const userProfilePortal = new ComponentPortal(MagmaColorPickerComponent);

        let color = this.colorPicker();
        let initColor = color;

        console.log('>>>>>', this.colorPickerPalette());

        const component = overlayRef.attach(userProfilePortal);
        component.setInput('color', this.colorPicker());
        component.setInput('alpha', this.colorPickerAlpha());
        component.setInput('readonly', this.colorPickerReadonly());
        component.setInput('clearButton', this.colorPickerClearButton());
        component.setInput('palette', this.colorPickerPalette());
        component.setInput('texts', this.colorPickerTexts());
        component.setInput('datalist', this.colorPickerDatalist());
        component.setInput('embedded', true);

        this.updateEmit = component.instance.colorChange.subscribe(value => {
            color = value;
            this.colorChange.emit(value);
        });

        overlayRef.backdropClick().subscribe(() => {
            this.close();
            if (color !== undefined && color !== initColor) {
                this.colorClose.emit(color);
            }
        });

        MagmaColorPicker._overlayRef = overlayRef;
        MagmaColorPicker._component = component;

        event?.preventDefault();
        event?.stopPropagation();
    }

    ngOnDestroy(): void {
        this.updateEmit?.unsubscribe();
    }

    @HostListener('keydown.space', ['$event'])
    openKeyboard() {
        this.open();
    }

    @HostListener('document:keydown.escape', ['$event'])
    escape() {
        this.close();
    }

    private close() {
        MagmaColorPicker._overlayRef!.dispose();
        MagmaColorPicker._overlayRef = undefined;
        MagmaColorPicker._component = undefined;
    }
}
