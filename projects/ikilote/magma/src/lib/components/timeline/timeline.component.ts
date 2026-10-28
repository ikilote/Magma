import { Component, booleanAttribute, computed, contentChildren, input, output } from '@angular/core';

import { MagmaTimelineItem } from './timeline-item.component';

import { MagmaDragScrollAxis, MagmaDragScrollDirective } from '../../directives/drag-scroll.directive';
import { numberAttributeOrUndefined } from '../../utils/coercion';
import { isISODate } from '../../utils/date';

export type MagmaTimelineDirection = 'horizontal' | 'vertical';
export type MagmaTimelineUnit = 'year' | 'month' | 'day';

export interface MagmaTimelineClickEvent {
    /** Label input value (may be undefined if only content is projected) */
    label: string | undefined;
    /** Projected inner HTML content of the item */
    contentHtml: string;
    start: number | string | Date;
    end: number | string | Date | undefined;
    color: string | undefined;
    link: string | undefined;
    /** Original MouseEvent */
    event: MouseEvent;
}

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
    /** Column (horizontal) or row (vertical) track index for placement */
    trackIndex: number;
    /** Reference to the original item for click events */
    sourceItem: MagmaTimelineItem;
}

export interface MagmaTimelineTick {
    label: string;
    /** Integer tick value (year, month-ordinal, day-ordinal) */
    index: number;
}

@Component({
    selector: 'mg-timeline',
    templateUrl: './timeline.component.html',
    styleUrl: './timeline.component.scss',
    imports: [MagmaDragScrollDirective],
    host: {
        '[class.horizontal]': 'direction() === "horizontal"',
        '[class.vertical]': 'direction() === "vertical"',
        '[style.--mg-timeline-axis-size]': 'axisSize()',
        '[style.--mg-timeline-track-count]': 'trackCount()',
        '[style.--mg-timeline-tick-count]': 'ticks().length',
        '[style.--mg-timeline-tick-size.px]': 'tickSize() ?? 60',
    },
})
export class MagmaTimeline {
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

    // --- Outputs ---

    /** Emitted when an item bar is clicked (not fired if the item has a link). */
    readonly itemClick = output<MagmaTimelineClickEvent>();

    // --- Content children ---

    readonly items = contentChildren(MagmaTimelineItem);

    // --- Computed ---

    /** Pan axis for drag-scroll, derived from the layout direction. */
    protected readonly dragAxis = computed<MagmaDragScrollAxis>(() => (this.direction() === 'vertical' ? 'y' : 'x'));

    protected readonly ticks = computed<MagmaTimelineTick[]>(() => {
        const items = this.items();
        if (!items.length) return [];

        const unit = this.unit();
        const axisStart = this.floorToTick(this.resolveExact(this.start()) ?? this.minExact(items), unit);
        const axisEnd = this.ceilToTick(this.resolveExact(this.end()) ?? this.maxExact(items), unit);

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
                contentHtml: item.elementRef.nativeElement.innerHTML?.trim() || item.label() || '',
                startOffset,
                spanLength,
                color: item.color(),
                link: item.link(),
                linkTarget: item.linkTarget(),
                disabled: item.disabled(),
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

    // ─── Event handlers ───────────────────────────────────────────────────────

    protected onItemClick(item: MagmaTimelineResolvedItem, event: MouseEvent): void {
        // Don't emit if item has a link — the <a> handles navigation
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

    // ─── Private helpers ──────────────────────────────────────────────────────

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

    private minExact(items: readonly MagmaTimelineItem[]): number {
        return Math.min(...items.map(i => this.resolveExact(i.start()) ?? Infinity));
    }

    private maxExact(items: readonly MagmaTimelineItem[]): number {
        return Math.max(
            ...items.map(i => {
                const e = i.end();
                return this.resolveExact(e !== undefined ? e : i.start()) ?? -Infinity;
            }),
        );
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
