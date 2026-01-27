import { Component } from '@angular/core';

import { StrReplacePipe } from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-str-replace',
    templateUrl: './demo-str-replace.component.html',
    styleUrl: './demo-str-replace.component.scss',
    imports: [CodeTabsComponent, StrReplacePipe],
})
export class DemoStrReplaceComponent {
    codeHtml = [
        `{{ 'Test---Test' | strReplace: '/-+/' : '-' }}`,
        `{{ 'Test---Test' | strReplace: 'Test' : '/' }}`,
        `{{ 'Test---Test' | strReplace: replace : '/' }}`,
    ];

    codeTs = `import { StrReplacePipe } from '@ikilote/magma';

@Component({
    selector: 'demo-test',
    templateUrl: './demo-test.component.html',
    styleUrl: './demo-test.component.scss',
    imports: [StrReplacePipe],
})
export class TestComponent {
    replace = /-+/g;
}`;

    replace = /-+/g;
}
