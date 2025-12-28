import { Component } from '@angular/core';

import { FileSizePipe } from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-file-size',
    templateUrl: './demo-file-size.component.html',
    styleUrl: './demo-file-size.component.scss',
    imports: [CodeTabsComponent, FileSizePipe],
})
export class DemoFileSizeComponent {
    default = `
Default:
{{ 150 | fileSize }}
{{ 15400 | fileSize }}
{{ 155566400 | fileSize }}
{{ 566155566400 | fileSize }}

Format: decimal
{{ 150 | fileSize: { format: 'decimal' } }}
{{ 15400 | fileSize: { format: 'decimal' } }}
{{ 155566400 | fileSize: { format: 'decimal' } }}
{{ 566155566400 | fileSize: { format: 'decimal' } }}

Language: 'fr'
{{ 150 | fileSize: { language: 'fr', translate: { unitTableBinary: [' o', ' Kio', ' Mio', ' Gio', ' Tio'] } } }}
{{ 15400 | fileSize: { language: 'fr', translate: { unitTableBinary: [' o', ' Kio', ' Mio', ' Gio', ' Tio'] } } }}
{{ 155566400 | fileSize: { language: 'fr', translate: { unitTableBinary: [' o', ' Kio', ' Mio', ' Gio', ' Tio'] } } }}
{{ 566155566400  | fileSize: { language: 'fr', translate: { unitTableBinary: [' o', ' Kio', ' Mio', ' Gio', ' Tio'] } } }}
`;
    codeTs = `import { MathPipe } from '@ikilote/magma';

@Component({
    selector: 'demo-test',
    templateUrl: './demo-test.component.html',
    styleUrl: './demo-test.component.scss',
    imports: [MathPipe],
})
export class TestComponent {}`;
}
