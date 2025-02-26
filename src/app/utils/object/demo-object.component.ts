import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import {
    FormBuilderExtended,
    MagmaInput,
    MagmaInputElement,
    MagmaInputText,
    MagmaInputTextarea,
    objectNestedValue,
    objectsAreSame,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-object',
    templateUrl: './demo-object.component.html',
    styleUrls: ['./demo-object.component.scss'],
    imports: [
        CodeTabsComponent,
        ReactiveFormsModule,
        MagmaInput,
        MagmaInputText,
        MagmaInputTextarea,
        MagmaInputElement,
    ],
})
export class DemoObjectComponent {
    private readonly fbe = inject(FormBuilderExtended);

    readonly formCompare: FormGroup<{
        valueA: FormControl<string>;
        valueB: FormControl<string>;
    }>;

    readonly formGet: FormGroup<{
        valueC: FormControl<string>;
        valuePath: FormControl<string>;
    }>;

    codeTs = `@Component({ ... })
export class TestComponent {
    errorA = '';
    errorB = '';
    state = false;

    objectsAreSame(valueA : any, valueB: any) {
        this.errorA = '';
        this.errorB = '';

        try {
            valueA = JSON.parse(this.formCompare.value.valueA!);
        } catch (e) {
            const error = e as any;
            this.errorA = error.message;
            this.state = false;
        }
        try {
            valueB = JSON.parse(this.formCompare.value.valueB!);
        } catch (e) {
            const error = e as any;
            this.errorB = error.message;
            this.state = false;
        }

        this.state = objectsAreSame(valueA, valueB);
    }
}`;

    valueA = `{
    "a" : 10,
    "c": [1, 10, 569, 5],
    "b": "a",
    "d": {
        "a": 150,
        "b": { "a" : 150},
        "A": [10, 5, 12],
        "B": { "A" : 100}
    }
}`;
    valueB = `{
    "a" : 10,
    "b": "a",
    "c": [1, 10, 569, 5],
    "d": {
        "a": 150,
        "A": [12, 10, 5],
        "b": { "a" : 150},
        "B": { "A" : 100}
    }
}`;

    errorA = ``;
    errorB = ``;
    state = false;

    codeTsGet = `@Component({ ... })
export class TestComponent {
    errorC = '';
    value: any;

    objectNestedValue(value : any, path: (string | number)[] | string) {
        let value = {};
        this.errorC = '';

        try {
            value = JSON.parse(value);
        } catch (e) {
            const error = e as any;
            this.value = error.message;
            this.state = false;
        }

        this.value = objectNestedValue(value, path);
    }
}`;

    valueC = `{
    "a" : 10,
    "c": [1, 10, 569, 5],
    "b": "a",
    "d": {
        "a": 150,
        "b": { "a" : 150},
        "A": [10, 5, 12],
        "B": { "A" : 100}
    }
}`;
    valuePath = `d.A.1`;
    errorC = ``;
    value: any;

    constructor() {
        this.formCompare = this.fbe.groupWithErrorNonNullable({
            valueA: { default: this.valueA },
            valueB: { default: this.valueB },
        });
        this.formGet = this.fbe.groupWithErrorNonNullable({
            valueC: { default: this.valueC },
            valuePath: { default: this.valuePath },
        });

        this.objectsAreSame();
        this.objectNestedValue();
    }

    objectsAreSame() {
        let valueA = {};
        let valueB = {};
        this.errorA = ``;
        this.errorB = ``;

        try {
            valueA = JSON.parse(this.formCompare.value.valueA!);
        } catch (e) {
            const error = e as any;
            // if (error.columnNumber || error.lineNumber) {
            //     error.message.match(/.*line (\d+) column (\d+).*/);
            // }
            this.errorA = error.message;
            this.state = false;
        }
        try {
            valueB = JSON.parse(this.formCompare.value.valueB!);
        } catch (e) {
            const error = e as any;
            this.errorB = error.message;
            this.state = false;
        }

        this.state = objectsAreSame(valueA, valueB);
    }

    objectNestedValue() {
        let valueC = {};
        this.errorC = ``;

        try {
            valueC = JSON.parse(this.formGet.value.valueC!);
        } catch (e) {
            const error = e as any;
            this.valueC = error.message;
            this.state = false;
        }

        this.value = objectNestedValue(valueC, this.formGet.value.valuePath || '');
    }
}
