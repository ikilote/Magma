import { Component, computed, input } from '@angular/core';

import { RepeatForPipe } from '../../pipes/repeat-for.pipe';
import { numberAttributeOrUndefined } from '../../utils/coercion';

export type SpinnerType =
    | 'ticks'
    | 'ring'
    | 'arc'
    | 'dots'
    | 'chase'
    | 'bounce'
    | 'wave'
    | 'bar'
    | 'pulse'
    | 'ripple'
    | 'flip'
    | 'orbit'
    | 'grid'
    | 'blink'
    | 'morph'
    | 'comet'
    | 'infinity'
    | 'heartbeat';

@Component({
    selector: 'mg-spinner',
    templateUrl: './spinner.component.html',
    styleUrl: './spinner.component.scss',
    host: {
        '[style.--height.px]': '_resolvedHeight()',
        '[style.--width.px]': '_resolvedWidth()',
        '[style.--radius.px]': 'radius()',
        '[style.--count]': '_resolvedCount()',
        '[style.--orbit-r.px]': 'orbitRadius()',
        '[style.--min-scale]': 'minScale()',
        '[style.--infinity-scale]': '_infinityScale()',
        '[attr.data-type]': 'type()',
    },
    imports: [RepeatForPipe],
})
export class MagmaSpinner {
    // inputs — type ————————————————————————————————————————————

    readonly type = input<SpinnerType>('ticks');

    // inputs — shared ——————————————————————————————————————————

    /** Overall size in px. Applies to all circular/square types. For `bar` use `barWidth` instead. */
    readonly size = input(undefined, { transform: numberAttributeOrUndefined });

    /** Border-radius in px. Used by `ticks` (tick shape) and `bar` (bar container). */
    readonly radius = input(undefined, { transform: numberAttributeOrUndefined });

    // inputs — ticks ———————————————————————————————————————————

    /** Width of each tick in px. Only used by `ticks`. */
    readonly tickWidth = input(undefined, { transform: numberAttributeOrUndefined });

    // inputs — ring / arc ——————————————————————————————————————

    /** Thickness of the ring/arc stroke in px. Used by `ring`, `arc`, `ripple`, `comet` and `heartbeat`. */
    readonly strokeWidth = input(undefined, { transform: numberAttributeOrUndefined });

    // inputs — dots / chase ————————————————————————————————————

    /** Diameter of each dot in px. Used by `dots`, `chase`, `blink` and `infinity`. */
    readonly dotSize = input(undefined, { transform: numberAttributeOrUndefined });

    // inputs — wave / bounce / grid / dots / chase / blink ————

    /** Number of elements. Used by `wave` (bars), `bounce` (balls), `grid` (cells), `dots`, `chase` and `blink` (dots). */
    readonly count = input(undefined, { transform: numberAttributeOrUndefined });

    /** Width of each bar in px. Only used by `wave`. */
    readonly barItemWidth = input(undefined, { transform: numberAttributeOrUndefined });

    // inputs — dots / chase / pulse ————————————————————————————

    /**
     * Minimum scale at the faded end of the animation (0–1).
     * Used by `dots` (default 0.6), `chase` (default 0.5), `pulse` (default 0.2).
     */
    readonly minScale = input(undefined, { transform: numberAttributeOrUndefined });

    // inputs — bar ————————————————————————————————————————————

    /** Width of the bar container in px. Only used by `bar`. */
    readonly barWidth = input(undefined, { transform: numberAttributeOrUndefined });

    /** Height of the bar in px. Only used by `bar`. */
    readonly barHeight = input(undefined, { transform: numberAttributeOrUndefined });

    // inputs — orbit ———————————————————————————————————————————

    /** Radius of the orbit path in px. Only used by `orbit`. */
    readonly orbitRadius = input(undefined, { transform: numberAttributeOrUndefined });

    /** Diameter of the orbiting ball in px. Only used by `orbit`. */
    readonly orbitBallSize = input(undefined, { transform: numberAttributeOrUndefined });

    // internals ———————————————————————————————————————————————

    /** Resolves the CSS `--height` variable based on the active type. */
    protected readonly _resolvedHeight = computed(() => {
        if (this.type() === 'bar') {
            return this.barWidth() ?? this.size();
        }
        return this.size();
    });

    /** Resolves the CSS `--width` variable based on the active type. */
    protected readonly _resolvedWidth = computed(() => {
        switch (this.type()) {
            case 'ring':
            case 'arc':
            case 'ripple':
            case 'comet':
            case 'heartbeat':
                return this.strokeWidth();
            case 'dots':
            case 'chase':
            case 'blink':
            case 'infinity':
                return this.dotSize();
            case 'wave':
                return this.barItemWidth();
            case 'bar':
                return this.barHeight();
            case 'orbit':
                return this.orbitBallSize();
            default:
                return this.tickWidth();
        }
    });

    /** Resolves the CSS `--count` variable for types that use a variable number of elements. */
    protected readonly _resolvedCount = computed(() => this.count() ?? undefined);

    /** Unitless scale factor for the infinity path (--height / 80). Avoids calc(px / px) issues. */
    protected readonly _infinityScale = computed(() => {
        const h = this._resolvedHeight();
        return h != null ? h / 80 : undefined;
    });
}
