import { Directive, HostListener, Input, booleanAttribute, output } from '@angular/core';

@Directive({
    selector: '[clickEnter]',
    host: {
        '[class.click-enter]': 'true',
        '[attr.tabindex]': '!disabled ? 0 : null',
        '[attr.role]': "!disabled ? 'button' : null",
    },
})
export class MagmaClickEnterDirective {
    // don't change: https://github.com/angular/angular/issues/50510
    @Input({ transform: booleanAttribute })
    disabled = false;

    readonly clickEnter = output<KeyboardEvent | MouseEvent>();

    @HostListener('click', ['$event'])
    @HostListener('keydown.enter', ['$event'])
    onClick(event: KeyboardEvent | MouseEvent | Event) {
        if (!this.disabled) {
            this.clickEnter.emit(event as KeyboardEvent | MouseEvent);
        }
    }
}
