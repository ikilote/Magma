import { Component, input } from '@angular/core';

import { RepeatForPipe } from '../../pipes/repeat-for.pipe';
import { numberAttributeOrUndefined } from '../../utils/coercion';

@Component({
    selector: 'mg-spinner',
    templateUrl: './spinner.component.html',
    styleUrl: './spinner.component.scss',
    host: {
        '[style.--height.px]': 'size()',
        '[style.--width.px]': 'tickWidth()',
        '[style.--radius.px]': 'radius()',
    },
    imports: [RepeatForPipe],
})
export class MagmaSpinner {
    // input

    readonly size = input(undefined, { transform: numberAttributeOrUndefined });
    readonly tickWidth = input(undefined, { transform: numberAttributeOrUndefined });
    readonly radius = input(undefined, { transform: numberAttributeOrUndefined });
}
