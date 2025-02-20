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
    codeHtml = '<mg-light-dark></mg-light-dark>';
    codeHtmlCompact = '<mg-light-dark compact></mg-light-dark>';

    codeTsService = `private readonly lightDark = inject(LightDark);

constructor() {
    // with browser preference
    this.lightDark.init();

    // with user preference
    this.lightDark.init('dark');
}`;
}
