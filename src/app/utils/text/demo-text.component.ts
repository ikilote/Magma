import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import {
    FormBuilderExtended,
    MagmaInput,
    MagmaInputElement,
    MagmaInputText,
    normalizeString,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-text',
    templateUrl: './demo-text.component.html',
    styleUrls: ['./demo-text.component.scss'],
    imports: [ReactiveFormsModule, CodeTabsComponent, MagmaInput, MagmaInputText, MagmaInputElement],
})
export class DemoTextComponent {
    readonly fb = inject(FormBuilderExtended);

    codeTs = `@Component({ ... })
export class TestComponent {
    normalizeString(value: string): string {
        return normalizeString(value);
    }
}`;

    ctrlFormA: FormGroup<{
        text: FormControl<string>;
    }>;

    constructor() {
        this.ctrlFormA = this.fb.groupWithErrorNonNullable({
            text: { default: 'À Â Æ Ç É È Ê Ë Î Ï Ô Œ Ù Û Ü Ÿ à â ç é è ê ë î ï ô ù û ü' },
        });
    }

    normalizeString(value: string): string {
        return normalizeString(value);
    }
}
