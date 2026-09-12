import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-coercion',
    templateUrl: './demo-coercion.component.html',
    styleUrl: './demo-coercion.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [CodeTabsComponent],
})
export class DemoCoercionComponent {
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
