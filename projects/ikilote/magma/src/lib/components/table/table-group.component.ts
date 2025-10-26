import {
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
import { MagmaTable } from './table.component';

@Component({
    selector: 'table[mg] > thead[mg], table[mg] > tbody[mg],table[mg] > tfoot[mg]',
    templateUrl: './table-group.component.html',
    styleUrls: ['./table-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.sticky]': 'sticky()',
        '[class.baseline]': 'baseline()',
    },
})
export class MagmaTableGroup {
    readonly host = inject(MagmaTable, { optional: false, host: true });
    protected readonly el = inject(ElementRef<HTMLTableSectionElement>);

    readonly sticky = input(false, { transform: booleanAttribute });
    readonly baseline = input(false, { transform: booleanAttribute });

    _data = this.host._data[this.el.nativeElement.tagName.toLowerCase() as 'thead' | 'tbody' | 'tfoot'];

    readonly inputs = contentChildren(MagmaTableRow);

    @HostListener('mouseout')
    mouseOut() {
        this.host.clearOver();
    }

    ngAfterViewChecked(): void {
        if (this.inputs()?.length) {
            this.inputs().forEach(e => {
                e.host ??= this;
                e.table ??= this.host;
            });
        }
    }
}
