import { Pipe, PipeTransform } from '@angular/core';

import { regexpSlash } from '../utils/other';

/**
 * Replace all string (equivalent of `<string>.replaceAll()`)
 *
 * Usage:
 * - `{{ value | replace:'source':'target' }}`
 * - `{{ value | replace:'/\w+/':'target' }}`
 * - `{{ value | replace:regexp:'target' }}`
 *
 * Example:
 * -   `{{ 'Test---Test' | replace:'/-+/':'-' }} ` → `'Test-Test' `
 */
@Pipe({
    name: 'strReplace',
})
export class StrReplacePipe implements PipeTransform {
    transform(value: string, source: string | RegExp, target: string): string {
        return typeof value === 'string'
            ? value.replaceAll(typeof source === 'string' ? regexpSlash(source) : source, target)
            : value;
    }
}
