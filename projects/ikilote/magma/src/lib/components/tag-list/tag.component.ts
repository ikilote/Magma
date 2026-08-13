import { Component, ElementRef, booleanAttribute, inject, input } from '@angular/core';

@Component({
    selector: 'mg-tag',
    template: '<ng-content />',
    styles: [':host { display: none; }'],
})
export class MagmaTag {
    readonly elementRef = inject(ElementRef);

    /** Value associated with this tag (used in the string[] model) */
    readonly value = input.required<string>();

    /** Whether this tag can be removed. Default: true */
    readonly removable = input(true, { transform: booleanAttribute });
}
