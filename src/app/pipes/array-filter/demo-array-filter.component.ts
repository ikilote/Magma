import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';

import { ArrayFilterPipe } from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-array-filter',
    templateUrl: './demo-array-filter.component.html',
    styleUrls: ['./demo-array-filter.component.scss'],
    imports: [CodeTabsComponent, ArrayFilterPipe, JsonPipe],
})
export class DemoArrayFilterComponent {
    codeHtml = "{{ ['a', 'b', 'c'] | arrayFilter: arrayFilter  }}";

    codeTs = `import { ArrayFilterPipe } from '@ikilote/magma';

@Component({
    selector: 'demo-test',
    templateUrl: './demo-test.component.html',
    styleUrls: ['./demo-test.component.scss'],
    imports: [ArrayFilterPipe],
})
export class TestComponent {
    arrayFilter = (value: string) => value !== 'a';
}`;

    arrayFilter = (value: string) => value !== 'a';
}
