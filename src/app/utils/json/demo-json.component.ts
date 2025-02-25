import { Component } from '@angular/core';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-json',
    templateUrl: './demo-json.component.html',
    styleUrls: ['./demo-json.component.scss'],
    imports: [CodeTabsComponent],
})
export class DemoJsonComponent {
    codeTs = `@Component({ ... })
export class TestComponent {
    myNewObject?: MyObject;

    testEmail(myObject: object) {
        this.myNewObject = jsonCopy<MyObject>(myObject);
    }
}`;
}
