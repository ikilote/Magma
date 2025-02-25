import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import {
    MagmaInput,
    MagmaInputElement,
    MagmaInputText,
    testEmail,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-email',
    templateUrl: './demo-email.component.html',
    styleUrls: ['./demo-email.component.scss'],
    imports: [ReactiveFormsModule, CodeTabsComponent, MagmaInput, MagmaInputText, MagmaInputElement],
})
export class DemoEmailComponent {
    codeTs = `@Component({ ... })
export class TestComponent {
    emailValid = '';

    testEmail(email: string) {
        this.emailValid = testEmail(email) ? 'valid' : 'invalid';
    }
}`;

    emailValid = '';

    testEmail(email: string) {
        this.emailValid = testEmail(email) ? 'valid' : 'invalid';
    }
}
