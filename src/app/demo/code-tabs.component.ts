import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { Highlight } from 'ngx-highlightjs';

import {
    MagmaMessages,
    MagmaTabContent,
    MagmaTabTitle,
    MagmaTabs,
    clipboardWrite,
} from '../../../projects/ikilote/magma/src/public-api';

@Component({
    selector: 'code-tabs',
    templateUrl: './code-tabs.component.html',
    styleUrl: './code-tabs.component.scss',
    imports: [MagmaTabs, MagmaTabContent, MagmaTabTitle, Highlight],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeTabsComponent {
    readonly mgMessages = inject(MagmaMessages);

    code = input.required<
        {
            type: 'html' | 'ts' | 'css' | 'scss';
            title?: string;
            code: string | { title?: string; code: string } | (string | { title?: string; code: string })[];
        }[]
    >();

    clipboard(code: string) {
        clipboardWrite(code);
        this.mgMessages.addMessage(`Code copy to clipboard`);
    }
}
