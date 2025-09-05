import { Component } from '@angular/core';

import { DemoInputAlignComponent } from './demo-input-align.component';
import { DemoInputErrorComponent } from './demo-input-error.component';
import { DemoInputGeneratorComponent } from './demo-input-generator.component';

import { MagmaTabContent, MagmaTabTitle, MagmaTabs } from '../../../../projects/ikilote/magma/src/public-api';

@Component({
    selector: 'demo-input',
    templateUrl: './demo-input.component.html',
    styleUrls: ['./demo-input.component.scss'],
    imports: [
        MagmaTabs,
        MagmaTabTitle,
        MagmaTabContent,
        DemoInputAlignComponent,
        DemoInputErrorComponent,
        DemoInputGeneratorComponent,
    ],
})
export class DemoInputComponent {}
