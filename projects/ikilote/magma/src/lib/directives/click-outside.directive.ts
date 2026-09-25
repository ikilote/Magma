import { Directive, ElementRef, HostListener, inject, output } from '@angular/core';

import { deepContains } from '../utils/dom';

@Directive({
    selector: '[clickOutside]',
})
export class MagmaClickOutsideDirective {
    readonly clickOutside = output<Event>();

    private readonly elementRef = inject(ElementRef);

    @HostListener('window:click', ['$event'])
    onClick(event: Event) {
        const clickedInside = deepContains(this.elementRef.nativeElement, event.target as Element);
        if (!clickedInside) {
            this.clickOutside.emit(event);
        }
    }

    @HostListener('window:dialog-click', ['$event'])
    dialogClick(event: Event) {
        this.onClick((event as CustomEvent<Event>).detail);
    }
}
