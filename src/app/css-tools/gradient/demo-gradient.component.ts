import { Component } from '@angular/core';

import { MagmaGradientEditor } from '../../../../projects/ikilote/magma/src/lib/components/css-var-editor/editors/gradient-editor.component';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-gradient',
    templateUrl: './demo-gradient.component.html',
    styleUrl: './demo-gradient.component.scss',
    imports: [MagmaGradientEditor, CodeTabsComponent],
})
export class DemoGradientComponent {
    codeHtml = `<mg-gradient-editor (valueChange)="onGradient($event)" />`;
    codeTs = `import { MagmaGradientEditor } from '@ikilote/magma';

@Component({
    imports: [MagmaGradientEditor],
})
export class MyComponent {
    onGradient(value: string) {
        console.log(value);
    }
}`;
}
