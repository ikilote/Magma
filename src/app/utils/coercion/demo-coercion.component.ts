import { Component } from '@angular/core';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-coercion',
    templateUrl: './demo-coercion.component.html',
    styleUrl: './demo-coercion.component.scss',
    imports: [CodeTabsComponent],
})
export class DemoCoercionComponent {
    codeTs = `import { numberAttributeOrUndefined } from '@ikilote/magma';

@Component({ ... })
export class TestComponent {
    // number or undefined if input is empty
    readonly maxlength = input(undefined, { transform: numberAttributeOrUndefined });
}`;
}
