import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { NgTemplateOutlet } from '@angular/common';
import {
    Component,
    OnDestroy,
    TemplateRef,
    ViewContainerRef,
    booleanAttribute,
    computed,
    contentChildren,
    inject,
    input,
    output,
    viewChild,
} from '@angular/core';

import { MagmaTimelineAnnotation } from './timeline-annotation.component';
import { MagmaTimelineItemTooltip } from './timeline-item-tooltip.component';
import { MagmaTimelineItem } from './timeline-item.component';

import { MagmaClickEnterDirective } from '../../directives/click-enter.directive';
import { MagmaDragScrollAxis, MagmaDragScrollDirective } from '../../directives/drag-scroll.directive';
import { numberAttributeOrUndefined } from '../../utils/coercion';
import { isISODate } from '../../utils/date';

export type MagmaTimelineDirection = 'horizontal' | 'vertical';
export type MagmaTimelineUnit = 'year' | 'month' | 'day';
/**
 * Controls how tooltip entries are displayed in horizontal mode.
 * - `grouped` (default): entries stacked vertically in a single panel aligned
 *   to the first mark. Compact and readable.
 * - `spread`: each entry is individually positioned above its corresponding
 *   mark with JS-driven overlap avoidance (push right).
 */
export type MagmaTimelineTooltipLayout = 'grouped' | 'spread';

export interface MagmaTimelineClickEvent {
    /** Label input value (may be undefined if only content is projected) */
    label: string | undefined;
    /** Projected inner HTML content of the item */
    contentHtml: string;
    start: number | string | Date;
    end: number | string | Date | undefined;
    color: string | undefined;
    link: string | undefined;
    /** Original MouseEvent | KeyboardEvent */
    event: MouseEvent | KeyboardEvent;
}
export type MagmaTimelineHoverEvent = MagmaTimelineClickEvent;

export interface MagmaTimelineResolvedItem {
    label: string | undefined;
    /** Inner HTML from projected content, falls back to label input */
    contentHtml: string;
    /** Fractional offset from axis start, in ticks (e.g. 0.70 = 70% into tick 1) */
    startOffset: number;
    /** Fractional length in ticks */
    spanLength: number;
    color: string | undefined;
    link: string | undefined;
    linkTarget: string;
    disabled: boolean;
    /** Resolved tooltip entries for this item. Empty array = no tooltip panel. */
    tooltips: MagmaTimelineResolvedTooltip[];
    /** Column (horizontal) or row (vertical) track index for placement */
    trackIndex: number;
    /** Reference to the original item for click events */
    sourceItem: MagmaTimelineItem;
}

export interface MagmaTimelineResolvedTooltip {
    /** TemplateRef for rich Angular content (reactive, takes priority over contentHtml) */
    templateRef: TemplateRef<unknown> | undefined;
    /** Plain HTML fallback when no templateRef is available */
    contentHtml: string;
    /** Optional date label (formatted string, or undefined) */
    dateLabel: string | undefined;
    /**
     * Fractional position (0–1) of the date within the item's span.
     * Used to position the mark on the bar and the tooltip entry (initial
     * position before JS overlap adjustment). undefined when no date is
     * provided.
     */
    dateOffset: number | undefined;
    /** Optional accent color (falls back to item color) */
    color: string | undefined;
}

export interface MagmaTimelineTick {
    label: string;
    /** Integer tick value (year, month-ordinal, day-ordinal) */
    index: number;
}

export interface MagmaTimelineAnnotationClickEvent {
    /** Label input value (may be undefined if only content is projected) */
    label: string | undefined;
    /** Projected inner HTML content of the annotation */
    contentHtml: string;
    start: number | string | Date;
    color: string | undefined;
    link: string | undefined;
    /** Original MouseEvent */
    event: MouseEvent;
}

