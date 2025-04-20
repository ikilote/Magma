import { Component } from '@angular/core';

import { MagmaBlock, MagmaWalkthrough, MagmaWalkthroughStep } from '../../../../projects/ikilote/magma/src/public-api';

@Component({
    selector: 'demo-walkthrough',
    templateUrl: './demo-walkthrough.component.html',
    styleUrls: ['./demo-walkthrough.component.scss'],
    imports: [MagmaWalkthrough, MagmaWalkthroughStep, MagmaBlock],
})
export class DemoWalkthroughComponent {
    alert(e: string) {
        alert(e);
    }
}
