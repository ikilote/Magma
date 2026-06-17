import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { flattenedListItems } from '@ikilote/magma';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-array',
    templateUrl: './demo-array.component.html',
    styleUrl: './demo-array.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ReactiveFormsModule, CodeTabsComponent, JsonPipe],
})
export class DemoArrayComponent {
    codeTs = `import { flattenedListItems } from '@ikilote/magma';

@Component({ ... })
export class TestComponent {
    test1 = flattenedListItems('test');
    test2 = flattenedListItems('test1, test2, test3');
    test3 = flattenedListItems(['test1, test2, test3', ['test4']]);
    test4 = flattenedListItems(['test1  test2  test3', ['test4']], /\s+/);
}`;

    test1 = flattenedListItems('test');
    test2 = flattenedListItems('test1, test2, test3');
    test3 = flattenedListItems(['test1, test2, test3', ['test4']]);
    test4 = flattenedListItems(['test1  test2  test3', ['test4']], /\s+/);
}
