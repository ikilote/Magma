import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'classList',
    pure: false,
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
