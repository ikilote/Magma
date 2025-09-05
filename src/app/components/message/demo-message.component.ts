import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Json2html } from '@ikilote/json2html';

import { Select2Data, Select2Option } from 'ng-select2-component';

import {
    MagmaBlockMessage,
    MagmaInput,
    MagmaInputSelect,
    MagmaMessage,
    MagmaMessageType,
    enumToValueList,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-message',
    templateUrl: './demo-message.component.html',
    styleUrls: ['./demo-message.component.scss'],
    imports: [MagmaMessage, MagmaBlockMessage, CodeTabsComponent, MagmaInput, MagmaInputSelect, FormsModule],
})
export class DemoMessageComponent {
    codeHtml = '';
    codeHtmlSub = '';
    codeHtmlGrid = '';

    codeTs = `import { MagmaMessage } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    styleUrls: ['./my-component.component.scss'],
    imports: [
        MagmaMessage
    ],
})
export class DemoMessageComponent {
}`;

    codeTsSub = `import { MagmaMessage, MagmaBlockMessage } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    styleUrls: ['./my-component.component.scss'],
    imports: [
        MagmaMessage,
        MagmaBlockMessage
    ],
})
export class DemoMessageComponent {
}`;

    data: Select2Data = [];
    type: MagmaMessageType = MagmaMessageType.success;

    constructor() {
        this.data = [
            { value: null, label: `no type` },
            ...enumToValueList(MagmaMessageType).map<Select2Option>(k => ({ value: k, label: `${k}` })),
        ];

        this.codeUpdate();
        this.codeUpdateGrid();

        this.codeHtmlSub = new Json2html({
            tag: 'mg-message',
            attrs: { type: this.type || undefined },
            body: [undefined, ...enumToValueList(MagmaMessageType)].map(value => ({
                tag: 'mg-message-block',
                attrs: { type: value },
                body: [{ tag: 'p', body: `${value ?? 'no type'}`, inline: true }],
            })),
        }).toString();
    }

    codeUpdate() {
        this.codeHtml = new Json2html({
            tag: 'mg-message',
            attrs: { type: this.type || undefined },
            body: [
                { tag: 'h1', body: 'Test', inline: true },
                { tag: 'p', body: 'Test', inline: true },
            ],
        }).toString();
    }

    codeUpdateGrid() {
        this.codeHtmlGrid = new Json2html({
            tag: 'div',
            attrs: { class: 's-12 gap' },
            body: [
                {
                    tag: 'mg-message',
                    attrs: { type: this.type || undefined, class: 's-12' },
                    body: [
                        { tag: 'h1', body: 'Test', inline: true },
                        { tag: 'p', body: 'Test', inline: true },
                    ],
                },
                { emptyLine: 1 },
                {
                    tag: 'mg-message',
                    attrs: { type: this.type || undefined, class: 's-6' },
                    body: [
                        {
                            tag: 'div',
                            body: [
                                { tag: 'h1', body: 'Test div', inline: true },
                                { tag: 'p', body: 'Test', inline: true },
                            ],
                        },
                    ],
                },
                {
                    tag: 'mg-message',
                    attrs: { class: 's-6' },
                    body: [
                        {
                            tag: 'div',
                            body: 'Test',
                        },
                    ],
                },
            ],
        }).toString();
    }
}
