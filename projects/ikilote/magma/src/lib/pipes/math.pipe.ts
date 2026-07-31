import { Pipe, PipeTransform } from '@angular/core';

/**
 * Format number to string (abs, trunc, random, min, max, cos, sin, etc.)
 *
 * Examples of usage:
 * - `{{ -150.5 | math: 'abs' }}` → `150.5`
 * - `{{ -159.5599 | math: 'trunc' }}`  → `-159`
 * - `{{ '' | math: 'random' }}`  → `0.3674915822819971` (changes at each call of the method)
 * - `{{ 150 | math: 'min' : 10 : -5 : 155 }}`  → `-5`
 * - `{{ 150 | math: 'max' : 10 : -5 : 155 }}`  → `155`
 */
@Pipe({
    name: 'math',
})
export class MathPipe implements PipeTransform {
    transform(value: number | string | null | undefined, name: string, ...args: number[]): number | undefined {
        const fn = Math[name as keyof typeof Math];
        return typeof fn === 'function' ? (fn as (...a: number[]) => number)(Number(value), ...args) : undefined;
    }
}
