import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
    MagmaInput,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputText,
    MagmaNgModelChangeDebouncedDirective,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-ng-model-change-debounced',
    templateUrl: './demo-ng-model-change-debounced.component.html',
    styleUrls: ['./demo-ng-model-change-debounced.component.scss'],
    imports: [
        MagmaNgModelChangeDebouncedDirective,
        CodeTabsComponent,
        FormsModule,
        MagmaInput,
        MagmaInputText,
        MagmaInputNumber,
        MagmaInputElement,
    ],
})
export class DemoNgModelChangeDebouncedComponent {
    codeHtml = () => `<mg-input>
  <mg-input-label>ngModel debounced</mg-input-label>
  <mg-input-text
    [(ngModel)]="binding"
    (ngModelChangeDebounced)="change($event)"
    ngModelChangeDebounceTime="${this.time}"
  ></mg-input-text>
</mg-input>`;

    codeTs = `import {
    MagmaNgModelChangeDebouncedDirective,
    MagmaInput,
    MagmaInputText,
    MagmaInputNumber,
    MagmaInputElement
} from '@ikilote/magma';

@Component({
    selector: 'demo-ng-model-change-debounced',
    templateUrl: './demo-ng-model-change-debounced.component.html',
    styleUrls: ['./demo-ng-model-change-debounced.component.scss'],
    imports: [
        FormsModule,
        MagmaNgModelChangeDebouncedDirective,
        MagmaInput,
        MagmaInputText,
        MagmaInputNumber,
        MagmaInputElement,
    ],
})
export class TestComponent {
    binding = '';
    value = '';
    time = 1000;

    change(value: string) {
        this.value = value;
    }
}`;

    binding = '';
    value = '';
    time = 1000;

    change(value: string) {
        this.value = value;
    }
}
