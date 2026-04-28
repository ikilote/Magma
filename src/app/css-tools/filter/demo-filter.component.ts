import { Component } from '@angular/core';

import { MagmaFilterEditor } from '../../../../projects/ikilote/magma/src/lib/components/css-var-editor/editors/filter-editor.component';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-filter',
    templateUrl: './demo-filter.component.html',
    styleUrl: './demo-filter.component.scss',
    imports: [MagmaFilterEditor, CodeTabsComponent],
})
export class DemoFilterComponent {
    codeHtml = `<mg-filter-editor (valueChange)="onFilter($event)" />`;
    codeTs = `import { MagmaFilterEditor } from '@ikilote/magma';

@Component({
    imports: [MagmaFilterEditor],
})
export class MyComponent {
    onFilter(value: string) {
        console.log(value);
    }
}`;
}