export interface MagmaTimelineResolvedAnnotation {
    label: string | undefined;
    /** Inner HTML from projected content, falls back to label input */
    contentHtml: string;
    /** Fractional offset from axis start, in ticks */
    offset: number;
    color: string | undefined;
    link: string | undefined;
    linkTarget: string;
    disabled: boolean;
    /** When true, the flag label does not wrap (white-space: nowrap) */
    nowrap: boolean;
    /** Reference to the original annotation for click events */
    sourceAnnotation: MagmaTimelineAnnotation;
}

@Component({
    selector: 'mg-timeline',
    templateUrl: './timeline.component.html',
    styleUrl: './timeline.component.scss',
    imports: [MagmaDragScrollDirective, MagmaClickEnterDirective, NgTemplateOutlet],
    host: {
        '[class.horizontal]': 'direction() === "horizontal"',
        '[class.vertical]': 'direction() === "vertical"',
        '[class.tooltip-grouped]': 'tooltipLayout() === "grouped"',
        '[class.tooltip-spread]': 'tooltipLayout() === "spread"',
        '[style.--mg-timeline-axis-size]': 'axisSize()',
        '[style.--mg-timeline-track-count]': 'trackCount()',
        '[style.--mg-timeline-tick-count]': 'ticks().length',
        '[style.--mg-timeline-tick-size.px]': 'tickSize() ?? 60',
    },
})
export class MagmaTimeline implements OnDestroy {
    private readonly overlay = inject(Overlay);
    private readonly viewContainerRef = inject(ViewContainerRef);

    /** Template for a single tooltip entry, rendered in individual CDK overlays. */
    protected readonly tooltipEntryTpl = viewChild.required<TemplateRef<unknown>>('tooltipEntryTpl');

    /** Template for the grouped panel (all entries in one card). */
    protected readonly tooltipGroupedTpl = viewChild.required<TemplateRef<unknown>>('tooltipGroupedTpl');

    /** Active CDK overlay refs for the current hovered item — one per tooltip entry. */
    private _entryOverlayRefs: OverlayRef[] = [];

    /** Cleanup function for the scroll listener on .timeline-grid. */
    private _scrollUnlisten?: () => void;

    /**
     * Stored context for scroll-repositioning: pairs of anchor element and
     * overlay ref, plus whether we're in vertical mode.
     */
    private _entryAnchors: { anchor: HTMLElement; overlayRef: OverlayRef }[] = [];
    private _entryIsVertical = false;

    // --- Inputs ---
    /** Layout direction. "horizontal": time flows right, items are rows.
     *  "vertical": time flows down, items are columns. */
    readonly direction = input<MagmaTimelineDirection>('horizontal');

    /** Explicit start of the time axis. Auto-computed from items if omitted. */
    readonly start = input<number | string | Date>();

    /** Explicit end of the time axis. Auto-computed from items if omitted. */
    readonly end = input<number | string | Date>();

    /** Granularity of the time axis ticks. */
    readonly unit = input<MagmaTimelineUnit>('year');

    /** BCP-47 locale tag for tick labels (e.g. 'fr', 'en'). */
    readonly lang = input<string>();

    /** Width (horizontal) or height (vertical) of the label column / row. */
    readonly axisSize = input<string>('80px');

    /** Show axis tick grid lines */
    readonly showGrid = input(true, { transform: booleanAttribute });

    /** Size in px of each tick cell (drives --mg-timeline-tick-size). Default: 60 */
    readonly tickSize = input(undefined, { transform: numberAttributeOrUndefined });

    /**
     * Minimum visual gap in px between two items before they are stacked on a
     * separate track. Items closer than this threshold are treated as overlapping
     * even if their exact positions do not touch.
     * Default: 10
     */
    readonly minGap = input(undefined, { transform: numberAttributeOrUndefined });

    /**
     * Let the user scroll the timeline by grabbing its background and dragging
     * (panning), via the {@link MagmaDragScrollDirective}. The pan axis follows
     * {@link direction} automatically. Default: false.
     */
    readonly dragScroll = input(false, { transform: booleanAttribute });

