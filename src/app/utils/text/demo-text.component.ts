import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import {
    FormBuilderExtended,
    MagmaInput,
    MagmaInputElement,
    MagmaInputText,
    normalizeString,
    unescapedString,
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

    codeTsA = `import { normalizeString } from '@ikilote/magma';

@Component({ ... })
export class TestComponent {
    normalizeString(value: string): string {
        return normalizeString(value);
    }
}`;

    codeTsB = `import { unescapedString } from '@ikilote/magma';

@Component({ ... })
export class TestComponent {
    unescapedString(value: string): string {
        return unescapedString(value);
    }
}`;

    ctrlFormA: FormGroup<{
        text: FormControl<string>;
    }>;

    ctrlFormB: FormGroup<{
        text: FormControl<string>;
    }>;

    constructor() {
        this.ctrlFormA = this.fb.groupWithErrorNonNullable({
            text: { default: 'À Â Æ Ç É È Ê Ë Î Ï Ô Œ Ù Û Ü Ÿ à â ç é è ê ë î ï ô ù û ü' },
        });

        this.ctrlFormB = this.fb.groupWithErrorNonNullable({
            text: { default: 'Line\\n\\t\\u00A9\\xB6' },
        });
    }

    normalizeString(value: string): string {
        return normalizeString(value);
    }

    unescapedString(value: string): string {
        return unescapedString(value);
    }
}
