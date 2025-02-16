import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MagmaTableComponent } from '../../../../projects/ikilote/magma/src/lib/components/table/table.component';
import { MagmaInput, MagmaInputCheckbox } from '../../../../projects/ikilote/magma/src/public-api';

@Component({
    selector: 'demo-table',
    templateUrl: './demo-table.component.html',
    styleUrls: ['./demo-table.component.scss'],
    imports: [MagmaTableComponent, FormsModule, MagmaInput, MagmaInputCheckbox],
})
export class DemoTableComponent {
    col = false;
    row = false;
}
