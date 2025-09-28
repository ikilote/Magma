import { Pipe, PipeTransform } from '@angular/core';

import { NumFormatter } from '@ikilote/num-formatter';

/**
 * Format number to string
 *
 * Usage:
 * - `{{ 1000 | numFormat }}` → ` 1,000 `
 * - `{{ 1000 | numFormat:'#,##0.00' }}`  → ` 1,000.00 `
 */
@Pipe({
    name: 'numFormat',
})
export class NumFormatPipe implements PipeTransform {
    static lang = 'en';

    /**
     * format number to string
     * @param value
     * @param params 2 cases:
     * * params is `string`: use `@ikilote/num-formatter` pattern
     * * params is `Intl.NumberFormatOptions`: use `Intl.NumberFormat`
     * @param lang language (default: 'en')
     * @returns string of the number
     * @see https://git.ikilote.net/typescript/number-formatter/
     * @see https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    transform(value: number, params?: Intl.NumberFormatOptions | string | undefined, lang?: string): string {
        const empty = `${value}`;
        if (empty === '' || empty === 'undefined' || empty === 'null' || empty === 'NaN') {
            return '';
        } else if (typeof params === 'string') {
            return new NumFormatter(value).formatByPattern(params);
        } else {
            return new Intl.NumberFormat(
                lang || NumFormatPipe.lang || 'en',
                typeof params === 'object' ? params : {},
            ).format(value);
        }
    }
}
