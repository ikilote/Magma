import { Pipe, PipeTransform } from '@angular/core';

import { NumFormatter } from '@ikilote/num-formatter';

/**
 * Format number to string
 *
 * Usage:
 * - `{{ 1000 | numFormat }}` → ` 1,000 `
 * - `Intl.NumberFormatOptions`
 *   - `{{ 1000 | numFormat:{style: "currency", currency: "USD"} }}`  → ` $1,000.00 `
 * - `@ikilote/num-formatter`
 *   - `{{ 1000 | numFormat:'#,##0.00' }}`  → ` 1,000.00 `
 *   - `{{ 1000 | numFormat:'#,##0.00':'fr' }}`  → ` 1 000,00 `
 *   - `{{ 1000.555 | numFormat:'#,##0.00:'fr':'default' }}`  → ` 1 000,56`
 *   - `{{ 1000.555 | numFormat:'#,##0.00:'fr':'trunc' }}`  → ` 1 000,55`
 */
@Pipe({
    name: 'numFormat',
})
export class NumFormatPipe implements PipeTransform {
    private static cache: Record<string, { dot: string; separator: string; round?: 'default' | 'trunc' }> = {};
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
    transform(
        value: number,
        params?: Intl.NumberFormatOptions | string | undefined,
        lang?: string,
        round?: 'default' | 'trunc',
    ): string {
        const empty = `${value}`;
        const lg = lang || NumFormatPipe.lang || 'en';
        if (empty === '' || empty === 'undefined' || empty === 'null' || empty === 'NaN') {
            return '';
        } else if (typeof params === 'string') {
            if (!NumFormatPipe.cache[lg]) {
                const [, group, , decimal] = new Intl.NumberFormat(lg).formatToParts(1000.1);
                NumFormatPipe.cache[lg] = { dot: decimal.value, separator: group.value };
            }
            return new NumFormatter(value).formatByPattern(params, { ...NumFormatPipe.cache[lg], round });
        } else {
            return new Intl.NumberFormat(lg, typeof params === 'object' ? params : {}).format(value);
        }
    }
}
