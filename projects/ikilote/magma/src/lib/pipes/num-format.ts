import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numFormat',
    standalone: true,
})
export class NumFormatPipe implements PipeTransform {
    static lang = 'en';

    transform(value: number | bigint, params?: (Intl.NumberFormatOptions & { lang?: string }) | undefined): string {
        return new Intl.NumberFormat(params?.lang || NumFormatPipe.lang || 'en', params).format(value);
    }
}
