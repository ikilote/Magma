import { Pipe, PipeTransform } from '@angular/core';

/**
 * Replace all string (equivalent of `<string>.replaceAll()`)
 *
 * Usage:
 * - `{{ i of 15 | repeatFor }}`
 *
 * Example:
 * - `@for (i of 10 | repeatFor; track $index) { {{ $index }}  }` → ` 0 1 2 3 4 5 6 7 8 9 `
 */
@Pipe({
    name: 'repeatFor',
})
export class RepeatForPipe implements PipeTransform {
    transform(value: number): any[] {
        return new Array(value);
    }
}
