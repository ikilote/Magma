import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MagmaTableModule, arrayAttribute, numberAttributeOrUndefined } from '@ikilote/magma';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-coercion',
    templateUrl: './demo-coercion.component.html',
    styleUrl: './demo-coercion.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [CodeTabsComponent, MagmaTableModule],
})
export class DemoCoercionComponent {
    readonly numberExamples: { input: string; result: string }[] = [
        { input: '42', result: 42 },
        { input: "'42'", result: 42 },
        { input: "'3.14'", result: 3.14 },
        { input: "'0'", result: 0 },
        { input: "'100px'", result: '100px' },
        { input: "''", result: '' },
        { input: 'null', result: null },
        { input: 'undefined', result: undefined },
        { input: "'NaN'", result: NaN },
        { input: "'Infinity'", result: Infinity },
    ].map(v => ({ input: v.input, result: `${numberAttributeOrUndefined(v.result)}` }));

    readonly arrayExamples: { input: string; result: string }[] = [
        { input: "['a','b','c']", result: ['a', 'b', 'c'] },
        { input: '[]', result: [] },
        { input: '42', result: 42 as unknown as [] },
        { input: 'null', result: null },
        { input: 'undefined', result: undefined },
    ].map(v => ({ input: v.input, result: JSON.stringify(arrayAttribute(v.result)).replaceAll('"', "'") }));

    readonly codeTsNumberAttribute = `import { numberAttributeOrUndefined } from '@ikilote/magma';

@Component({ ... })
export class MyComponent {
    // number or undefined if input is empty / non-numeric
    readonly maxlength = input(undefined, { transform: numberAttributeOrUndefined });
}`;

    readonly codeTsArrayAttribute = `import { arrayAttribute } from '@ikilote/magma';

@Component({ ... })
export class MyComponent {
    // always a string[], never null or undefined
    readonly items = input([], { transform: arrayAttribute<string> });
}`;
}
