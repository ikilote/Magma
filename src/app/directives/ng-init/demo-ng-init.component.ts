import { ChangeDetectorRef, Component, inject } from '@angular/core';

import { MagmaNgInitDirective } from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-ng-init',
    templateUrl: './demo-ng-init.component.html',
    styleUrls: ['./demo-ng-init.component.scss'],
    imports: [MagmaNgInitDirective, CodeTabsComponent],
})
export class DemoNgInitComponent {
    readonly cd = inject(ChangeDetectorRef);

    codeHtml = `<button (click)="add()">Add</button>

@for (item of items; track $index) {
  <div (ngInit)="ngInit(item)">item {{ item }}</div>
}`;
    codeTs = `@Component({
    selector: 'demo-test',
    templateUrl: './demo-test.component.html',
    styleUrls: ['./demo-test.component.scss'],
    imports: [MagmaNgInitDirective],
})
export class TestComponent {
    readonly cd = inject(ChangeDetectorRef);

    events = '';

    items: number[] = [];

    add() {
        this.items.push(this.items.length);
        this.cd.detectChanges();
    }

    ngInit(number: number) {
        this.events += \`item\${number}\\n\`;
    }
}`;

    events = ``;

    items: number[] = [];

    add() {
        this.items.push(this.items.length);
        this.cd.detectChanges();
    }

    ngInit(number: number) {
        this.events += `item${number}\n`;
    }
}
