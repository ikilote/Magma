import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ArrayFilterPipe } from '@ikilote/magma';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-array-filter',
    templateUrl: './demo-array-filter.component.html',
    styleUrl: './demo-array-filter.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [CodeTabsComponent, ArrayFilterPipe, JsonPipe],
})
export class DemoArrayFilterComponent {
    codeHtml = "{{ ['a', 'b', 'c'] | arrayFilter: arrayFilter  }}";

    codeTs = `import { ArrayFilterPipe } from '@ikilote/magma';

@Component({
    selector: 'demo-test',
    templateUrl: './demo-test.component.html',
    styleUrl: './demo-test.component.scss',
    imports: [ArrayFilterPipe],
})
export class TestComponent {
    arrayFilter = (value: string) => value !== 'a';
}`;

    arrayFilter = (value: string) => value !== 'a';
}
