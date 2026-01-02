import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
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
    styleUrl: './table-row.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.baseline]': 'baseline()',
    },
})
export class MagmaTableRow implements AfterViewInit, AfterViewChecked {
    host?: MagmaTableGroup;
    table?: MagmaTable;
    protected readonly cd = inject(ChangeDetectorRef);
    readonly el = inject(ElementRef<HTMLTableRowElement>);

    readonly baseline = input(false, { transform: booleanAttribute });

    readonly inputs = contentChildren(MagmaTableCell);

    index = 0;
    _data!: any[];

    ngAfterViewInit(): void {
        if (this.host) {
            this.index = this.host.inputs().indexOf(this);
            this._data = this.host._data![this.index] = [];

            for (const input of this.inputs()) {
                this.host._data![this.index][input.index] = {
                    cell: input,
                    row: this,
                    textContent: input.el.nativeElement.textContent,
                };
                input.cd.detectChanges();
            }
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
