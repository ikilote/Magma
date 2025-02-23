import { Component } from '@angular/core';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-coercion',
    templateUrl: './demo-coercion.component.html',
    styleUrls: ['./demo-coercion.component.scss'],
    imports: [CodeTabsComponent],
})
export class DemoCoercionComponent {
    codeTs = `@Component({
    selector: 'demo-test',
    templateUrl: './demo-test.component.html',
    styleUrls: ['./demo-test.component.scss'],
    imports: [],
})
export class TestComponent {
    // number or undefined if input is empty
    readonly maxlength = input(undefined, { transform: numberAttributeOrUndefined });
}`;
}
