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
        console.log(value, name, args, `${value}`, (`${value}` as any)[name], (`${value}` as any)[name]?.(...args));
        return (`${value}` as any)[name]?.(...args);
    }
}
