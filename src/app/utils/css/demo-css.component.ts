import { JsonPipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlRef } from '@ikilote/json2html';
import { FormBuilderExtended } from '@ikilote/magma';

import {
    MagmaInput,
    MagmaInputElement,
    MagmaInputText,
    getPaletteList,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-css',
    templateUrl: './demo-css.component.html',
    styleUrls: ['./demo-css.component.scss'],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CodeTabsComponent,
        MagmaInput,
        MagmaInputElement,
        MagmaInputText,
        JsonPipe,
    ],
})
export class DemoCSSComponent {
    readonly cd = inject(ChangeDetectorRef);
    readonly fb = inject(FormBuilderExtended);

    ctrlForm: FormGroup<{
        colorSeparator: FormControl<string>;
    }>;

    codeHtml = '';
    codeTs = '';
    palette = 'red, #FFF, #000';

    codeTsDefault = `getPaletteList({
    cssVar: '--my-palette',
    selector: '.test-palette',
    root: document.body,
    colorSeparator: /\s*,\s*/
})
      `;

    constructor() {
        this.ctrlForm = this.fb.groupWithErrorNonNullable({
            colorSeparator: { default: '/\\s*,\\s*/' },
        });

        this.ctrlForm.valueChanges.subscribe(() => {
            this.getPaletteList();
        });

        setTimeout(() => {
            this.update();
            this.cd.detectChanges();
        });
    }

    getPaletteList() {
        return getPaletteList({
            cssVar: '--my-palette',
            selector: '.test-palette',
            root: document.body,
            colorSeparator: this.ctrlForm.value.colorSeparator,
        });
    }

    update() {
        const json: Json2htmlRef = {
            tag: 'div',
            attrs: { class: 'test-palette', '[style.--my-palette]': this.palette },
            body: '...',
        };

        this.codeHtml = new Json2html(json).toString();
    }
}
