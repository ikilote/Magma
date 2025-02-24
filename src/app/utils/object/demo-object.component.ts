import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FormBuilderExtended } from '@ikilote/magma';

import {
    MagmaInput,
    MagmaInputElement,
    MagmaInputTextarea,
    objectNestedValue,
    objectsAreSame,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-object',
    templateUrl: './demo-object.component.html',
    styleUrls: ['./demo-object.component.scss'],
    imports: [CodeTabsComponent, ReactiveFormsModule, MagmaInput, MagmaInputTextarea, MagmaInputElement],
})
export class DemoObjectComponent {
    private readonly fbe = inject(FormBuilderExtended);

    readonly formCompare: FormGroup<{
        valueA: FormControl<string>;
        valueB: FormControl<string>;
    }>;

    readonly form: FormGroup<{
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

    valueC = ``;
    valuePath = ``;

    constructor() {
        this.formCompare = this.fbe.groupWithErrorNonNullable({
            valueA: { default: this.valueA },
            valueB: { default: this.valueB },
        });
        this.form = this.fbe.groupWithErrorNonNullable({
            valueC: { default: 'Test' },
            valuePath: { default: 'Test' },
        });

        this.objectsAreSame();
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

    objectNestedValue(a: string, path: string) {
        return objectNestedValue(JSON.parse(a), path);
    }
}