    /**
     * Controls how tooltip entries are laid out in **horizontal** mode.
     * - `grouped` (default): all entries stacked in a single panel anchored to
     *   the first mark — compact and legible.
     * - `spread`: each entry floats above its own mark; JS adjusts positions to
     *   avoid horizontal overlap.
     * Has no effect in vertical mode (always uses the spread/absolute approach).
     */
    readonly tooltipLayout = input<MagmaTimelineTooltipLayout>('grouped');

    // --- Outputs ---
    /** Emitted when an item bar is mouse over */
    readonly itemHover = output<MagmaTimelineHoverEvent>();

    /** Emitted when an item bar is clicked (not fired if the item has a link). */
    readonly itemClick = output<MagmaTimelineClickEvent>();

    /** Emitted when an annotation is clicked (not fired if the annotation has a link). */
    readonly annotationClick = output<MagmaTimelineAnnotationClickEvent>();

    // --- Content children ---

    readonly items = contentChildren(MagmaTimelineItem);

    readonly annotations = contentChildren(MagmaTimelineAnnotation);

    // --- Computed ---

    /** Pan axis for drag-scroll, derived from the layout direction. */
    protected readonly dragAxis = computed<MagmaDragScrollAxis>(() => (this.direction() === 'vertical' ? 'y' : 'x'));

    protected readonly ticks = computed<MagmaTimelineTick[]>(() => {
        const items = this.items();
        const annotations = this.annotations();
        if (!items.length && !annotations.length) return [];

        const unit = this.unit();
        const axisStart = this.floorToTick(this.resolveExact(this.start()) ?? this.minExactValue(), unit);
        const axisEnd = this.ceilToTick(this.resolveExact(this.end()) ?? this.maxExactValue(), unit);

        return this.buildTicks(axisStart, axisEnd, unit);
    });

    protected readonly resolvedItems = computed<MagmaTimelineResolvedItem[]>(() => {
        const items = this.items();
        const ticks = this.ticks();
        if (!ticks.length || !items.length) return [];

        const firstTick = ticks[0].index;
        const totalTicks = ticks.length;
        const unit = this.unit();

        // Minimum gap in fractional ticks: minGap px / tickSize px
        // (gap is expressed in ticks, same unit as startOffset/endOffset)
        const tickSizePx = this.tickSize() ?? 60;
        const minGapPx = this.minGap() ?? 10;
        const gapFraction = minGapPx / tickSizePx;

        // Pack items into tracks so overlapping items are placed side by side.
        // We use fractional [start, end] for overlap detection.
        const tracks: [number, number][][] = [];

        return items.map(item => {
            const exactStart = this.resolveExact(item.start())!;
            const exactEnd = item.end() !== undefined ? this.resolveExact(item.end()!)! : exactStart;

            const startOffset = this.exactToOffset(exactStart, firstTick, unit);
            const endOffset = this.exactToOffset(exactEnd, firstTick, unit);
            const spanLength = Math.max(1 / totalTicks, endOffset - startOffset);

            // Expand by gapFraction on each side for overlap check only
            const overlapStart = startOffset - gapFraction;
            const overlapEnd = endOffset + gapFraction;

            // Find the first track where this item fits (using fractional overlap + gap)
            let trackIndex = 0;
            for (let t = 0; t < tracks.length; t++) {
                // Each stored slot is already [start - gap, end + gap]
                const occupied = tracks[t].some(([s, e]) => overlapStart < e && overlapEnd > s);
                if (!occupied) {
                    trackIndex = t;
                    tracks[t].push([overlapStart, overlapEnd]);
                    break;
                }
                trackIndex = t + 1;
            }
            if (trackIndex === tracks.length) {
                tracks.push([[overlapStart, overlapEnd]]);
            }

            return {
                label: item.label(),
                contentHtml: this.extractItemContentHtml(item),
                startOffset,
                spanLength,
                color: item.color(),
                link: item.link(),
                linkTarget: item.linkTarget(),
                disabled: item.disabled(),
                tooltips: this.resolveItemTooltips(item, exactStart, exactEnd),
                trackIndex,
                sourceItem: item,
            };
        });
    });

