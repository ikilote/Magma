import { Component, input } from '@angular/core';

import { Highlight } from 'ngx-highlightjs';

import { MagmaTabContent, MagmaTabTitle, MagmaTabs } from '../../../projects/ikilote/magma/src/public-api';

@Component({
    selector: 'code-tabs',
    templateUrl: './code-tabs.component.html',
    styleUrls: ['./code-tabs.component.scss'],
    imports: [MagmaTabs, MagmaTabContent, MagmaTabTitle, Highlight],
})
export class CodeTabsComponent {
    code = input.required<{ type: 'html' | 'ts'; code: string | string[] | { title?: string; code: string }[] }[]>();
}
