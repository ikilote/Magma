import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';

import {
    MagmaEllipsisButtonModule,
    MagmaInput,
    MagmaInputElement,
    MagmaInputText,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-ellipsis-button',
    templateUrl: './demo-ellipsis-button.component.html',
    styleUrl: './demo-ellipsis-button.component.scss',
    imports: [MagmaEllipsisButtonModule, MagmaInput, MagmaInputElement, MagmaInputText, FormsModule, CodeTabsComponent],
})
export class DemoEllipsisButtonComponent {
    content = '';

    codeHtml = ``;
    codeTs = `import { MagmaEllipsisButtonModule } from '@ikilote/magma';

@Component({
    selector: 'ellipsis-test',
    imports : [ MagmaEllipsisButtonModule ]
})
export class DemoContextMenuComponent {

    action(string: string) {
        console.log(string);
    }

}`;

    action(string: string) {
        console.log(string);
    }

    constructor() {
        this.codeGeneration();
    }

    codeGeneration() {
        const body: Json2htmlRef[] = [];

        const json: Json2htmlRef = {
            tag: 'mg-ellipsis-button',
            body: body,
        };
        const attrs: Json2htmlAttr = json.attrs!;

        if (this.content) {
            body.push({
                tag: 'mg-ellipsis-content',
                body: this.content,
            });
        }

        body.push({
            tag: 'mg-ellipsis-item',
            attrs: { '(action)': "action('1')" },
            body: 'Action 1',
        });
        body.push({
            tag: 'mg-ellipsis-item',
            attrs: { '(action)': "action('2')" },
            body: 'Action 2',
        });
        body.push({
            tag: 'mg-ellipsis-item',
            attrs: { '(action)': "action('3')" },
            body: 'Action with a long text to test the position',
        });

        this.codeHtml = new Json2html(json).toString();
    }
}
