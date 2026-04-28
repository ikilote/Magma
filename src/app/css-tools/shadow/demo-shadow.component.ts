import { Component } from '@angular/core';

import { MagmaShadowEditor } from '../../../../projects/ikilote/magma/src/lib/components/css-var-editor/editors/shadow-editor.component';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-shadow',
    templateUrl: './demo-shadow.component.html',
    styleUrl: './demo-shadow.component.scss',
    imports: [MagmaShadowEditor, CodeTabsComponent],
})
export class DemoShadowComponent {
    codeHtml = `<mg-shadow-editor (valueChange)="onShadow($event)" />`;
    codeTs = `import { MagmaShadowEditor } from '@ikilote/magma';

@Component({
    imports: [MagmaShadowEditor],
})
export class MyComponent {
    onShadow(value: string) {
        console.log(value);
    }
}`;
}
