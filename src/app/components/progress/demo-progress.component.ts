import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2Js, Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';
import {
    FileSizePipeParams,
    FormBuilderExtended,
    MagmaInput,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputSelect,
    MagmaInputText,
    MagmaProgress,
    MagmaTableModule,
    MagmaTabsModule,
    ProgressDisplayFormat,
} from '@ikilote/magma';

import { Select2Data } from 'ng-select2-component';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-progress',
    templateUrl: './demo-progress.component.html',
    styleUrl: './demo-progress.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        CodeTabsComponent,
        ReactiveFormsModule,
        MagmaProgress,
        MagmaInput,
        MagmaInputSelect,
        MagmaInputElement,
        MagmaInputNumber,
        MagmaInputText,
        MagmaTabsModule,
        MagmaTableModule,
    ],
})
export class DemoProgressComponent {
    readonly fb = inject(FormBuilderExtended);

    displayFormatData: Select2Data = [
        { label: 'size (default)', value: 'size' },
        { label: 'percent', value: 'percent' },
        { label: 'raw', value: 'raw' },
    ];

    sizeFormatData: Select2Data = [
        { label: 'undefined', value: {} },
        { label: "{ format: 'decimal' }", value: { format: 'decimal' } },
        {
            label: "{ language: 'fr', translate: { unitTableBinary: [' o', ' Kio', ' Mio', ' Gio', ' Tio'] }",
            value: { language: 'fr', translate: { unitTableBinary: [' o', ' Kio', ' Mio', ' Gio', ' Tio'] } },
        },
    ];

    ctrlForm: FormGroup<{
        loaded: FormControl<number>;
        total: FormControl<number>;
        displayFormat: FormControl<ProgressDisplayFormat>;
        unit: FormControl<string>;
        numberFormatPattern: FormControl<string>;
        numberFormatDecimalSymbol: FormControl<string>;
        numberFormatSeparator: FormControl<string>;
        sizeFormat: FormControl<FileSizePipeParams>;
    }>;

    codeHtml = '';

    codeTs = `import { MagmaProgress } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    styleUrl: './my-component.component.scss',
    imports: [
        MagmaProgress
    ],
})
export class DemoProgressComponent {
}`;

    constructor() {
        this.ctrlForm = this.fb.groupWithError({
            loaded: { default: 0, emptyOnInit: true },
            total: { default: 0, emptyOnInit: true },
            displayFormat: { default: 'size' as ProgressDisplayFormat, emptyOnInit: true },
            unit: { default: '', emptyOnInit: true },
            numberFormatPattern: { default: '#,###', emptyOnInit: true },
            numberFormatDecimalSymbol: { default: '', emptyOnInit: true },
            numberFormatSeparator: { default: '', emptyOnInit: true },
            sizeFormat: { default: {} as FileSizePipeParams, emptyOnInit: true },
        });
        this.codeGeneration();
        this.ctrlForm.valueChanges.subscribe(() => {
            this.codeGeneration();
        });
    }

    codeGeneration() {
        // tag root

        const json: Json2htmlRef = {
            tag: 'mg-progress',
            attrs: {},
        };
        const attrs: Json2htmlAttr = json.attrs!;

        // tag attr

        const value = this.ctrlForm.value;

        if (value.loaded || value.loaded === 0) {
            attrs['loaded'] = value.loaded;
        }
        if (value.total) {
            attrs['total'] = value.total;
        }
        if (value.displayFormat && value.displayFormat !== 'size') {
            attrs['displayFormat'] = value.displayFormat;
        }
        if (value.unit) {
            attrs['unit'] = value.unit;
        }
        if (value.displayFormat === 'percent' || value.displayFormat === 'raw') {
            if (value.numberFormatPattern && value.numberFormatPattern !== '#,###') {
                attrs['numberFormatPattern'] = value.numberFormatPattern;
            }
            if (value.numberFormatDecimalSymbol) {
                attrs['numberFormatDecimalSymbol'] = value.numberFormatDecimalSymbol;
            }
            if (value.numberFormatSeparator) {
                attrs['numberFormatSeparator'] = value.numberFormatSeparator;
            }
        }
        if (
            (value.displayFormat === 'size' || !value.displayFormat) &&
            value.sizeFormat &&
            ('format' in value.sizeFormat || 'language' in value.sizeFormat)
        ) {
            attrs['sizeFormat'] = new Json2Js(value.sizeFormat, { tabAddedExceptFirst: true, tabAdded: 1 })
                .toString()
                .replaceAll('"', "'");
        }
        this.codeHtml = new Json2html(json).toString();
    }
}
