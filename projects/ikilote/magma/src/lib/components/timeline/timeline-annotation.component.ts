import { Component, ElementRef, booleanAttribute, inject, input } from '@angular/core';

@Component({
    selector: 'mg-timeline-annotation',
    template: `<ng-content />`,
    styles: [':host { display: none; }'],
})
export class MagmaTimelineAnnotation {
    readonly elementRef = inject(ElementRef);

    /** Fallback label when no content is projected. If content is projected, it takes priority. */
    readonly label = input<string>();

    /** Position of the annotation on the time axis (number = year, or ISO date string) */
    readonly start = input.required<number | string | Date>();

    /** CSS color for the annotation line / marker */
    readonly color = input<string>();

    /** Optional URL — wraps the annotation label in an anchor */
    readonly link = input<string>();

    /** Open link in a new tab */
    readonly linkTarget = input<string>('_self');

    /** Whether the annotation is disabled (no link interaction) */
    readonly disabled = input(false, { transform: booleanAttribute });

    /** When true the flag label is kept on a single line (white-space: nowrap).
     *  Set to false to allow the text to wrap inside the available flag width. */
    readonly nowrap = input(false, { transform: booleanAttribute });
}
