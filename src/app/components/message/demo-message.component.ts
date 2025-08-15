import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlBody, Json2htmlRef } from '@ikilote/json2html';
import { MagmaMessageType } from '@ikilote/magma';

import { Select2Data, Select2Option } from 'ng-select2-component';

import {
    MagmaBlockMessage,
    MagmaInput,
    MagmaInputSelect,
    MagmaMessage,
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

    codeHtmlSub = `<mg-message>
  <mg-message-block>
    <p>no type</p>
  </mg-message-block>
  <mg-message-block type="success">
    <p>success</p>
  </mg-message-block>
  <mg-message-block type="warn">
    <p>warn</p>
  </mg-message-block>
  <mg-message-block type="error">
    <p>error</p>
  </mg-message-block>
  <mg-message-block type="tip">
    <p>tip</p>
  </mg-message-block>
  <mg-message-block type="info">
    <p>info</p>
  </mg-message-block>
</mg-message>`;

    data: Select2Data = [];
    type: MagmaMessageType = MagmaMessageType.success;

    constructor() {
        this.data = [
            { value: null, label: `no type` },
            ...enumToValueList(MagmaMessageType).map<Select2Option>(k => ({ value: k, label: `${k}` })),
        ];

        this.codeUpdate();
    }

    codeUpdate() {
        const body: Json2htmlBody = [];

        const json: Json2htmlRef = {
            tag: 'mg-message',
            attrs: {
                type: this.type || undefined,
            },
            body: [
                { tag: 'h1', body: 'Test', inline: true },
                { tag: 'p', body: 'Test', inline: true },
            ],
        };
        const attrs: Json2htmlAttr = json.attrs!;

        this.codeHtml = new Json2html(json).toString();
    }
}
