import { ChangeDetectionStrategy, Component, contentChildren } from '@angular/core';

import { MagmaTableRow } from './table-row.component';

@Component({
    selector: 'thead[mg], tbody[mg], tfoot[mg]',
    templateUrl: './table-group.component.html',
    styleUrls: ['./table-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagmaTableGroup {
    readonly inputs = contentChildren(MagmaTableRow);
}
