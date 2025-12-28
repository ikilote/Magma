import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    booleanAttribute,
    contentChildren,
    inject,
    input,
} from '@angular/core';

import { MagmaTableRow } from './table-row.component';
import { MagmaTable, MagmaTableData } from './table.component';

@Component({
    selector: 'table[mg] > thead[mg], table[mg] > tbody[mg],table[mg] > tfoot[mg]',
    templateUrl: './table-group.component.html',
    styleUrl: './table-group.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.sticky]': 'sticky()',
        '[class.baseline]': 'baseline()',
    },
})
export class MagmaTableGroup implements AfterViewChecked {
    host?: MagmaTable;
    protected readonly el = inject(ElementRef<HTMLTableSectionElement>);
    protected readonly tag: 'thead' | 'tbody' | 'tfoot' = this.el.nativeElement.tagName.toLowerCase();

    readonly sticky = input(false, { transform: booleanAttribute });
    readonly baseline = input(false, { transform: booleanAttribute });

    _data?: MagmaTableData[][] = [];

    readonly inputs = contentChildren(MagmaTableRow);

    @HostListener('mouseout')
    mouseOut() {
        if (this.host) {
            this.host.clearOver();
        }
    }

    ngAfterViewChecked(): void {
        if (this.inputs()?.length) {
            this.inputs().forEach(e => {
                e.host ??= this;
                if (this.host) {
                    e.table ??= this.host;
                    this._data = this.host._data[this.tag];
                }
            });
        }
    }
}