    protected readonly trackCount = computed(() => {
        const items = this.resolvedItems();
        if (!items.length) return 1;
        return Math.max(...items.map(i => i.trackIndex)) + 1;
    });

    protected readonly resolvedAnnotations = computed<MagmaTimelineResolvedAnnotation[]>(() => {
        const annotations = this.annotations();
        const ticks = this.ticks();
        if (!ticks.length || !annotations.length) return [];

        const firstTick = ticks[0].index;
        const lastTick = ticks[ticks.length - 1].index + 1; // end of last tick cell
        const unit = this.unit();

        return annotations.map(ann => {
            const exactStart = this.resolveExact(ann.start())!;
            // Clamp to axis bounds so annotations outside [start,end] stay visible
            const clampedExact = Math.max(firstTick, Math.min(lastTick, exactStart));
            const offset = this.exactToOffset(clampedExact, firstTick, unit);

            return {
                label: ann.label(),
                contentHtml: ann.elementRef.nativeElement.innerHTML?.trim() || ann.label() || '',
                offset,
                color: ann.color(),
                link: ann.link(),
                linkTarget: ann.linkTarget(),
                disabled: ann.disabled(),
                nowrap: ann.nowrap(),
                sourceAnnotation: ann,
            };
        });
    });

    // ─── Event handlers ───────────────────────────────────────────────────────

    protected onItemHover(item: MagmaTimelineResolvedItem, event: MouseEvent): void {
        if (!item.tooltips.length) return;

        const itemEl = (event.target as HTMLElement).closest('.item') as HTMLElement;
        if (!itemEl) return;

        this._closeEntryOverlays();
        this._openEntryOverlays(item, itemEl);

        if (item.link && !item.disabled) return;
        this.itemHover.emit({
            label: item.label,
            contentHtml: item.contentHtml,
            start: item.sourceItem.start(),
            end: item.sourceItem.end(),
            color: item.color,
            link: item.link,
            event,
        });
    }

    protected onItemLeave(_event: MouseEvent): void {
        this._closeEntryOverlays();
    }

    ngOnDestroy(): void {
        this._closeEntryOverlays();
    }

    protected onItemClick(item: MagmaTimelineResolvedItem, event: MouseEvent | KeyboardEvent): void {
        if (item.link && !item.disabled) return;
        this.itemClick.emit({
            label: item.label,
            contentHtml: item.contentHtml,
            start: item.sourceItem.start(),
            end: item.sourceItem.end(),
            color: item.color,
            link: item.link,
            event,
        });
    }

    protected onAnnotationClick(annotation: MagmaTimelineResolvedAnnotation, event: MouseEvent): void {
        if (annotation.link && !annotation.disabled) return;
        this.annotationClick.emit({
            label: annotation.label,
            contentHtml: annotation.contentHtml,
            start: annotation.sourceAnnotation.start(),
            color: annotation.color,
            link: annotation.link,
            event,
        });
    }

    // ─── Private helpers ──────────────────────────────────────────────────────

    private _closeEntryOverlays(): void {
        this._entryOverlayRefs.forEach(r => r.dispose());
        this._entryOverlayRefs = [];
        this._entryAnchors = [];
        // Remove the scroll listener
        this._scrollUnlisten?.();
        this._scrollUnlisten = undefined;
    }

