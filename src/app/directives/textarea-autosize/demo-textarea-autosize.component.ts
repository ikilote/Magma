import { Component } from '@angular/core';

import { MagmaTextareaAutosizeDirective } from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-textarea-autosize',
    templateUrl: './demo-textarea-autosize.component.html',
    styleUrls: ['./demo-textarea-autosize.component.scss'],
    imports: [MagmaTextareaAutosizeDirective, CodeTabsComponent],
})
export class DemoTextareaAutosizeComponent {
    codeHtml = `<textarea autosize></textarea>`;

    codeTs = `@Component({
    selector: 'demo-test',
    templateUrl: './demo-test.component.html',
    styleUrls: ['./demo-test.component.scss'],
    imports: [MagmaTextareaAutosizeDirective],
})
export class TestComponent {}`;
}
