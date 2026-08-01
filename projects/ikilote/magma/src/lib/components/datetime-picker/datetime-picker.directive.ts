import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
    ComponentRef,
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

import { MagmaDatetimePickerComponent, MagmaDatetimePickerDays, MagmaDatetimeType } from './datetime-picker.component';

import { MagmaClickEnterDirective } from '../../directives/click-enter.directive';
import { WeekDay } from '../../utils/date';

const connectedPosition: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
];

@Directive({
    selector: '[mgDatetimePicker]',
    host: {
        '[class.datetime-picker]': 'true',
        '[tabIndex]': 'mgDatetimePickerDisabled() ? -1 : 0',
    },
    hostDirectives: [MagmaClickEnterDirective],
})
export class MagmaDatetimePicker implements OnDestroy {
    private readonly overlay = inject(Overlay);
    private readonly element = inject(ElementRef<HTMLElement>);
    private readonly click = inject(MagmaClickEnterDirective);

    readonly mgDatetimePicker = input<string>();
    readonly mgDatetimePickerType = input<MagmaDatetimeType | undefined>();
    readonly mgDatetimePickerDisabled = input(false, { transform: booleanAttribute });
    readonly mgDatetimePickerReadonly = input(false, { transform: booleanAttribute });
    readonly mgDatetimePickerLang = input<string | undefined>();
    readonly mgDatetimePickerMin = input<string | number | Date | undefined>();
    readonly mgDatetimePickerMax = input<string | number | Date | undefined>();
    readonly mgDatetimePickerFirstDayOfWeek = input<MagmaDatetimePickerDays>();
    readonly mgDatetimePickerWeekend = input<WeekDay[]>(['Sunday', 'Saturday']);
    readonly mgDatetimePickerhideWeekendStyle = input(false, { transform: booleanAttribute });
    readonly mgDatetimePickerHideWeekNumber = input(false, { transform: booleanAttribute });

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

    async open(event?: Event) {
        if (this.mgDatetimePickerDisabled()) {
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

        let datetime = this.mgDatetimePicker();
        const initDatetime = datetime;

        const component = overlayRef.attach(userProfilePortal);
        component.setInput('value', this.mgDatetimePicker());
        component.setInput('readonly', this.mgDatetimePickerReadonly());
        component.setInput('type', this.mgDatetimePickerType());
        component.setInput('lang', this.mgDatetimePickerLang());
        component.setInput('min', this.mgDatetimePickerMin());
        component.setInput('max', this.mgDatetimePickerMax());
        component.setInput('firstDayOfWeek', this.mgDatetimePickerFirstDayOfWeek());
        component.setInput('weekend', this.mgDatetimePickerWeekend());
        component.setInput('hideWeekendStyle', this.mgDatetimePickerhideWeekendStyle());
        component.setInput('hideWeekNumber', this.mgDatetimePickerHideWeekNumber());
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
        this.updateEmit = undefined;
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
        this.updateEmit?.unsubscribe();
        this.updateEmit = undefined;
        MagmaDatetimePicker._overlayRef?.dispose();
        MagmaDatetimePicker._overlayRef = undefined;
        MagmaDatetimePicker._component = undefined;
    }
}