    /**
     * Open one CDK overlay per tooltip entry, each anchored to a zero-size
     * point at the entry's mark position on the bar edge.
     *
     * Algorithm:
     * 1. Compute each entry's ideal anchor point (mark position on bar edge)
     * 2. Skip entries whose mark is outside the scrollable viewport
     * 3. Open overlays sorted by mark position; after rendering, push any
     *    overlapping entries away from their ideal position
     */
    private _openEntryOverlays(item: MagmaTimelineResolvedItem, itemEl: HTMLElement): void {
        const isVertical = this.direction() === 'vertical';
        const isGrouped = !isVertical && this.tooltipLayout() === 'grouped';
        const barGap = parseFloat(getComputedStyle(itemEl).padding) || 2;
        const itemRect = itemEl.getBoundingClientRect();

        // The scrollable container is the .timeline-grid parent
        const gridEl = itemEl.closest('.timeline-grid') as HTMLElement | null;
        const gridRect = gridEl?.getBoundingClientRect();

        if (isGrouped) {
            // Grouped mode: single overlay anchored on the first dated mark (or bar start)
            const firstDated = item.tooltips.find(t => t.dateOffset !== undefined);
            const markFraction = firstDated?.dateOffset ?? 0;
            const innerW = itemRect.width - 2 * barGap;
            const markLeft = barGap + markFraction * innerW;

            // Skip if the mark is outside the visible grid
            const markViewportX = itemRect.left + markLeft;
            if (gridRect && (markViewportX < gridRect.left || markViewportX > gridRect.right)) return;

            const anchor = document.createElement('div');
            Object.assign(anchor.style, {
                position: 'absolute',
                insetBlockStart: `${barGap}px`,
                insetInlineStart: `${markLeft}px`,
                width: '0',
                height: '0',
                pointerEvents: 'none',
            });
            itemEl.appendChild(anchor);

            const overlayRef = this.overlay.create({
                panelClass: 'mg-timeline-tooltip-overlay',
                scrollStrategy: this.overlay.scrollStrategies.reposition(),
                positionStrategy: this.overlay
                    .position()
                    .flexibleConnectedTo(anchor)
                    .withPositions([
                        { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -4 },
                        { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 4 },
                    ])
                    .withPush(true)
                    .withViewportMargin(8),
            });

            overlayRef.detachments().subscribe(() => anchor.remove());
            const portal = new TemplatePortal(this.tooltipGroupedTpl(), this.viewContainerRef, { item });
            overlayRef.attach(portal);
            this._entryOverlayRefs.push(overlayRef);

            if (gridEl) {
                const onScroll = () => overlayRef.updatePosition();
                gridEl.addEventListener('scroll', onScroll, { passive: true });
                this._scrollUnlisten = () => gridEl.removeEventListener('scroll', onScroll);
            }
            return;
        }

        // Compute anchor positions (px from bar edge origin) for each entry
        type EntryInfo = {
            tip: (typeof item.tooltips)[number];
            anchorPx: number; // position along the bar axis (H: x, V: y) in viewport px
            anchor: HTMLElement;
            overlayRef?: OverlayRef;
        };

        const entries: EntryInfo[] = item.tooltips.map(tip => {
            const fraction = tip.dateOffset ?? 0;
            if (isVertical) {
                const innerH = itemRect.height - 2 * barGap;
                const anchorPx = itemRect.top + barGap + fraction * innerH;
                return { tip, anchorPx, anchor: document.createElement('div') };
            } else {
                const innerW = itemRect.width - 2 * barGap;
                const anchorPx = itemRect.left + barGap + fraction * innerW;
                return { tip, anchorPx, anchor: document.createElement('div') };
            }
        });

        // Filter out entries whose mark is outside the visible grid area
        const visible = gridRect
            ? entries.filter(e => {
                  if (isVertical) {
                      return e.anchorPx >= gridRect.top && e.anchorPx <= gridRect.bottom;
                  } else {
                      return e.anchorPx >= gridRect.left && e.anchorPx <= gridRect.right;
                  }
              })
            : entries;

        if (!visible.length) return;

        // Sort entries by mark position (top-to-bottom or left-to-right)
        visible.sort((a, b) => a.anchorPx - b.anchorPx);

        // Open each overlay, with the anchor as a zero-size element at the mark
        for (const entry of visible) {
            const { tip, anchor } = entry;

            Object.assign(anchor.style, {
                position: 'absolute',
                pointerEvents: 'none',
            });

            if (isVertical) {
                const fraction = tip.dateOffset ?? 0;
                const innerH = itemRect.height - 2 * barGap;
                const top = barGap + fraction * innerH;
                Object.assign(anchor.style, {
                    insetBlockStart: `${top}px`,
                    insetInlineEnd: '0',
                    width: '0',
                    height: '0',
                });
                entry.overlayRef = this.overlay.create({
                    panelClass: 'mg-timeline-tooltip-overlay',
                    scrollStrategy: this.overlay.scrollStrategies.reposition(),
                    positionStrategy: this.overlay
                        .position()
                        .flexibleConnectedTo(anchor)
                        .withPositions([
                            // Prefer right, centred vertically on the mark
                            { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 8 },
                            { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -8 },
                        ])
                        .withPush(true)
                        .withViewportMargin(8),
                });
            } else {
                const fraction = tip.dateOffset ?? 0;
                const innerW = itemRect.width - 2 * barGap;
                const left = barGap + fraction * innerW;
                Object.assign(anchor.style, {
                    insetBlockStart: `${barGap}px`,
                    insetInlineStart: `${left}px`,
                    width: '0',
                    height: '0',
                });
                entry.overlayRef = this.overlay.create({
                    panelClass: 'mg-timeline-tooltip-overlay',
                    scrollStrategy: this.overlay.scrollStrategies.reposition(),
                    positionStrategy: this.overlay
                        .position()
                        .flexibleConnectedTo(anchor)
                        .withPositions([
                            // Prefer above, centred on the mark
                            {
                                originX: 'center',
                                originY: 'top',
                                overlayX: 'center',
                                overlayY: 'bottom',
                                offsetY: -4,
                            },
                            // Fallback: below
                            {
                                originX: 'center',
                                originY: 'bottom',
                                overlayX: 'center',
                                overlayY: 'top',
                                offsetY: 4,
                            },
                        ])
                        .withPush(true)
                        .withViewportMargin(8),
                });
            }

            itemEl.appendChild(anchor);
            entry.overlayRef.detachments().subscribe(() => anchor.remove());

            const portal = new TemplatePortal(this.tooltipEntryTpl(), this.viewContainerRef, {
                tip,
                item,
            });
            entry.overlayRef.attach(portal);
            this._entryOverlayRefs.push(entry.overlayRef);
            this._entryAnchors.push({ anchor, overlayRef: entry.overlayRef });
        }

        this._entryIsVertical = isVertical;

        // After rendering, push overlapping entries away from each other
        // using requestAnimationFrame so entries have their final sizes
        if (visible.length > 1) {
            requestAnimationFrame(() => this._pushOverlappingEntries(isVertical));
        }

        // Listen to the timeline-grid scroll: reposition CDK overlays,
        // show/hide entries whose mark exits/enters the viewport, then
        // recalculate overlap push.
        if (gridEl && this._entryOverlayRefs.length) {
            const gridRect = gridEl.getBoundingClientRect();

            const onScroll = () => {
                const currentGridRect = gridEl.getBoundingClientRect();

                // 1. Show/hide each overlay based on anchor visibility
                this._entryAnchors.forEach(({ anchor, overlayRef }) => {
                    const anchorRect = anchor.getBoundingClientRect();
                    const anchorPos = isVertical ? anchorRect.top : anchorRect.left;
                    const gridStart = isVertical ? currentGridRect.top : currentGridRect.left;
                    const gridEnd = isVertical ? currentGridRect.bottom : currentGridRect.right;
                    const isVisible = anchorPos >= gridStart && anchorPos <= gridEnd;
                    (overlayRef.overlayElement as HTMLElement).style.visibility = isVisible ? '' : 'hidden';
                });

                // 2. Reset transforms so CDK can measure natural positions
                this._entryAnchors.forEach(({ overlayRef }) => {
                    (overlayRef.overlayElement as HTMLElement).style.transform = '';
                });

                // 3. Let CDK reposition from the updated anchor positions
                this._entryOverlayRefs.forEach(r => r.updatePosition());

                // 4. Recalculate overlap push from new anchor viewport positions
                requestAnimationFrame(() => this._pushOverlappingEntries(this._entryIsVertical));
            };
            gridEl.addEventListener('scroll', onScroll, { passive: true });
            this._scrollUnlisten = () => gridEl.removeEventListener('scroll', onScroll);
        }
    }

