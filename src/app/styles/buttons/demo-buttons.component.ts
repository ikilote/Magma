import { Component } from '@angular/core';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-buttons',
    templateUrl: './demo-buttons.component.html',
    styleUrls: ['./demo-buttons.component.scss'],
    imports: [CodeTabsComponent],
})
export class DemoButtonsComponent {
    default = '<button>Boutons</button>';
    primary = '<button class="primary">Boutons</button>';
    warn = '<button class="warn">Boutons</button>';
}
