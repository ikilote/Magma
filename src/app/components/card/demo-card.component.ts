import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';
import {
    FormBuilderExtended,
    MagmaCard,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputSelect,
    MagmaInputText,
    MagmaTableModule,
    MagmaTabsModule,
    Select2Data,
} from '@ikilote/magma';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-card',
    templateUrl: './demo-card.component.html',
    styleUrl: './demo-card.component.scss',
    imports: [
        ReactiveFormsModule,
        CodeTabsComponent,
        MagmaCard,
        MagmaInput,
        MagmaInputElement,
        MagmaInputText,
        MagmaInputNumber,
        MagmaInputSelect,
        MagmaInputCheckbox,
        MagmaTabsModule,
        MagmaTableModule,
    ],
})
export class DemoCardComponent {
    readonly fb = inject(FormBuilderExtended);

    ctrlForm: FormGroup<{
        image: FormControl<string>;
        orientation: FormControl<string>;
        ratio: FormControl<string>;
        cardHeight: FormControl<number>;
        imgHeight: FormControl<string>;
        imageZoom: FormControl<boolean>;
    }>;

    orientation: Select2Data = [
        { value: 'horizontal', label: 'horizontal' },
        { value: 'vertical', label: 'vertical' },
    ];

    codeHtml = '';
    codeTs = `import { MagmaCard, MagmaCardHeaderDirective } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    imports: [MagmaCard, MagmaCardHeaderDirective],
})
export class MyComponent {}`;

    constructor() {
        this.ctrlForm = this.fb.groupWithError({
            image: { default: 'url(https://picsum.photos/400/300)' },
            orientation: { default: 'horizontal' },
            ratio: { default: '1 / 3' },
            cardHeight: { default: undefined as unknown as number },
            imgHeight: { default: '' },
            imageZoom: { default: false },
        });
        this.codeGeneration();
        this.ctrlForm.valueChanges.subscribe(() => {
            this.codeGeneration();
        });
    }

    codeGeneration() {
        const json: Json2htmlRef = {
            tag: 'mg-card',
            attrs: {},
            body: [],
        };
        const attrs: Json2htmlAttr = json.attrs!;
        const body: Json2htmlRef[] = json.body as Json2htmlRef[];

        if (this.ctrlForm.value.image) {
            attrs['[image]'] = `'${this.ctrlForm.value.image}'`;
        }
        if (this.ctrlForm.value.orientation !== 'horizontal') {
            attrs['orientation'] = this.ctrlForm.value.orientation;
        }
        if (this.ctrlForm.value.ratio !== '1 / 3') {
            attrs['ratio'] = this.ctrlForm.value.ratio;
        }
        if (this.ctrlForm.value.cardHeight) {
            attrs['cardHeight'] = this.ctrlForm.value.cardHeight;
        }
        if (this.ctrlForm.value.imgHeight) {
            attrs['ratio'] = this.ctrlForm.value.imgHeight;
        }
        if (this.ctrlForm.value.imageZoom) {
            attrs['imageZoom'] = null;
        }

        body.push(
            { tag: 'h3', attrs: { mgCardHeader: null }, body: 'Card title' },
            { tag: 'p', body: 'Card body content goes here.' },
        );

        this.codeHtml = new Json2html(json).toString();
    }
}
