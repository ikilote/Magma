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
    transform(value: any, name: 'length'): number;
    transform(value: any, name: string, ...args: any[]): string;
    transform(value: any, name: string, ...args: any[]): string | number {
        const strValue = String(value);

        if (name === 'length') {
            return strValue.length;
        }

        const method = (strValue as any)[name];
        return typeof method === 'function' ? method.apply(strValue, args) : strValue;
    }
}
