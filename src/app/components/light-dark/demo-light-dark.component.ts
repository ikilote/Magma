import { Component } from '@angular/core';

import { MagmaLightDark } from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-light-dark',
    templateUrl: './demo-light-dark.component.html',
    styleUrls: ['./demo-light-dark.component.scss'],
    imports: [MagmaLightDark, CodeTabsComponent],
})
export class DemoLightDarkComponent {
    codeHtml = '<mg-light-dark />';
    codeHtmlCompact = '<mg-light-dark compact />';

    codeTs = `import { MagmaLightDark } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    styleUrls: ['./my-component.component.scss'],
    imports: [
        MagmaLightDark
    ],
})
export class DemoLightDarkComponent {
}`;

    codeTsService = `import { LightDark } from '@ikilote/magma';

@Component({
    ...
})
export class DemoLightDarkComponent {
    private readonly lightDark = inject(LightDark);

    constructor() {
        // with browser preference
        this.lightDark.init();

        // with user preference
        this.lightDark.init('dark');
    }
}`;
}