    /**
     * After all overlays are rendered (or after a scroll), detect overlapping
     * entries and push them away from their ideal position along the bar axis.
     * anchorPx is recalculated from the current anchor viewport position so
     * the push is correct after the grid has scrolled.
     */
    private _pushOverlappingEntries(isVertical: boolean): void {
        if (this._entryAnchors.length < 2) return;

        const minGap = 4;

        // Read current anchor positions from the DOM
        const positioned = this._entryAnchors
            .map(({ anchor, overlayRef }) => {
                const anchorRect = anchor.getBoundingClientRect();
                const anchorPx = isVertical ? anchorRect.top : anchorRect.left;
                const el = overlayRef.overlayElement as HTMLElement;
                const size = isVertical ? el.offsetHeight : el.offsetWidth;
                return { el, anchorPx, size };
            })
            .filter(e => e.size > 0)
            .sort((a, b) => a.anchorPx - b.anchorPx);

        let prevEdge = -Infinity;

        for (const entry of positioned) {
            const halfSize = entry.size / 2;
            const idealCenter = entry.anchorPx;
            const minCenter = prevEdge + minGap + halfSize;
            const actualCenter = Math.max(idealCenter, minCenter);

            const delta = actualCenter - idealCenter;
            entry.el.style.transform =
                delta !== 0 ? (isVertical ? `translateY(${delta}px)` : `translateX(${delta}px)`) : '';

            prevEdge = actualCenter + halfSize;
        }
    }

