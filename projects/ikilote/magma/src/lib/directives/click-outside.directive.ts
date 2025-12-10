import { Directive, ElementRef, HostListener, inject, output } from '@angular/core';

@Directive({
    selector: '[clickOutside]',
})
export class MagmaClickOutsideDirective {
    readonly clickOutside = output();

    private readonly elementRef = inject(ElementRef);

    @HostListener('window:click', ['$event'])
    onClick(event: Event) {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.clickOutside.emit();
        }
    }

    @HostListener('window:dialog-click', ['$event'])
    dialogClick(event: Event) {
        this.onClick((event as CustomEvent<Event>).detail);
    }
}
