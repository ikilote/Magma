import { Component } from '@angular/core';

import { MagmaColorMixEditor } from '../../../../projects/ikilote/magma/src/lib/components/css-var-editor/editors/color-mix-editor.component';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-color-mix',
    templateUrl: './demo-color-mix.component.html',
    styleUrl: './demo-color-mix.component.scss',
    imports: [MagmaColorMixEditor, CodeTabsComponent],
})
export class DemoColorMixComponent {
    codeHtml = `<mg-color-mix-editor (valueChange)="onColorMix($event)" />`;
    codeTs = `import { MagmaColorMixEditor } from '@ikilote/magma';

@Component({
    imports: [MagmaColorMixEditor],
})
export class MyComponent {
    onColorMix(value: string) {
        console.log(value);
    }
}`;
}
