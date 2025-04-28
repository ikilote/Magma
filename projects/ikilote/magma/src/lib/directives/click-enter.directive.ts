import { Directive, HostListener, booleanAttribute, input, output } from '@angular/core';

@Directive({
    selector: '[clickEnter]',
    host: {
        '[class.click-enter]': 'true',
        '[attr.tabindex]': '!disabled() ? 0 : null',
        '[role]': "!disabled() ? 'button' : null",
    },
})
export class MagmaClickEnterDirective {
    readonly disabled = input(false, { transform: booleanAttribute });

    readonly clickEnter = output<KeyboardEvent | MouseEvent>();

    @HostListener('click', ['$event'])
    @HostListener('keydown.enter', ['$event'])
    onClick(event: KeyboardEvent | MouseEvent) {
        if (!this.disabled()) {
            this.clickEnter.emit(event);
        }
    }
}
