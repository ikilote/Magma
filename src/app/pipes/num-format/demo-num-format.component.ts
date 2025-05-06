import { Component } from '@angular/core';

import { NumFormatPipe } from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-num-format',
    templateUrl: './demo-num-format.component.html',
    styleUrls: ['./demo-num-format.component.scss'],
    imports: [CodeTabsComponent, NumFormatPipe],
})
export class DemoNumFormatComponent {
    default = `{{ 1555.55 | numFormat: '#,##0.0000' }}
{{ 1555.55 | numFormat: '#,##0' }}
{{ 1555.55 | numFormat: '###0' }}
{{ 51555.55 | numFormat: '###,###0.00' }}`;

    option = `{{ 51555.55 | numFormat: { style: 'currency', currency: 'EUR' } : 'fr-FR' }}`;
}
