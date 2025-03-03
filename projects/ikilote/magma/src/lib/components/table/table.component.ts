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
    readonly baseline = input(false, { transform: booleanAttribute });
    readonly hover = input(false, { transform: booleanAttribute });
    readonly hoverCol = input(false, { transform: booleanAttribute });
    readonly hoverRow = input(false, { transform: booleanAttribute });
    readonly hoverCell = input(false, { transform: booleanAttribute });

    _data: { thead: MagmaTableData[][]; tbody: MagmaTableData[][]; tfoot: MagmaTableData[][] } = {
        thead: [],
        tbody: [],
        tfoot: [],
    };

    over(line: number, col: number) {
        if (this.hover() || this.hoverCol()) {
            this._data.thead.forEach((row, _indexR) => {
                row.forEach((cell, indexC) => {
                    cell.cell.hoverLink.set(indexC === col);
                });
            });
            this._data.tfoot.forEach((row, _indexR) => {
                row.forEach((cell, indexC) => {
                    cell.cell.hoverLink.set(indexC === col);
                });
            });
        }
        if (this.hover() || this.hoverCol() || this.hoverRow() || this.hoverCell()) {
            this._data.tbody.forEach((row, indexR) => {
                row.forEach((cell, indexC) => {
                    if (this.hover() || this.hoverCell()) {
                        cell.cell.hover.set(indexR === line && indexC === col);
                    }
                    if (this.hover() || (this.hoverCol() && this.hoverRow())) {
                        cell.cell.hoverLink.set(indexR === line || indexC === col);
                    } else if (this.hoverRow()) {
                        cell.cell.hoverLink.set(indexR === line);
                    } else if (this.hoverCol()) {
                        cell.cell.hoverLink.set(indexC === col);
                    }
                });
            });
        }
    }

    clearOver() {
        [this._data.thead, this._data.tbody, this._data.tfoot].forEach(e =>
            e.forEach((row, _indexR) =>
                row.forEach(cell => {
                    cell.cell.hover.set(false);
                    cell.cell.hoverLink.set(false);
                }),
            ),
        );
    }
}

export const MagmaTableComponent = [MagmaTable, MagmaTableGroup, MagmaTableRow, MagmaTableCell];
