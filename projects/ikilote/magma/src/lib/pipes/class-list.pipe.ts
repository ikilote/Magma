import { Pipe, PipeTransform } from '@angular/core';

import { MagmaStringArray, flattenedListItems } from '../utils/array';

/**
 * Flatten and create a css class array
 *
 * Examples of usage:
 * - `{{ ['test', ['class-1 class-2'], 'class-a class-b'] | class-list }}`
 *    → `[ "test", "class-1", "class-2", "class-a", "class-b" ]`
 */
@Pipe({
    name: 'classList',
})
export class ClassListPipe implements PipeTransform {
    transform(values: MagmaStringArray): string[] {
        return flattenedListItems(values, /\s+/);
    }
}
