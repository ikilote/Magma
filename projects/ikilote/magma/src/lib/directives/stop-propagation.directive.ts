import { Directive, HostListener, booleanAttribute, input } from '@angular/core';

@Directive({
    selector: '[stop-propagation]',
})
export class MagmaStopPropagationDirective {
    /** stopPropagation for keyboard */
    readonly stopKeydown = input(false, { transform: booleanAttribute });

    @HostListener('keydown', ['$event'])
    block(event: KeyboardEvent): void {
        if (this.stopKeydown()) {
            event.stopPropagation();
        }
    }
}
