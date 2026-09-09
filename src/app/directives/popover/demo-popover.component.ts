import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

    get codeHtml(): string {
        return `<button [mgPopover]="popTpl"
        mgPopoverPosition="${this.position}"
        mgPopoverTrigger="${this.trigger}"${this.disabled ? '\n        mgPopoverDisabled' : ''}>
  Open popover
</button>

<ng-template #popTpl let-ctx>
  <div class="popover-body">
    <p>Interactive content</p>
    <button (click)="ctx.close()">Close</button>
  </div>
</ng-template>`;
    }

    codeTs = `import { MagmaPopoverDirective } from '@ikilote/magma';

@Component({
    imports: [MagmaPopoverDirective],
})
export class MyComponent {}`;

    codeScss = `.popover-body {
  border: var(--block-border);
  border-radius: var(--block-radius);
  background: var(--block-background);
  padding: 16px;
  min-width: 220px;
}`;
}
