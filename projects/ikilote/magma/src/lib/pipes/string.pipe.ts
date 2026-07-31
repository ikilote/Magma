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
    transform(value: unknown, name: 'length'): number;
    transform(value: unknown, name: string, ...args: unknown[]): string;
    transform(value: unknown, name: string, ...args: unknown[]): string | number {
        const strValue = String(value);

        if (name === 'length') {
            return strValue.length;
        }

        const method = (strValue as unknown as Record<string, (...a: unknown[]) => string>)[name];
        return typeof method === 'function' ? method.apply(strValue, args) : strValue;
    }
}
