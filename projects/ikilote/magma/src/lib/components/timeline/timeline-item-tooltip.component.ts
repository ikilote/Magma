import { Component, ElementRef, TemplateRef, contentChild, inject, input } from '@angular/core';

@Component({
    selector: 'mg-timeline-item-tooltip',
    template: `<ng-content />`,
    styles: [':host { display: none; }'],
})
export class MagmaTimelineItemTooltip {
    readonly elementRef = inject(ElementRef);

    /**
     * Optional date/time position within the item's range.
     * Displayed as a header in the tooltip panel.
     * Accepts a year number, an ISO date string, or a Date object.
     */
    readonly date = input<number | string | Date>();

    /** CSS color for the tooltip header accent. Defaults to the parent item color. */
    readonly color = input<string>();

    /**
     * Optional TemplateRef for the tooltip body.
     * Project an <ng-template> inside mg-timeline-item-tooltip to use rich Angular
     * content (components, pipes, bindings) instead of a plain string.
     * When present, takes priority over the `content` string input.
     *
     * @example
     * <mg-timeline-item-tooltip date="2015-06-01">
     *   <ng-template>
     *     <strong>{{ mySignal() }}</strong> — fully reactive
     *   </ng-template>
     * </mg-timeline-item-tooltip>
     */
    readonly templateRef = contentChild(TemplateRef);

    /**
     * Plain-text / HTML string fallback when no ng-template is projected.
     * Reactive: changing this input re-triggers the parent computed.
     */
    readonly content = input<string>();
}
