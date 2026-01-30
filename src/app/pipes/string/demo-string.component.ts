import { Component } from '@angular/core';

import { StringPipe } from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-string',
    templateUrl: './demo-string.component.html',
    styleUrl: './demo-string.component.scss',
    imports: [CodeTabsComponent, StringPipe],
})
export class DemoStringComponent {
    toUpperCase = "{{ 'test-TEST-test'  | string: 'toUpperCase' }}";
    toLowerCase = "{{ 'test-TEST-test' | string: 'toLowerCase' }}";
    length = "{{ 'test-TEST-test' | string: 'length' }}";
    startsWith = "{{ 'test-TEST-test' | string: 'startsWith' : 'test-' }}";
    substring = "{{ 'test-TEST-test' |  string: 'substring' : 0 : 10}}";
    padStart = "{{ 'test-TEST-test' |  string: 'padStart' : 49 : 'test-'}}";

    codeTs = `import { StringPipe } from '@ikilote/magma';

@Component({
    selector: 'demo-test',
    templateUrl: './demo-test.component.html',
    styleUrl: './demo-test.component.scss',
    imports: [StringPipe],
})
export class TestComponent {}`;
}
