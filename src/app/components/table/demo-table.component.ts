import { Component } from '@angular/core';

import { MagmaTableComponent } from '../../../../projects/ikilote/magma/src/lib/components/table/table.component';

@Component({
    selector: 'demo-table',
    templateUrl: './demo-table.component.html',
    styleUrls: ['./demo-table.component.scss'],
    imports: [MagmaTableComponent],
})
export class DemoTableComponent {}
