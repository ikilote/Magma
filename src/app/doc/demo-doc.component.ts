import { Component } from '@angular/core';

import { MarkdownComponent } from 'ngx-markdown';

@Component({
    selector: 'demo-doc',
    templateUrl: './demo-doc.component.html',
    styleUrls: ['./demo-doc.component.scss'],
    imports: [MarkdownComponent],
})
export class DemoDocComponent {
    data = ``;
}
