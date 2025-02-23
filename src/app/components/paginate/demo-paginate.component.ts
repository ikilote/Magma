import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';

import {
    FormBuilderExtended,
    MagmaInput,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputText,
    MagmaPaginationComponent,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-paginate',
    templateUrl: './demo-paginate.component.html',
    styleUrls: ['./demo-paginate.component.scss'],
    imports: [
        CodeTabsComponent,
        ReactiveFormsModule,
        MagmaPaginationComponent,
        MagmaInput,
        MagmaInputElement,
        MagmaInputText,
        MagmaInputNumber,
    ],
})
export class DemoPaginateComponent {
    readonly fb = inject(FormBuilderExtended);

    ctrlForm: FormGroup<{
        linkId: FormControl<string>;
        page: FormControl<number>;
        total: FormControl<number>;
        base: FormControl<string>;
        size: FormControl<number>;
        queryParams: FormControl<string>;
        start: FormControl<number>;
        middleStart: FormControl<number>;
        middleEnd: FormControl<number>;
        end: FormControl<number>;
    }>;

    codeHtml = '';

    constructor() {
        this.ctrlForm = this.fb.groupWithErrorNonNullable({
            linkId: { default: 'test' },
            page: { default: 1 },
            total: { default: 5000 },
            base: { default: '/component/paginate' },
            size: { default: 25 },
            queryParams: { default: true },
            start: { default: 1 },
            middleStart: { default: 3 },
            middleEnd: { default: 3 },
            end: { default: 1 },
        });
        this.codeGeneration();
        this.ctrlForm.valueChanges.subscribe(() => {
            this.codeGeneration();
        });
    }

    codeGeneration() {
        // tag root

        const json: Json2htmlRef = {
            tag: 'mg-paginate',
            attrs: {},
        };
        const attrs: Json2htmlAttr = json.attrs!;

        // tag attr

        const value = this.ctrlForm.value;

        if (value.linkId) {
            attrs['linkId'] = value.linkId;
        }
        if (value.page) {
            attrs['page'] = value.page;
        }
        if (value.total) {
            attrs['total'] = value.total;
        }
        if (value.base) {
            attrs['base'] = value.base;
        }
        if (value.size) {
            attrs['size'] = value.size;
        }
        if (value.start) {
            attrs['start'] = value.start;
        }
        if (value.middleStart) {
            attrs['middleStart'] = value.middleStart;
        }
        if (value.middleEnd) {
            attrs['middleEnd'] = value.middleEnd;
        }
        if (value.end) {
            attrs['end'] = value.end;
        }
        this.codeHtml = new Json2html({
            tag: 'div',
            attrs: {},
            body: [
                json,
                {
                    tag: 'p',
                    body: '...',
                },
                json,
            ],
        }).toString();
    }
}
