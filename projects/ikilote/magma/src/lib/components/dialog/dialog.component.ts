import {
    ChangeDetectionStrategy,
    Component,
    HostListener,
    booleanAttribute,
    input,
    output,
    signal,
} from '@angular/core';

import { MagmaLimitFocusDirective } from '../../directives/limit-focus.directive';

@Component({
    selector: 'mg-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MagmaLimitFocusDirective],
    host: {
        '[class.open]': 'isOpen()',
    },
})
export class MagmaDialog {
    // input

    readonly closeButton = input(false, { transform: booleanAttribute });
    readonly closeBackdrop = input(false, { transform: booleanAttribute });

    // output

    readonly onClose = output();

    // host

    isOpen = signal(false);

    @HostListener('click')
    onClick() {
        if (this.closeBackdrop()) {
            this.close();
        }
    }

    open() {
        console.log('open');
        this.isOpen.set(true);
    }

    close() {
        this.isOpen.set(false);
        this.onClose.emit();
    }

    _propagationStop(event: Event) {
        event.stopPropagation();
        window.dispatchEvent(new CustomEvent('dialog-click', { detail: event }));
    }
}
