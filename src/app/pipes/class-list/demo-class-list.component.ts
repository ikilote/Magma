import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';

import { ClassListPipe } from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-class-list',
    templateUrl: './demo-class-list.component.html',
    styleUrl: './demo-class-list.component.scss',
    imports: [CodeTabsComponent, ClassListPipe, JsonPipe],
})
export class DemoClassListComponent {
    codeHtml = "{{ ['test', ['class-1 class-2'], 'class-a class-b'] | class-list }}";

    codeTs = `import { ClassListPipe } from '@ikilote/magma';

@Component({
    selector: 'demo-test',
    templateUrl: './demo-test.component.html',
    styleUrl: './demo-test.component.scss',
    imports: [ClassListPipe],
})
export class TestComponent {}`;
}
