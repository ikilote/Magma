import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';

import { MagmaTableCell } from './table-cell.component';
import { MagmaTableGroup } from './table-group.component';
import { MagmaTableRow } from './table-row.component';

@Component({
    selector: 'table[mg]',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.baseline]': 'baseline()',
    },
})
export class MagmaTable {
    readonly baseline = input(null, { transform: booleanAttribute });

    _data: { thead: any[][]; tbody: any[][]; tfoot: any[][] } = { thead: [], tbody: [], tfoot: [] };

    constructor() {
        setTimeout(() => {
            console.log('data', this._data);
        }, 10);
    }
}

export const MagmaTableComponent = [MagmaTable, MagmaTableGroup, MagmaTableRow, MagmaTableCell];
