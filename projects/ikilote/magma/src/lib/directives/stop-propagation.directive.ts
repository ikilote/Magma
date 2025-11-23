import { Directive, HostListener, booleanAttribute, input } from '@angular/core';

@Directive({
    selector: '[stop-propagation]',
})
export class MagmaStopPropagationDirective {
    /** stopPropagation for keyboard */
    readonly stopKeydown = input(false, { transform: booleanAttribute });
    /** stopPropagation for click */
    readonly stopClick = input(false, { transform: booleanAttribute });

    @HostListener('keydown', ['$event'])
    @HostListener('click', ['$event'])
    block(event: KeyboardEvent | MouseEvent): void {
        if (this.stopKeydown() && event instanceof KeyboardEvent) {
            event.stopPropagation();
        } else if (this.stopClick() && event instanceof MouseEvent) {
            event.stopPropagation();
        }
    }
}
