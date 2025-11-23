import { Pipe, PipeTransform } from '@angular/core';

export interface FileSizePipeParams {
    format?: 'decimal' | 'binary';
    language?: string;
    options?: Intl.NumberFormatOptions | undefined;
    translate?: {
        unitTableBinary?: [string, string, string, string, string];
        unitTableDecimal?: [string, string, string, string, string];
    };
}

/**
 * Format file size
 *
 * Examples of usage:
 * - `{{ 566155566400 | fileSize  }}` → `527.3 GiB`
 * - `{{ 566155566400 | fileSize: { format: 'decimal' }}`  → `566.2 GB`
 * - `{{ 566155566400  | fileSize: { language: 'fr', translate: { unitTableBinary: [' o', ' Kio', ' Mio',
 *    ' Gio', ' Tio'] } } }}` → `527,3 Gio`
 */
@Pipe({
    name: 'fileSize',
})
export class FileSizePipe implements PipeTransform {
    static unitTableBinary = [' B', ' KiB', ' MiB', ' GiB', ' TiB'];
    static unitTableDecimal = [' B', ' kB', ' MB', ' GB', ' TB'];

    /**
     * @param value
     * @param params
     * * format:
     *   * decimal (SI): by 1000)
     *   * binary: by 1024 - default
     * * language - default 'en'
     * * options : NumberFormatOptions
     * @returns
     */
    transform(value: number, params?: FileSizePipeParams): string {
        params ??= {};
        let unit = 0;
        const format = params?.format === 'decimal' ? 1000 : 1024;
        while (value / format > 9) {
            value /= format;
            unit++;
        }
        params.options ??= {};
        params.options.maximumSignificantDigits ??= 4;

        return (
            new Intl.NumberFormat(params.language || 'en', params.options).format(value) +
            (params?.format === 'decimal'
                ? (params?.translate?.unitTableDecimal ?? FileSizePipe.unitTableDecimal)
                : (params?.translate?.unitTableBinary ?? FileSizePipe.unitTableBinary))[unit]
        );
    }
}
