import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';
import {
    MagmaConnectedPosition,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputSelect,
    MagmaPopoverDirective,
    MagmaTableModule,
    MagmaTabsModule,
} from '@ikilote/magma';

import { Select2Data } from 'ng-select2-component';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-popover',
    templateUrl: './demo-popover.component.html',
    styleUrl: './demo-popover.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        FormsModule,
        CodeTabsComponent,
        MagmaPopoverDirective,
        MagmaInput,
        MagmaInputCheckbox,
        MagmaInputElement,
        MagmaInputSelect,
        MagmaTabsModule,
        MagmaTableModule,
    ],
})
export class DemoPopoverComponent {
    position: MagmaConnectedPosition = 'bottom-start';
    trigger: 'click' | 'hover' = 'click';
    disabled = false;

    codeHtml = '';

    readonly positionData: Select2Data = [
        'bottom',
        'bottom-start',
        'bottom-end',
        'top',
        'top-start',
        'top-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
    ].map(v => ({ value: v, label: v }));

    readonly triggerData: Select2Data = [
        { value: 'click', label: 'click' },
        { value: 'hover', label: 'hover' },
    ];

    readonly codeTs = `import { MagmaPopoverDirective } from '@ikilote/magma';

@Component({
    imports: [MagmaPopoverDirective],
})
export class MyComponent {}`;

    readonly codeScss = `.popover-body {
  border: var(--block-border);
  border-radius: var(--block-radius);
  background: var(--block-background);
  padding: 16px;
  min-width: 220px;
}`;

    constructor() {
        this.codeGeneration();
    }

    codeGeneration() {
        const json: Json2htmlRef = {
            tag: 'button',
            attrs: {
                '[mgPopover]': 'popTpl',
            },
            body: 'Open popover',
        };
        const attrs: Json2htmlAttr = json.attrs!;

        if (this.position !== 'bottom-start') {
            attrs['mgPopoverPosition'] = this.position;
        }
        if (this.trigger !== 'click') {
            attrs['mgPopoverTrigger'] = this.trigger;
        }
        if (this.disabled) {
            attrs['mgPopoverDisabled'] = null;
        }

        const template: Json2htmlRef = {
            tag: 'ng-template',
            attrs: { '#popTpl': null, 'let-ctx': null },
            body: [
                {
                    tag: 'div',
                    attrs: { class: 'popover-body' },
                    body: [
                        { tag: 'p', body: 'Interactive content' },
                        { tag: 'button', attrs: { '(click)': 'ctx.close()' }, body: 'Close' },
                    ],
                },
            ],
        };

        this.codeHtml = new Json2html(json).toString() + '\n\n' + new Json2html(template).toString();
    }
}
