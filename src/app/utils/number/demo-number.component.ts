import { Component } from '@angular/core';

import { randomNumber } from '../../../../projects/ikilote/magma/src/lib/utils/number';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-number',
    templateUrl: './demo-number.component.html',
    styleUrls: ['./demo-number.component.scss'],
    imports: [CodeTabsComponent],
})
export class DemoNumberComponent {
    codeTs = `@Component({ ... })
export class TestComponent {
    number?: string;

    getNumber() {
        this.number = randomNumber();
    }
}`;

    number?: string;

    getNumber() {
        this.number = randomNumber();
    }
}
