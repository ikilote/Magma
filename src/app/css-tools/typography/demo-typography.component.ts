import { Component } from '@angular/core';

import { MagmaTypographyEditor } from '../../../../projects/ikilote/magma/src/lib/components/css-var-editor/editors/typography-editor.component';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-typography',
    templateUrl: './demo-typography.component.html',
    styleUrl: './demo-typography.component.scss',
    imports: [MagmaTypographyEditor, CodeTabsComponent],
})
export class DemoTypographyComponent {
    codeHtml = `<mg-typography-editor (valueChange)="onTypography($event)" />`;
    codeTs = `import { MagmaTypographyEditor } from '@ikilote/magma';

@Component({
    imports: [MagmaTypographyEditor],
})
export class MyComponent {
    onTypography(value: string) {
        console.log(value);
    }
}`;
}
