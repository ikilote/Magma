import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
    MagmaInput,
    MagmaInputElement,
    MagmaInputNumber,
    randomNumber,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-number',
    templateUrl: './demo-number.component.html',
    styleUrl: './demo-number.component.scss',
    imports: [CodeTabsComponent, FormsModule, MagmaInput, MagmaInputNumber, MagmaInputElement],
})
export class DemoNumberComponent {
    codeTs = `import { randomNumber } from '@ikilote/magma';

@Component({ ... })
export class TestComponent {
    size = 9;
    number?: string;

    getNumber() {
        this.number = randomNumber(this.size);
    }
}`;

    size = 9;
    number?: string;

    getNumber() {
        this.number = randomNumber(this.size);
    }
}
