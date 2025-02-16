import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';

import { MagmaTableCell } from './table-cell.component';
import { MagmaTableGroup } from './table-group.component';
import { MagmaTableRow } from './table-row.component';

export type MagmaTableData = {
    cell: MagmaTableCell;
    row: MagmaTableRow;
    textContent: string;
};

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

    _data: { thead: MagmaTableData[][]; tbody: MagmaTableData[][]; tfoot: MagmaTableData[][] } = {
        thead: [],
        tbody: [],
        tfoot: [],
    };

    constructor() {
        setTimeout(() => {
            console.log('data', this._data);
        }, 10);
    }

    over(line: number, col: number) {
        this._data.tbody.forEach((row, indexR) => {
            row.forEach((cell, indexC) => {
                cell.cell.hover.set(indexR === line && indexC === col);
                cell.cell.hoverLink.set(indexR === line || indexC === col);
            });
        });
    }
}

export const MagmaTableComponent = [MagmaTable, MagmaTableGroup, MagmaTableRow, MagmaTableCell];
