import { Component, ElementRef, booleanAttribute, inject, input } from '@angular/core';

@Component({
    selector: 'mg-timeline-item',
    template: `<ng-content />`,
    styles: [':host { display: none; }'],
})
export class MagmaTimelineItem {
    readonly elementRef = inject(ElementRef);

    /** Fallback label when no content is projected. If content is projected, it takes priority. */
    readonly label = input<string>();

    /** Start of the item on the time axis (number = year, or ISO date string) */
    readonly start = input.required<number | string | Date>();

    /** End of the item on the time axis. If omitted, item spans one tick. */
    readonly end = input<number | string | Date>();

    /** CSS color for the bar / marker */
    readonly color = input<string>();

    /** Optional URL — wraps the bar in an anchor */
    readonly link = input<string>();

    /** Open link in a new tab */
    readonly linkTarget = input<string>('_self');

    /** Whether the item is disabled (no link interaction) */
    readonly disabled = input(false, { transform: booleanAttribute });
}