    /**
     * Resolve any input value to a precise floating-point position on the axis.
     * - Date object or ISO string → fractional year/month/day via dateToExact()
     * - Plain number or numeric string → returned as-is
     *
     * Examples with unit="year":
     *   '2008-09-12' → 2008 + (day-of-year / 365) ≈ 2008.703
     *   2008          → 2008
     */
    private resolveExact(value: number | string | Date | undefined): number | undefined {
        if (value === undefined || value === null) return undefined;

        // Date object
        if (value instanceof Date) {
            return isNaN(value.getTime()) ? undefined : this.dateToExact(value, this.unit());
        }

        // ISO date string (YYYY-MM-DD or full ISO 8601) → parse to Date
        if (typeof value === 'string' && isISODate(value)) {
            const d = new Date(value);
            return isNaN(d.getTime()) ? undefined : this.dateToExact(d, this.unit());
        }

        // Plain number or numeric string
        return Number(value);
    }

    private dateToExact(date: Date, unit: MagmaTimelineUnit): number {
        switch (unit) {
            case 'year': {
                const year = date.getFullYear();
                const startOfYear = new Date(year, 0, 1).getTime();
                const startOfNextYear = new Date(year + 1, 0, 1).getTime();
                const frac = (date.getTime() - startOfYear) / (startOfNextYear - startOfYear);
                return year + frac;
            }
            case 'month': {
                const year = date.getFullYear();
                const month = date.getMonth();
                const ordinal = year * 12 + month;
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const frac = (date.getDate() - 1) / daysInMonth;
                return ordinal + frac;
            }
            case 'day':
                return Math.floor(date.getTime() / 86400000);
        }
    }
    /** Floor a float position to the integer tick it belongs to */
    private floorToTick(exact: number, _unit: MagmaTimelineUnit): number {
        return Math.floor(exact);
    }
    /** Ceil a float position to the integer tick it ends on */
    private ceilToTick(exact: number, _unit: MagmaTimelineUnit): number {
        return Math.ceil(exact);
    }
    /**
     * Convert an exact floating-point axis position to a fractional offset
     * relative to the first tick (in number of ticks from the axis start).
     */
    private exactToOffset(exact: number, firstTick: number, _unit: MagmaTimelineUnit): number {
        return exact - firstTick;
    }

