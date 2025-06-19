import { Component, inject, input } from '@angular/core';

import { MagmaMessage } from '@ikilote/magma';

import { Highlight } from 'ngx-highlightjs';

import {
    MagmaTabContent,
    MagmaTabTitle,
    MagmaTabs,
    clipboardWrite,
} from '../../../projects/ikilote/magma/src/public-api';

@Component({
    selector: 'code-tabs',
    templateUrl: './code-tabs.component.html',
    styleUrls: ['./code-tabs.component.scss'],
    imports: [MagmaTabs, MagmaTabContent, MagmaTabTitle, Highlight],
})
export class CodeTabsComponent {
    readonly mgMessage = inject(MagmaMessage);

    code = input.required<{ type: 'html' | 'ts'; code: string | string[] | { title?: string; code: string }[] }[]>();

    clipboard(code: string) {
        clipboardWrite(code);
        this.mgMessage.addMessage(`Code copy to clipboard`);
    }
}
