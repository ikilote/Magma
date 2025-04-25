import { NgModule } from '@angular/core';

import { MagmaTableCell } from './table-cell.component';
import { MagmaTableGroup } from './table-group.component';
import { MagmaTableRow } from './table-row.component';
import { MagmaTable } from './table.component';

const MagmaTableComponent = [MagmaTable, MagmaTableGroup, MagmaTableRow, MagmaTableCell];

@NgModule({
    imports: [MagmaTableComponent],
    exports: [MagmaTableComponent],
})
export class MagmaTableModule {}
