import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';
import {
    FormBuilderExtended,
    MagmaDragScrollAxis,
    MagmaDragScrollDirective,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputSelect,
    MagmaInputText,
    MagmaTableModule,
    MagmaTabsModule,
} from '@ikilote/magma';

import { Select2Data } from 'ng-select2-component';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-drag-scroll',
    templateUrl: './demo-drag-scroll.component.html',
    styleUrl: './demo-drag-scroll.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ReactiveFormsModule,
        MagmaDragScrollDirective,
        MagmaInput,
        MagmaInputElement,
        MagmaInputNumber,
        MagmaInputCheckbox,
        MagmaInputSelect,
        MagmaInputText,
        MagmaTabsModule,
        MagmaTableModule,
        CodeTabsComponent,
    ],
})
export class DemoDragScrollComponent {
    private readonly fb = inject(FormBuilderExtended);

    ctrlForm: FormGroup<{
        disabled: FormControl<boolean>;
        axis: FormControl<MagmaDragScrollAxis>;
        threshold: FormControl<number>;
        cursor: FormControl<boolean>;
        ignore: FormControl<string>;
    }>;

    /** Dummy cells to fill the scrollable demo surfaces. */
    readonly cells = Array.from({ length: 60 }, (_, i) => i + 1);

    readonly axisData: Select2Data = [
        { value: 'both', label: 'both' },
        { value: 'x', label: 'x (horizontal)' },
        { value: 'y', label: 'y (vertical)' },
    ];

    codeHtml = '';

    codeTs = `import { MagmaDragScrollDirective } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    imports: [MagmaDragScrollDirective],
})
export class MyComponent {}`;

    codeCss = `.scroller {
    overflow: auto;
    width: 100%;
    max-height: 300px;
}`;

    constructor() {
        this.ctrlForm = this.fb.groupWithError({
            disabled: { default: false },
            axis: { default: 'both' as MagmaDragScrollAxis },
            threshold: { default: 5 },
            cursor: { default: false },
            ignore: { default: '' },
        });

        effect(() => this.codeGeneration());
        this.ctrlForm.valueChanges.subscribe(() => this.codeGeneration());
    }

    codeGeneration(): void {
        const v = this.ctrlForm.value;
        const json: Json2htmlRef = {
            tag: 'div',
            attrs: { class: 'scroller', mgDragScroll: null },
            body: [
                { tag: 'div', attrs: { class: 'cell', id: 'cell-1' }, inline: true },
                { tag: 'div', attrs: { class: 'cell', id: 'cell-2' }, inline: true },
                { tag: 'div', attrs: { class: 'cell', id: 'cell-3' }, inline: true },
                '...',
                { tag: 'div', attrs: { class: 'cell', id: 'cell-60' }, inline: true },
            ],
        };
        const attrs: Json2htmlAttr = json.attrs!;

        if (v.disabled) {
            attrs['mgDragScrollDisabled'] = null;
        }
        if (v.axis && v.axis !== 'both') {
            attrs['[mgDragScrollAxis]'] = `${v.axis}`;
        }
        if (v.threshold != null && v.threshold !== 5) {
            attrs['mgDragScrollThreshold'] = v.threshold;
        }
        if (v.cursor) {
            attrs['mgDragScrollCursor'] = null;
        }
        if (v.ignore) {
            attrs['mgDragScrollIgnore'] = v.ignore;
        }

        this.codeHtml = new Json2html(json).toString();
    }
}
