import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'math',
    pure: false,
})
export class MathPipe implements PipeTransform {
    transform(value: any, name: string, ...args: any[]): any {
        Math.random;
        return (Math as any)[name](value, ...args);
    }
}
