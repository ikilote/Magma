import { Component, computed, input } from '@angular/core';

import { NumFormatter } from '@ikilote/num-formatter';

import { FileSizePipe, FileSizePipeParams } from '../../pipes/file-size.pipe';
import { numberAttributeOrUndefined } from '../../utils/coercion';

export type ProgressDisplayFormat = 'size' | 'percent' | 'raw';

/**
 * Loader with message and/or progress bar
 */
@Component({
    selector: 'mg-progress',
    templateUrl: './progress.component.html',
    styleUrl: './progress.component.scss',
    imports: [FileSizePipe],
})
export class MagmaProgress {
    // input

    readonly loaded = input(undefined, { transform: numberAttributeOrUndefined });
    readonly total = input(undefined, { transform: numberAttributeOrUndefined });

    /** Display format for the progress text.
     * - `'size'` (default): formats as file size via FileSizePipe (e.g. `3.2 MiB / 10 MiB`)
     * - `'percent'`: shows percentage of loaded/total (e.g. `32 %`)
     * - `'raw'`: shows raw numbers with an optional `unit` suffix (e.g. `32 / 100 items`)
     */
    readonly displayFormat = input<ProgressDisplayFormat>('size');

    /** Unit label used when `displayFormat` is `'raw'` (e.g. `'items'`, `'étapes'`). */
    readonly unit = input<string>('');

    /** Options forwarded to FileSizePipe when `displayFormat` is `'size'`. */
    readonly sizeFormat = input<FileSizePipeParams>();

    /** Number pattern used by NumFormatter when `displayFormat` is `'percent'` or `'raw'`
     * (e.g. `'#,###'`, `'#,###.00'`, `'00.00'`). Default: `'#,###'`.
     */
    readonly numberFormatPattern = input<string>('#,###');

    /** Decimal separator symbol used when `displayFormat` is `'percent'` or `'raw'`.
     * Empty string keeps the NumFormatter default (`'.'`).
     */
    readonly numberFormatDecimalSymbol = input<string>('');

    /** Grouping (thousands) separator symbol used when `displayFormat` is `'percent'` or `'raw'`
     * (e.g. `'\u00A0'` to display `1\u00A0000`). Empty string means no grouping separator.
     */
    readonly numberFormatSeparator = input<string>('');

    /** Computed percentage string, used when `displayFormat` is `'percent'`. */
    readonly percentLabel = computed(() => {
        const loaded = this.loaded();
        const total = this.total();
        if (loaded === undefined || !total || total <= 0) return undefined;
        const pct = (loaded / total) * 100;
        return `${this.formatNumber(pct)}\u00A0%`;
    });

    /** Computed raw text label, used when `displayFormat` is `'raw'`. */
    readonly rawLabel = computed(() => {
        const loaded = this.loaded();
        const total = this.total();
        const unit = this.unit();
        const suffix = unit ? `\u00A0${unit}` : '';
        if (loaded === undefined && (!total || total <= 0)) return '';
        if (loaded !== undefined && total && total > 0) {
            return `${this.formatNumber(loaded)} / ${this.formatNumber(total)}${suffix}`;
        }
        if (loaded !== undefined) return `${this.formatNumber(loaded)}${suffix}`;
        return `${this.formatNumber(total!)}${suffix}`;
    });

    private formatNumber(value: number): string {
        return new NumFormatter(value).formatByPattern(this.numberFormatPattern(), {
            dot: this.numberFormatDecimalSymbol() || undefined,
            separator: this.numberFormatSeparator() || undefined,
        });
    }
}
