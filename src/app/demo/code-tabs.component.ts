import { Component, inject, input } from '@angular/core';

import { MagmaMessages, MagmaTabContent, MagmaTabTitle, MagmaTabs, clipboardWrite } from '@ikilote/magma';

import { Highlight } from 'ngx-highlightjs';

export type CSSVar = { name: string; value: string | number };

@Component({
    selector: 'code-tabs',
    templateUrl: './code-tabs.component.html',
    styleUrl: './code-tabs.component.scss',
    imports: [MagmaTabs, MagmaTabContent, MagmaTabTitle, Highlight],
})
export class CodeTabsComponent {
    readonly mgMessages = inject(MagmaMessages);

    code = input.required<
        (
            | {
                  type: 'html' | 'ts' | 'css' | 'scss' | 'txt';
                  title?: string;
                  code: string | { title?: string; code: string } | (string | { title?: string; code: string })[];
              }
            | {
                  type: 'css-edit';
                  title?: string;
                  code: CSSVar[];
              }
        )[]
    >();

    clipboard(code: string) {
        clipboardWrite(code);
        this.mgMessages.addMessage(`Code copy to clipboard`);
    }

    varUpdate(css: CSSVar, val: any) {
        document.body.style.setProperty(css.name.startsWith('--') ? css.name : `--${css.name}`, `${val.target.value}`);
    }
}
