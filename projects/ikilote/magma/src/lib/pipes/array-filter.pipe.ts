import { Pipe, PipeTransform } from '@angular/core';

import { isEmpty } from '../utils/other';

/**
 * Equivalent of `<array>.filter`
 *
 * Examples of usage:
 * - `{{ ['a', 'b', 'c'] | arrayFilter: myFilter  }}` → `['b', 'c']`\
 *  in component:\
 *  `myFilter(value => value !== "a")`
 */
@Pipe({
    name: 'arrayFilter',
    pure: false,
})
export class ArrayFilterPipe implements PipeTransform {
    transform<T>(items: T[], callback: (item: T) => boolean): T[] {
        return Array.isArray(items) && !isEmpty(items) && typeof callback === 'function'
            ? items.filter(item => callback(item))
            : items;
    }
}
