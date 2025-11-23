import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import {
    FormBuilderExtended,
    MagmaInput,
    MagmaInputElement,
    MagmaInputText,
    MagmaInputTextarea,
    objectAssignNested,
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
        JsonPipe,
    ],
})
export class DemoObjectComponent {
    private readonly fbe = inject(FormBuilderExtended);

    // ------------------------------- objectsAreSame ---------------------------------------

    readonly formCompare: FormGroup<{
        valueA: FormControl<string>;
        valueB: FormControl<string>;
    }>;

    codeTs = `import { objectsAreSame } from '@ikilote/magma';

@Component({ ... })
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

        if (!this.errorA && !this.errorB) {
            this.state = objectsAreSame(valueA, valueB);
        }
    }
}`;

    valueA = `{
    "a" : 10,
    "c": [ 1, 10, 569, 5 ],
    "b": "a",
    "d": {
        "a": 150,
        "b": { "a" : 150},
        "A": [ 10, 5, 12 ],
        "B": { "A" : 100}
    }
}`;
    valueB = `{
    "a" : 10,
    "b": "a",
    "c": [ 1, 10, 569, 5 ],
    "d": {
        "a": 150,
        "A": [ 12, 10, 5 ],
        "b": { "a" : 150},
        "B": { "A" : 100}
    }
}`;

    errorA = ``;
    errorB = ``;
    state = false;

    // -------------------------------  objectNestedValue ---------------------------------------

    readonly formGet: FormGroup<{
        valueC: FormControl<string>;
        valuePath: FormControl<string>;
    }>;

    codeTsGet = `@Component({ ... })
export class TestComponent {
    errorC = '';
    value: any;

    objectNestedValue(value : any, path: (string | number)[] | string) {
        let value = {};
        this.errorC = '';

        try {
            valueC = JSON.parse(this.formGet.value.valueC!);
        } catch (e) {
            const error = e as any;
            this.errorC = error.message;
        }

        if (!this.errorC) {
            this.value = objectNestedValue(valueC, this.formGet.value.valuePath || '');
        }
    }
}`;

    valueC = `{
    "a" : 10,
    "c": [ 1, 10, 569, 5 ],
    "b": "a",
    "d": {
        "a": 150,
        "b": { "a" : 150 },
        "A": [ 10, 5, 12 ],
        "B": { "A" : 100 }
    }
}`;
    valuePath = `d.A.1`;
    errorC = ``;
    value: any;

    // ------------------------------- objectAssignNested ---------------------------------------

    readonly formAssign: FormGroup<{
        valueD: FormControl<string>;
        valueE: FormControl<string>;
    }>;

    codeTsAssign = `@Component({ ... })
export class TestComponent {
    errorD = '';
    errorE = '';
    assign: any;

    objectAssignNested() {
        let valueD = {};
        let valueE = {};
        this.errorD = '';
        this.errorE = '';

        try {
            valueD = JSON.parse(this.formAssign.value.valueD!);
        } catch (e) {
            const error = e as any;
            this.errorD = error.message;
        }

        try {
            valueE = JSON.parse(this.formAssign.value.valueE!);
        } catch (e) {
            const error = e as any;
            this.errorE = error.message;
        }

        this.assign = objectAssignNested(valueD, valueE);
    }
}`;

    valueD = `{
    "a" : 10,
    "c": [ 1, 10, 569, 5 ],
    "b": "a",
    "d": {
        "a": 150,
        "b": { "a" : 150 },
        "A": [ 10, 5, 12 ],
        "B": { "A" : 100 }
    }
}`;

    valueE = `{
    "a" : 10,
    "c": "test",
    "b": "a",
    "d": {
        "a": [ "a", "b", "c" ],
        "b": { "b" : 180 },
        "A": [ 6, 7, 8, 9, 10 ],
        "B": { "A" : 100 }
    }
}`;
    errorD = ``;
    errorE = ``;
    assign: any;

    // -------------------------------------------------------------------------------------------

    constructor() {
        this.formCompare = this.fbe.groupWithError({
            valueA: { default: this.valueA },
            valueB: { default: this.valueB },
        });
        this.formGet = this.fbe.groupWithError({
            valueC: { default: this.valueC },
            valuePath: { default: this.valuePath },
        });
        this.formAssign = this.fbe.groupWithError({
            valueD: { default: this.valueD },
            valueE: { default: this.valueE },
        });

        this.objectsAreSame();
        this.objectNestedValue();
        this.objectAssignNested();
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

        if (!this.errorA && !this.errorB) {
            this.state = objectsAreSame(valueA, valueB);
        }
    }

    objectNestedValue() {
        let valueC = {};
        this.errorC = ``;

        try {
            valueC = JSON.parse(this.formGet.value.valueC!);
        } catch (e) {
            const error = e as any;
            this.errorC = error.message;
        }

        if (!this.errorC) {
            this.value = objectNestedValue(valueC, this.formGet.value.valuePath || '');
        }
    }

    objectAssignNested() {
        let valueD = {};
        let valueE = {};
        this.errorD = ``;
        this.errorE = ``;

        try {
            valueD = JSON.parse(this.formAssign.value.valueD!);
        } catch (e) {
            const error = e as any;
            this.errorD = error.message;
        }

        try {
            valueE = JSON.parse(this.formAssign.value.valueE!);
        } catch (e) {
            const error = e as any;
            this.errorE = error.message;
        }

        this.assign = objectAssignNested(valueD, valueE);
    }
}
