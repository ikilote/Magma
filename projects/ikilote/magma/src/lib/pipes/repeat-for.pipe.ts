import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'repeatFor',
    pure: false,
})
export class RepeatForPipe implements PipeTransform {
    transform(value: number): any[] {
        return new Array(value);
    }
}
