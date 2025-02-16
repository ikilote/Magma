import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    booleanAttribute,
    contentChildren,
    inject,
    input,
} from '@angular/core';

import { MagmaTableCell } from './table-cell.component';
import { MagmaTableGroup } from './table-group.component';

@Component({
    selector: 'table[mg] > * > tr[mg]',
    templateUrl: './table-row.component.html',
    styleUrls: ['./table-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.baseline]': 'baseline()',
    },
})
export class MagmaTableRow {
    readonly host = inject(MagmaTableGroup, { optional: false, host: true });
    readonly cd = inject(ChangeDetectorRef);

    readonly baseline = input(null, { transform: booleanAttribute });

    readonly inputs = contentChildren(MagmaTableCell);

    index = 0;
    _data!: any[];

    ngAfterViewInit(): void {
        this.index = this.host.inputs().indexOf(this);
        this._data = this.host._data[this.index] = [];

        this.inputs().forEach(e => {
            e.row = this.index;
            this.host._data[this.index][e.index] = {
                cell: e,
                row: this,
                textContent: e.el.nativeElement.textContent,
            };
            e.cd.detectChanges();
        });
        this.cd.detectChanges();
    }
}
