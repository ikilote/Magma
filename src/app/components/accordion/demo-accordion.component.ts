import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Json2html, Json2htmlRef } from '@ikilote/json2html';
import {
    FormBuilderExtended,
    MagmaExpansionPanelModule,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaTableModule,
    MagmaTabsModule,
} from '@ikilote/magma';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-accordion',
    templateUrl: './demo-accordion.component.html',
    styleUrl: './demo-accordion.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ReactiveFormsModule,
        RouterLink,
        CodeTabsComponent,
        MagmaExpansionPanelModule,
        MagmaInput,
        MagmaInputElement,
        MagmaInputCheckbox,
        MagmaInputNumber,
        MagmaTabsModule,
        MagmaTableModule,
    ],
})
export class DemoAccordionComponent {
    protected readonly fb = inject(FormBuilderExtended);

    ctrlForm: FormGroup<{
        multiple: FormControl<boolean>;
        panels: FormControl<number>;
        disabled: FormControl<boolean>;
    }>;

    codeHtml = '';
    codeTs = `import { MagmaExpansionPanelModule } from '@ikilote/magma';

@Component({
    imports: [MagmaExpansionPanelModule],
})
export class MyComponent {}`;

    constructor() {
        this.ctrlForm = this.fb.groupWithError({
            multiple: { default: false },
            panels: { default: 3 },
            disabled: { default: false },
        });
        this.codeGeneration();
        this.ctrlForm.valueChanges.subscribe(() => {
            this.codeGeneration();
        });
    }

    get panelCount(): number {
        return Math.max(1, Math.min(this.ctrlForm.value.panels ?? 3, 10));
    }

    codeGeneration() {
        const count = this.panelCount;
        const disabled = this.ctrlForm.value.disabled;

        const panels: Json2htmlRef[] = [];
        for (let i = 1; i <= count; i++) {
            const panel: Json2htmlRef = {
                tag: 'mg-expansion-panel',
                attrs: disabled ? { disabled: null } : undefined,
                body: [
                    { tag: 'mg-expansion-header', body: `Section ${i}` },
                    { tag: 'mg-expansion-content', body: [{ tag: 'p', body: `Content of section ${i}.` }] },
                ],
            };
            panels.push(panel);
        }

        const json: Json2htmlRef = {
            tag: 'mg-accordion',
            attrs: this.ctrlForm.value.multiple ? { multiple: null } : undefined,
            body: panels,
        };

        this.codeHtml = new Json2html(json, { spaceLength: 2 }).toString();
    }
}
