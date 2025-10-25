import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    booleanAttribute,
    inject,
    input,
    signal,
} from '@angular/core';

import { MagmaTableRow } from './table-row.component';
import { MagmaTable } from './table.component';

@Component({
    selector: 'table[mg] > * > * > td[mg], table[mg] > * > * > th[mg]',
    templateUrl: './table-cell.component.html',
    styleUrls: ['./table-cell.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.baseline]': 'baseline()',
        '[class.hover]': 'hover()',
        '[class.hoverLink]': 'hoverLink()',
    },
})
export class MagmaTableCell implements AfterViewInit, AfterViewChecked {
    host?: MagmaTableRow;
    protected table?: MagmaTable;
    readonly cd = inject(ChangeDetectorRef);
    readonly el = inject(ElementRef<HTMLTableSectionElement>);

    readonly baseline = input(false, { transform: booleanAttribute });

    hover = signal(false);
    hoverLink = signal(false);

    row = 0;
    index = 0;

    ngAfterViewInit(): void {
        this.ngAfterViewChecked();
    }

    ngAfterViewChecked(): void {
        if (this.host) {
            this.index = this.host.inputs().indexOf(this);
            this.table = this.host.table;
        }
        this.cd.detectChanges();
    }

    @HostListener('mouseover')
    mouseOver() {
        if (this.table) {
            this.table.over(this.row, this.index);
        }
    }
}
