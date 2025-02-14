import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MagmaTableCell } from './table-cell.component';
import { MagmaTableGroup } from './table-group.component';
import { MagmaTableRow } from './table-row.component';

@Component({
    selector: 'table[mg]',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagmaTable {}

export const MagmaTableComponent = [MagmaTable, MagmaTableGroup, MagmaTableRow, MagmaTableCell];
