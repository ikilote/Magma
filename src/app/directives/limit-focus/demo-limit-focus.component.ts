import { Component, viewChild } from '@angular/core';

import { Json2html, Json2htmlObject } from '@ikilote/json2html';

import {
    MagmaBlock,
    MagmaDialog,
    MagmaInput,
    MagmaInputElement,
    MagmaInputText,
    MagmaInputTextarea,
    MagmaLimitFocusDirective,
    MagmaLimitFocusFirstDirective,
    MagmaTabsModule,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-limit-focus',
    templateUrl: './demo-limit-focus.component.html',
    styleUrl: './demo-limit-focus.component.scss',
    imports: [
        CodeTabsComponent,
        MagmaLimitFocusDirective,
        MagmaLimitFocusFirstDirective,
        MagmaInput,
        MagmaInputText,
        MagmaInputTextarea,
        MagmaInputElement,
        MagmaBlock,
        MagmaDialog,
        MagmaTabsModule,
    ],
})
export class DemoLimitFocusComponent {
    limitFocus = viewChild.required(MagmaLimitFocusDirective);

    codeHtml = ``;
    codeCss = `.hide {
    display: none;
}
.hidden {
    visibility: hidden;
}`;
    codeTs = `import { MagmaLimitFocusDirective, MagmaLimitFocusFirstDirective } from '@ikilote/magma';

@Component({
    selector: 'demo-test',
    templateUrl: './demo-test.component.html',
    styleUrl: './demo-test.component.scss',
    imports: [MagmaLimitFocusDirective, MagmaLimitFocusFirstDirective],
})
export class TestComponent { }`;

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
                tag: 'div',
                attrs: {
                    limitFocus: null,
                    '#limit': 'limitFocus',
                },
                body: [
                    {
                        tag: 'p',
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
                        ],
                    },
                    { emptyLine: 1 },
                    {
                        tag: 'p',
                        body: [
                            {
                                tag: 'mg-input',
                                body: [
                                    { tag: 'mg-input-label', body: 'Test 5', inline: true },
                                    { tag: 'mg-input-text' },
                                ],
                            },
                        ],
                    },
                    { emptyLine: 1 },
                    {
                        tag: 'p',
                        body: [
                            {
                                tag: 'mg-input',
                                body: [
                                    { tag: 'mg-input-label', body: 'Test 6', inline: true },
                                    { tag: 'mg-input-textarea' },
                                ],
                            },
                            {
                                tag: 'button',
                                body: 'Test 7',
                                attrs: { tabIndex: '-1' },
                                inline: true,
                            },
                            {
                                tag: 'button',
                                body: 'Test 8',
                                attrs: { class: 'hidden' },
                                inline: true,
                            },
                        ],
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
