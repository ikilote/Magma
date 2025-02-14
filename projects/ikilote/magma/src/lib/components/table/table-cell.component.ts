import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';

import { MagmaTableRow } from './table-row.component';

@Component({
    selector: 'td[mg], th[mg]',
    templateUrl: './table-cell.component.html',
    styleUrls: ['./table-cell.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagmaTableCell implements AfterViewInit {
    protected readonly host = inject(MagmaTableRow, { optional: false, host: true });
    readonly cd = inject(ChangeDetectorRef);
    row = 0;
    index = 0;

    ngAfterViewInit(): void {
        this.index = this.host.inputs().indexOf(this);
        this.cd.detectChanges();
    }
}
