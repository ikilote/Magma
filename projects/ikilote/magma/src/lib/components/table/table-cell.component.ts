import {
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
export class MagmaTableCell implements AfterViewInit {
    protected readonly host = inject(MagmaTableRow, { optional: false, host: true });
    readonly cd = inject(ChangeDetectorRef);
    readonly el = inject(ElementRef<HTMLTableSectionElement>);

    readonly baseline = input(null, { transform: booleanAttribute });

    hover = signal(false);
    hoverLink = signal(false);

    row = 0;
    index = 0;

    ngAfterViewInit(): void {
        this.index = this.host.inputs().indexOf(this);
        this.cd.detectChanges();
    }

    @HostListener('mouseover')
    mouseOver() {
        this.host.host.host.over(this.row, this.index);
    }
}
