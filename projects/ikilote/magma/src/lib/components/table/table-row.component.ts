import { ChangeDetectionStrategy, ChangeDetectorRef, Component, contentChildren, inject } from '@angular/core';

import { MagmaTableCell } from './table-cell.component';
import { MagmaTableGroup } from './table-group.component';

@Component({
    selector: 'tr[mg]',
    templateUrl: './table-row.component.html',
    styleUrls: ['./table-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagmaTableRow {
    protected readonly host = inject(MagmaTableGroup, { optional: false, host: true });
    readonly cd = inject(ChangeDetectorRef);

    readonly inputs = contentChildren(MagmaTableCell);

    index = 0;

    ngAfterViewInit(): void {
        this.index = this.host.inputs().indexOf(this);
        this.inputs().forEach(e => {
            e.row = this.index;
            e.cd.detectChanges();
        });
        this.cd.detectChanges();
    }
}