    private extractItemContentHtml(item: MagmaTimelineItem): string {
        const el: HTMLElement = item.elementRef.nativeElement;
        // Clone the host element so we can strip tooltip children without mutating the DOM
        const clone = el.cloneNode(true) as HTMLElement;
        clone.querySelectorAll('mg-timeline-item-tooltip').forEach(n => n.remove());
        return clone.innerHTML.trim() || item.label() || '';
    }

    private resolveItemTooltips(
        item: MagmaTimelineItem,
        itemExactStart: number,
        itemExactEnd: number,
    ): MagmaTimelineResolvedTooltip[] {
        const itemSpan = itemExactEnd - itemExactStart || 1;
        return item.tooltips().map((t: MagmaTimelineItemTooltip) => {
            const dateVal = t.date();
            let dateOffset: number | undefined;
            if (dateVal !== undefined) {
                const exact = this.resolveExact(dateVal);
                if (exact !== undefined) {
                    dateOffset = Math.min(1, Math.max(0, (exact - itemExactStart) / itemSpan));
                }
            }
            return {
                templateRef: t.templateRef() as TemplateRef<unknown> | undefined,
                contentHtml: t.content() ?? t.elementRef.nativeElement.innerHTML?.trim() ?? '',
                dateLabel: dateVal !== undefined ? this.formatTooltipDate(dateVal) : undefined,
                dateOffset,
                color: t.color(),
            };
        });
    }

    private formatTooltipDate(value: number | string | Date): string {
        const lang = this.lang() || undefined;
        const unit = this.unit();
        let date: Date;
        if (value instanceof Date) {
            date = value;
        } else if (typeof value === 'string' && isISODate(value)) {
            date = new Date(value);
        } else {
            // plain year number
            date = new Date(Number(value), 0, 1);
        }
        if (isNaN(date.getTime())) return String(value);
        switch (unit) {
            case 'year':
                return date.toLocaleString(lang, { year: 'numeric' });
            case 'month':
                return date.toLocaleString(lang, { month: 'long', year: 'numeric' });
            case 'day':
            default:
                return date.toLocaleString(lang, { day: '2-digit', month: 'long', year: 'numeric' });
        }
    }

    private minExactValue(): number {
        const items = this.items();
        const annotations = this.annotations();
        const vals = [
            ...items.map(i => this.resolveExact(i.start()) ?? Infinity),
            ...annotations.map(a => this.resolveExact(a.start()) ?? Infinity),
        ];
        return vals.length ? Math.min(...vals) : Infinity;
    }

    private maxExactValue(): number {
        const items = this.items();
        const annotations = this.annotations();
        const vals = [
            ...items.map(i => {
                const e = i.end();
                return this.resolveExact(e !== undefined ? e : i.start()) ?? -Infinity;
            }),
            ...annotations.map(a => this.resolveExact(a.start()) ?? -Infinity),
        ];
        return vals.length ? Math.max(...vals) : -Infinity;
    }

    private buildTicks(start: number, end: number, unit: MagmaTimelineUnit): MagmaTimelineTick[] {
        const ticks: MagmaTimelineTick[] = [];
        for (let v = start; v <= end; v++) {
            ticks.push({ label: this.tickLabel(v, unit), index: v });
        }
        return ticks;
    }

    private tickLabel(value: number, unit: MagmaTimelineUnit): string {
        const lang = this.lang() || undefined;
        switch (unit) {
            case 'year':
                const d = new Date(value, 0, 1);
                return d.toLocaleString(lang, { year: 'numeric' });
            case 'month': {
                const year = Math.floor(value / 12);
                const month = value % 12;
                const d = new Date(year, month, 1);
                return d.toLocaleString(lang, { month: 'short', year: '2-digit' });
            }
            case 'day': {
                const d = new Date(value * 86400000);
                return d.toLocaleString(lang, { day: '2-digit', month: 'short' });
            }
        }
    }
}
