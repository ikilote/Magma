import { Component } from '@angular/core';

import { MagmaClickOutsideDirective } from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-click-outside',
    templateUrl: './demo-click-outside.component.html',
    styleUrls: ['./demo-click-outside.component.scss'],
    imports: [MagmaClickOutsideDirective, CodeTabsComponent],
})
export class DemoClickOutsideComponent {
    codeTs = `@Component({
    selector: 'demo-test',
    templateUrl: './demo-test.component.html',
    styleUrls: ['./demo-test.component.scss'],
    imports: [MagmaClickOutsideDirective],
})
export class TestComponent {
    events = '';

    clickOutside() {
        this.events += 'outside\n';
    }

    clickInside() {
        this.events += 'inside\n';
    }
}`;
    codeHtml = `<button (clickOutside)="clickOutside()" (click)="clickInside()">Click</button>`;

    events = '';

    clickOutside() {
        this.events += 'outside\n';
    }

    clickInside() {
        this.events += 'inside\n';
    }
}
