import { Component, inject } from '@angular/core';

import { MagmaMessages, clipboardWrite } from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-clipboard',
    templateUrl: './demo-clipboard.component.html',
    styleUrl: './demo-clipboard.component.scss',
    imports: [CodeTabsComponent],
})
export class DemoClipboardComponent {
    readonly mgMessages = inject(MagmaMessages);

    codeHtml = `<p #ref contenteditable>Editable text</p>

<button (click)="copy(ref)">Copy</button>`;

    codeTs = `import { clipboardWrite } from '@ikilote/magma';

@Component({ ... })
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
            this.mgMessages.addMessage(`Copy to clipboard`);
        }
    }
}
