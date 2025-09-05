import { Component } from '@angular/core';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-subscriptions',
    templateUrl: './demo-subscriptions.component.html',
    styleUrls: ['./demo-subscriptions.component.scss'],
    imports: [CodeTabsComponent],
})
export class DemoSubscriptionsComponent {
    codeTs = `import { Subscriptions } from '@ikilote/magma';

@Component({ ... })
export class TestComponent {

    sub = Subscriptions.instance();

    constructor() {
        this.sub.push(
            this.apiService1.action().subscribe(value => this.value1 = value),
            this.apiService2.action().subscribe(value => this.value2 = value),
        );
    }

    ngOnDestroy() {
        // clear all
        this.sub.clear();
    }
}`;
}
