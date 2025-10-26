import {
    AfterViewChecked,
    AfterViewInit,
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
import { MagmaTable } from './table.component';

@Component({
    selector: 'table[mg] > * > tr[mg]',
    templateUrl: './table-row.component.html',
    styleUrls: ['./table-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.baseline]': 'baseline()',
    },
})
export class MagmaTableRow implements AfterViewInit, AfterViewChecked {
    host?: MagmaTableGroup;
    table?: MagmaTable;
    protected readonly cd = inject(ChangeDetectorRef);

    readonly baseline = input(false, { transform: booleanAttribute });

    readonly inputs = contentChildren(MagmaTableCell);

    index = 0;
    _data!: any[];

    ngAfterViewInit(): void {
        if (this.host) {
            this.index = this.host.inputs().indexOf(this);
            this._data = this.host._data![this.index] = [];

            this.inputs().forEach(e => {
                this.host!._data![this.index][e.index] = {
                    cell: e,
                    row: this,
                    textContent: e.el.nativeElement.textContent,
                };
                e.cd.detectChanges();
            });
        }
        this.cd.detectChanges();
    }

    ngAfterViewChecked(): void {
        if (this.host) {
            this.index = this.host.inputs().indexOf(this);
        }
        if (this.inputs()?.length) {
            this.inputs().forEach(e => {
                e.host ??= this;
                e.table ??= this.table;
                e.row = this.index;
            });
        }
        this.ngAfterViewInit();
    }
}
