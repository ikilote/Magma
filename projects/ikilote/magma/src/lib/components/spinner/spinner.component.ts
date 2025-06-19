import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { numberAttributeOrUndefined } from '../../utils/coercion';

@Component({
    selector: 'mg-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
    host: {
        '[style.--height.px]': 'size()',
        '[style.--width.px]': 'tickWidth()',
        '[style.--radius.px]': 'radius()',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagmaSpinner {
    // input

    readonly size = input(undefined, { transform: numberAttributeOrUndefined });
    readonly tickWidth = input(undefined, { transform: numberAttributeOrUndefined });
    readonly radius = input(undefined, { transform: numberAttributeOrUndefined });
}
