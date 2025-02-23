import { Component, inject } from '@angular/core';

import { MagmaMessage, clipboardWrite } from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-clipboard',
    templateUrl: './demo-clipboard.component.html',
    styleUrls: ['./demo-clipboard.component.scss'],
    imports: [CodeTabsComponent],
})
export class DemoClipboardComponent {
    readonly mgMessage = inject(MagmaMessage);

    codeHtml = `<p #ref contenteditable>Editable text</p>

<button (click)="copy(ref)">Copy</button>`;

    codeTs = `@Component({
    selector: 'demo-test',
    templateUrl: './demo-test.component.html',
    styleUrls: ['./demo-test.component.scss'],
    imports: [],
})
export class TestComponent {
    readonly mgMessage = inject(MagmaMessage);

    copy(element: HTMLDivElement) {
        if (element.textContent) {
            clipboardWrite(element.textContent);
            this.mgMessage.addMessage(\`Copy to clipboard\`);
        }
    }
}`;

    copy(element: HTMLDivElement) {
        if (element.textContent) {
            clipboardWrite(element.textContent);
            this.mgMessage.addMessage(`Copy to clipboard`);
        }
    }
}
