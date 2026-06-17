import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MagmaTabContent, MagmaTabTitle, MagmaTabs } from '@ikilote/magma';

import { DemoInputAlignComponent } from './demo-input-align.component';
import { DemoInputErrorComponent } from './demo-input-error.component';
import { DemoInputGeneratorComponent } from './demo-input-generator.component';

@Component({
    selector: 'demo-input',
    templateUrl: './demo-input.component.html',
    styleUrl: './demo-input.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
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
