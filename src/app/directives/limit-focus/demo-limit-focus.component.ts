import { Component, viewChild } from '@angular/core';

import { Json2html, Json2htmlObject } from '@ikilote/json2html';

import {
    MagmaLimitFocusDirective,
    MagmaLimitFocusFirstDirective,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-limit-focus',
    templateUrl: './demo-limit-focus.component.html',
    styleUrls: ['./demo-limit-focus.component.scss'],
    imports: [CodeTabsComponent, MagmaLimitFocusDirective, MagmaLimitFocusFirstDirective],
})
export class DemoLimitFocusComponent {
    limitFocus = viewChild.required(MagmaLimitFocusDirective);

    codeHtml = ``;

    constructor() {
        this.codeGeneration();
    }

    click() {
        this.limitFocus().focus();
    }

    codeGeneration() {
        // tag root

        const json: Json2htmlObject = [
            {
                tag: 'p',
                attrs: {
                    limitFocus: null,
                    '#limit': 'limitFocus',
                },
                body: [
                    {
                        tag: 'button',
                        body: 'Test 0',
                        attrs: { class: 'hide' },
                        inline: true,
                    },
                    {
                        tag: 'button',
                        body: 'Test 1',
                        inline: true,
                    },
                    {
                        tag: 'button',
                        attrs: {
                            limitFocusFirst: '1',
                        },
                        body: 'Test 2',
                        inline: true,
                    },
                    {
                        tag: 'button',
                        body: 'Test 3',
                        attrs: { class: 'hide' },
                        inline: true,
                    },
                    {
                        tag: 'button',
                        body: 'Test 4',
                        inline: true,
                    },
                    {
                        tag: 'button',
                        body: 'Test 5',
                        attrs: { class: 'hidden' },
                        inline: true,
                    },
                ],
            },
            { emptyLine: 1 },
            {
                tag: 'p',

                body: [
                    {
                        tag: 'button',
                        attrs: {
                            '(click)': 'limit.focus()',
                        },
                        body: 'Focus',
                        inline: true,
                    },
                ],
            },
        ];

        this.codeHtml = new Json2html(json).toString();
    }
}
