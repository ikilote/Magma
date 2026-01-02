import { Component } from '@angular/core';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-buttons',
    templateUrl: './demo-buttons.component.html',
    styleUrl: './demo-buttons.component.scss',
    imports: [CodeTabsComponent],
})
export class DemoButtonsComponent {
    default = '<button>Boutons</button>';
    primary = '<button class="primary">Boutons</button>';
    warn = '<button class="warn">Boutons</button>';

    link = '<a href="/style/buttons">Link</a>';
}
