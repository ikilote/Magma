import { Component } from '@angular/core';

import { MarkdownComponent } from 'ngx-markdown';

@Component({
    selector: 'demo-doc',
    templateUrl: './demo-doc.component.html',
    styleUrl: './demo-doc.component.scss',
    imports: [MarkdownComponent],
})
export class DemoDocComponent {
    data = ``;
}
