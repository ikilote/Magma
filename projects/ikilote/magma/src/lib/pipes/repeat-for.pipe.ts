import { Pipe, PipeTransform } from '@angular/core';

/**
 * Replace all string (equivalent of `<string>.replaceAll()`)
 *
 * Usage:
 * - `{{ i of 15 | repeatFor }}`
 *
 * Example:
 * - `@for (i of 10 | repeatFor; track $index) { {{ $index }}  }` → ` 0 1 2 3 4 5 6 7 8 9 `
 * - `@for (i of 10 | repeatFor : true; track $index) { {{ i }}  }` → `1 2 3 4 5 6 7 8 9 10`
 */
@Pipe({
    name: 'repeatFor',
})
export class RepeatForPipe implements PipeTransform {
    transform(value: number, counter = false): number[] {
        value = Math.trunc(Math.max(Number(value), 0) || 0);
        if (counter) {
            return new Array(...new Array(value)).map((i, index) => index + 1);
        } else {
            return new Array(value);
        }
    }
}
