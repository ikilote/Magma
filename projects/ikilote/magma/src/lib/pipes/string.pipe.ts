import { Pipe, PipeTransform } from '@angular/core';

/**
 * Methods for string (padStart, padEnd, toUpperCase, toUpperCase, toLocaleUpperCase, etc.)
 *
 * Examples of usage:
 * - `{{ '123' | string: 'padStart' : 6 : '456' }}` → `456123`
 */
@Pipe({
    name: 'string',
})
export class StringPipe implements PipeTransform {
    transform(value: any, name: string, ...args: any[]): any {
        if (name === 'length') {
            return `${value}`.length;
        } else {
            return (`${value}` as any)[name]?.(...args);
        }
    }
}
