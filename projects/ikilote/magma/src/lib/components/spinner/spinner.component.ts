import { Component, computed, input } from '@angular/core';

import { RepeatForPipe } from '../../pipes/repeat-for.pipe';
import { numberAttributeOrUndefined } from '../../utils/coercion';

export type SpinnerType = 'ticks' | 'ring' | 'dots' | 'bar' | 'pulse';

@Component({
    selector: 'mg-spinner',
    templateUrl: './spinner.component.html',
    styleUrl: './spinner.component.scss',
    host: {
        '[style.--height.px]': '_resolvedHeight()',
        '[style.--width.px]': '_resolvedWidth()',
        '[style.--radius.px]': 'radius()',
        '[attr.data-type]': 'type()',
    },
    imports: [RepeatForPipe],
})
export class MagmaSpinner {
    // inputs — type ————————————————————————————————————————————

    readonly type = input<SpinnerType>('ticks');

    // inputs — shared ——————————————————————————————————————————

    /** Overall size in px. Applies to all types except `bar` (use `barWidth` instead). */
    readonly size = input(undefined, { transform: numberAttributeOrUndefined });

    // inputs — ticks ———————————————————————————————————————————

    /** Width of each tick in px. Only used by `ticks`. */
    readonly tickWidth = input(undefined, { transform: numberAttributeOrUndefined });

    /** Border-radius in px. Used by `ticks` (tick shape) and `bar` (bar container). */
    readonly radius = input(undefined, { transform: numberAttributeOrUndefined });

    // inputs — ring ————————————————————————————————————————————

    /** Thickness of the ring stroke in px. Only used by `ring`. */
    readonly strokeWidth = input(undefined, { transform: numberAttributeOrUndefined });

    // inputs — dots

    /** Diameter of each dot in px. Only used by `dots`. */
    readonly dotSize = input(undefined, { transform: numberAttributeOrUndefined });

    // inputs — bar ————————————————————————————————————————————

    /** Width of the bar container in px. Only used by `bar`. */
    readonly barWidth = input(undefined, { transform: numberAttributeOrUndefined });

    /** Height of the bar in px. Only used by `bar`. */
    readonly barHeight = input(undefined, { transform: numberAttributeOrUndefined });

    // internals ———————————————————————————————————————————————

    /** Resolves the CSS `--height` variable based on the active type. */
    protected readonly _resolvedHeight = computed(() => {
        const t = this.type();
        if (t === 'bar') {
            return this.barWidth() ?? this.size();
        }
        return this.size();
    });

    /** Resolves the CSS `--width` variable based on the active type. */
    protected readonly _resolvedWidth = computed(() => {
        switch (this.type()) {
            case 'ring':
                return this.strokeWidth();
            case 'dots':
                return this.dotSize();
            case 'bar':
                return this.barHeight();
            default:
                return this.tickWidth();
        }
    });
}
