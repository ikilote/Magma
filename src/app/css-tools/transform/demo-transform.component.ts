import { Component } from '@angular/core';

import { MagmaTransformEditor } from '../../../../projects/ikilote/magma/src/lib/components/css-var-editor/editors/transform-editor.component';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-transform',
    templateUrl: './demo-transform.component.html',
    styleUrl: './demo-transform.component.scss',
    imports: [MagmaTransformEditor, CodeTabsComponent],
})
export class DemoTransformComponent {
    codeHtml = `<mg-transform-editor (valueChange)="onTransform($event)" />`;
    codeTs = `import { MagmaTransformEditor } from '@ikilote/magma';

@Component({
    imports: [MagmaTransformEditor],
})
export class MyComponent {
    onTransform(value: string) {
        console.log(value);
    }
}`;
}
