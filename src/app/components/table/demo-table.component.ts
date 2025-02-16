import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlRef } from '@ikilote/json2html';
import { FormBuilderExtended } from '@ikilote/magma';

import { MagmaTableComponent } from '../../../../projects/ikilote/magma/src/lib/components/table/table.component';
import { MagmaInput, MagmaInputCheckbox } from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-table',
    templateUrl: './demo-table.component.html',
    styleUrls: ['./demo-table.component.scss'],
    imports: [MagmaTableComponent, ReactiveFormsModule, MagmaInput, MagmaInputCheckbox, CodeTabsComponent],
})
export class DemoTableComponent {
    readonly fbe = inject(FormBuilderExtended);

    form: FormGroup<{
        col: FormControl<boolean>;
        row: FormControl<boolean>;
        hover: FormControl<boolean>;
        hoverCell: FormControl<boolean>;
        hoverRow: FormControl<boolean>;
        hoverCol: FormControl<boolean>;
        sticky: FormControl<boolean>;
    }>;
    codeHtml = '';

    constructor() {
        this.form = this.fbe.groupWithErrorNonNullable({
            col: { default: false },
            row: { default: false },
            hover: { default: false },
            hoverCell: { default: false },
            hoverRow: { default: false },
            hoverCol: { default: false },
            sticky: { default: false },
        });

        this.form.valueChanges.subscribe(() => {
            this.updateHtml();
        });
        this.updateHtml();
    }

    updateHtml() {
        const json: Json2htmlRef = {
            tag: 'table',
            attrs: {
                mg: null,
                hover: this.form.value.hover ? null : undefined,
                hoverRow: this.form.value.hoverRow ? null : undefined,
                hoverCol: this.form.value.hoverCol ? null : undefined,
                hoverCell: this.form.value.hoverCell ? null : undefined,
            },
            body: [
                {
                    tag: 'thead',
                    attrs: { mg: null, sticky: this.form.value.sticky ? null : undefined },
                    body: [
                        {
                            tag: 'tr',
                            attrs: { mg: null },
                            body: [
                                ...[
                                    {
                                        tag: 'th',
                                        attrs: { mg: null },
                                        body: 'Test 1',
                                    },
                                    {
                                        tag: 'th',
                                        attrs: { mg: null },
                                        body: 'Test 2',
                                    },
                                    {
                                        tag: 'th',
                                        attrs: { mg: null },
                                        body: 'Test 3',
                                    },
                                ],
                                ...(this.form.value.col
                                    ? [
                                          {
                                              tag: 'th',
                                              attrs: { mg: null },
                                              body: 'Test 4',
                                          },
                                      ]
                                    : []),
                                ...[
                                    {
                                        tag: 'th',
                                        attrs: { mg: null },
                                        body: 'Test 5',
                                    },
                                ],
                            ],
                        },
                    ],
                },
                {
                    tag: 'tbody',
                    attrs: { mg: null },
                    body: [
                        {
                            tag: 'tr',
                            attrs: { mg: null },
                            body: [
                                ...[
                                    {
                                        tag: 'td',
                                        attrs: { mg: null },
                                        body: 'Test La test<br />dede',
                                    },
                                    {
                                        tag: 'td',
                                        attrs: { mg: null },
                                        body: 'Test',
                                    },
                                    {
                                        tag: 'td',
                                        attrs: { mg: null },
                                        body: 'Test',
                                    },
                                ],
                                ...(this.form.value.col
                                    ? [
                                          {
                                              tag: 'th',
                                              attrs: { mg: null },
                                              body: 'Test',
                                          },
                                      ]
                                    : []),
                                ...[
                                    {
                                        tag: 'td',
                                        attrs: { mg: null },
                                        body: 'Test',
                                    },
                                ],
                            ],
                        },
                        '...',
                    ],
                },
                {
                    tag: 'tfoot',
                    attrs: { mg: null },
                    body: ['...'],
                },
            ],
        };

        this.codeHtml = new Json2html(json).toString();
    }
}
