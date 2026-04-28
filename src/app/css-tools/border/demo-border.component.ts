import { Component } from '@angular/core';

import { MagmaBorderEditor } from '../../../../projects/ikilote/magma/src/lib/components/css-var-editor/editors/border-editor.component';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-border',
    templateUrl: './demo-border.component.html',
    styleUrl: './demo-border.component.scss',
    imports: [MagmaBorderEditor, CodeTabsComponent],
})
export class DemoBorderComponent {
    codeHtml = `<mg-border-editor (valueChange)="onBorder($event)" />`;
    codeTs = `import { MagmaBorderEditor } from '@ikilote/magma';

@Component({
    imports: [MagmaBorderEditor],
})
export class MyComponent {
    onBorder(value: string) {
        console.log(value);
    }
}`;
}
