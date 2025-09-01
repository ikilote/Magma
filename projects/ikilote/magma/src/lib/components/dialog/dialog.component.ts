import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    booleanAttribute,
    computed,
    input,
    output,
    signal,
    viewChild,
} from '@angular/core';

import { MagmaLimitFocusDirective } from '../../directives/limit-focus.directive';

let idIndex = 0;

@Component({
    selector: 'mg-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MagmaLimitFocusDirective],
    host: {
        '[class.open]': 'isOpen()',
        '[attr.tabindex]': "isOpen() && closeBackdrop() ? '0' : null",
        '[attr.role]': "isOpen() && closeBackdrop() ? 'button' : null",
    },
})
export class MagmaDialog {
    // input

    readonly closeButton = input(false, { transform: booleanAttribute });
    readonly closeBackdrop = input(false, { transform: booleanAttribute });
    readonly closeButtonTitle = input('Close');
    readonly label = input<string>();
    readonly title = input<string>();
    readonly id = input<string>();

    // output

    readonly onClose = output();

    // viewChild

    readonly divFocus = viewChild<ElementRef<HTMLDivElement>>('div');

    // host

    isOpen = signal(false);
    private index = idIndex++;
    protected computedId = computed(() => this.id() || `dialog-${this.index}}`);

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {
        if (this.closeBackdrop()) {
            this.close();
        } else {
            this.divFocus()?.nativeElement.focus();
            event.stopPropagation();
        }
    }

    open() {
        this.isOpen.set(true);
    }

    close() {
        this.isOpen.set(false);
        this.onClose.emit();
    }

    protected _propagationStop(event: Event) {
        event.stopPropagation();
        window.dispatchEvent(new CustomEvent('dialog-click', { detail: event }));
    }
}
