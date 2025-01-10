import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MagmaInput, MagmaInputElement, MagmaInputText } from '../../../../projects/ikilote/magma/src/public-api';

@Component({
    selector: 'demo-input',
    templateUrl: './demo-input.component.html',
    styleUrls: ['./demo-input.component.scss'],
    imports: [MagmaInput, MagmaInputText, MagmaInputElement, FormsModule, ReactiveFormsModule],
})
export class DemoInputComponent {}
