import { Component } from '@angular/core';

import { MagmaExpansionPanelModule } from '../../../../projects/ikilote/magma/src/public-api';

@Component({
    selector: 'demo-expansion-panel',
    templateUrl: './demo-expansion-panel.component.html',
    styleUrls: ['./demo-expansion-panel.component.scss'],
    imports: [MagmaExpansionPanelModule],
})
export class DemoExpansionPanelComponent {}
