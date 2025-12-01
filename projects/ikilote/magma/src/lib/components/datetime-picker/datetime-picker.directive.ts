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

import { MagmaDatetimePickerComponent } from './datetime-picker.component';

import { MagmaClickEnterDirective } from '../../directives/click-enter.directive';

const connectedPosition: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
];

@Directive({
    selector: '[datetimePicker]',
    host: {
        '[class.datetime-picker]': 'true',
        '[tabIndex]': 'datetimePickerDisabled() ? -1 : 0',
    },
    hostDirectives: [MagmaClickEnterDirective],
})
export class MagmaDatetimePicker implements OnDestroy, OnChanges {
    private readonly overlay = inject(Overlay);
    private readonly element = inject(ElementRef<HTMLElement>);
    private readonly click = inject(MagmaClickEnterDirective);

    readonly datetimePicker = input<string>();
    readonly datetimePickerDisabled = input(false, { transform: booleanAttribute });
    readonly datetimePickerReadonly = input(false, { transform: booleanAttribute });

    static _overlayRef?: OverlayRef;
    static _component?: ComponentRef<MagmaDatetimePickerComponent>;

    datetimeChange = output<string>();
    datetimeClose = output<string>();

    private updateEmit?: OutputRefSubscription;

    constructor() {
        this.click.clickEnter.subscribe(event => {
            this.open(event);
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['datetimePickerAlpha']) {
            MagmaDatetimePicker._component?.setInput('alpha', changes['datetimePickerAlpha'].currentValue);
        }
    }

    async open(event?: Event) {
        if (this.datetimePickerDisabled()) {
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
        const userProfilePortal = new ComponentPortal(MagmaDatetimePickerComponent);

        let datetime = this.datetimePicker();
        let initDatetime = datetime;

        const component = overlayRef.attach(userProfilePortal);
        component.setInput('value', this.datetimePicker());
        component.setInput('readonly', this.datetimePickerReadonly());
        component.setInput('embedded', true);

        this.updateEmit = component.instance.datetimeChange.subscribe(value => {
            datetime = value;
            this.datetimeChange.emit(value);
        });

        overlayRef.backdropClick().subscribe(() => {
            this.close();
            if (datetime !== undefined && datetime !== initDatetime) {
                this.datetimeClose.emit(datetime);
            }
        });

        MagmaDatetimePicker._overlayRef = overlayRef;
        MagmaDatetimePicker._component = component;

        event?.preventDefault();
        event?.stopPropagation();
    }

    ngOnDestroy(): void {
        this.updateEmit?.unsubscribe();
        this.close();
    }

    @HostListener('keydown.space')
    openKeyboard() {
        this.open();
    }

    @HostListener('document:keydown.escape')
    escape() {
        this.close();
    }

    private close() {
        MagmaDatetimePicker._overlayRef?.dispose();
        MagmaDatetimePicker._overlayRef = undefined;
        MagmaDatetimePicker._component = undefined;
    }
}
