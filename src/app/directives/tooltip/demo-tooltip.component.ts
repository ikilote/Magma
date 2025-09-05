import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';

import {
    FormBuilderExtended,
    MagmaInput,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputText,
    MagmaTooltipDirective,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-tooltip',
    templateUrl: './demo-tooltip.component.html',
    styleUrls: ['./demo-tooltip.component.scss'],
    imports: [
        ReactiveFormsModule,
        MagmaTooltipDirective,
        CodeTabsComponent,
        MagmaInput,
        MagmaInputText,
        MagmaInputNumber,
        MagmaInputElement,
    ],
})
export class DemoTooltipComponent {
    readonly fb = inject(FormBuilderExtended);

    codeHtml = ``;

    codeTs = `import { MagmaTooltipDirective } from '@ikilote/magma';

@Component({
    selector: 'demo-test',
    templateUrl: './demo-test.component.html',
    styleUrls: ['./demo-test.component.scss'],
    imports: [MagmaTooltipDirective],
})
export class TestComponent {}`;

    events = ``;

    items: number[] = [];

    ctrlForm: FormGroup<{
        text: FormControl<string>;
        mgTooltipEntryDelay: FormControl<number>;
        mgTooltipDisplayDelay: FormControl<number>;
    }>;

    constructor() {
        this.ctrlForm = this.fb.groupWithErrorNonNullable({
            text: { default: 'text' },
            mgTooltipEntryDelay: { default: '' },
            mgTooltipDisplayDelay: { default: '' },
        });
        this.codeGeneration();
        this.ctrlForm.valueChanges.subscribe(() => {
            this.codeGeneration();
        });
    }

    codeGeneration() {
        // tag root

        const json: Json2htmlRef = {
            tag: 'button',
            attrs: {
                mgTooltip: this.ctrlForm.value.text,
            },
            body: 'Example',
        };
        const attrs: Json2htmlAttr = json.attrs!;

        // tag attr

        if (this.ctrlForm.value.mgTooltipEntryDelay || this.ctrlForm.value.mgTooltipEntryDelay === 0) {
            attrs['mgTooltipEntryDelay'] = this.ctrlForm.value.mgTooltipEntryDelay;
        }

        if (this.ctrlForm.value.mgTooltipDisplayDelay || this.ctrlForm.value.mgTooltipDisplayDelay === 0) {
            attrs['mgTooltipDisplayDelay'] = this.ctrlForm.value.mgTooltipDisplayDelay;
        }

        this.codeHtml = new Json2html(json).toString();
    }
}
