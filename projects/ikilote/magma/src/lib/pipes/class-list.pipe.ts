import { Pipe, PipeTransform } from '@angular/core';

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
    transform(values: any[]): any[] {
        const list: any[] = [];
        values.flat(Infinity).forEach((value: any) => {
            if (typeof value === 'string' && value) {
                list.push(...value.split(/\s+/));
            }
        });
        return list;
    }
}
