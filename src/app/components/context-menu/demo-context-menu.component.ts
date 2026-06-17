import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';
import {
    AbstractContextMenuComponent,
    ContextMenuData,
    ContextMenuMode,
    FormBuilderExtended,
    MagmaContextMenu,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputRadio,
} from '@ikilote/magma';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'context-test',
    template: `<div>
        Test
        <button (click)="action()">Close</button>
    </div>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    styles: [
        `
            :host {
                display: block;
                padding: 10px;
            }
        `,
    ],
})
export class ContextTestComponent extends AbstractContextMenuComponent {
    component = input<DemoContextMenuComponent>();

    action() {
        this.context()?.close();
        this.component()?.testComponent('Test component');
    }
}

@Component({
    selector: 'demo-context-menu',
    templateUrl: './demo-context-menu.component.html',
    styleUrl: './demo-context-menu.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        CodeTabsComponent,
        ReactiveFormsModule,
        MagmaContextMenu,
        MagmaInput,
        MagmaInputElement,
        MagmaInputRadio,
        MagmaInputCheckbox,
    ],
})
export class DemoContextMenuComponent {
    readonly fb = inject(FormBuilderExtended);

    contextMenu: ContextMenuData<any> = {
        contextMenu: [
            {
                iconText: '🫵',
                label: 'List',
                action: data => {
                    this.test(data, 'list');
                },
            },
            {
                iconText: '☝️',
                label: 'Data',
                action: data => {
                    this.test(data, 'data');
                },
            },
            {
                iconText: '🫰',
                label: 'Like',
                action: data => {
                    this.test(data, 'like');
                },
            },
            {
                iconText: '👐',
                label: 'Love',
                action: data => {
                    this.test(data, 'love');
                },
            },
            {
                iconText: '👇',
                label: 'Hate',
                action: data => {
                    this.test(data, 'hate');
                },
            },
            {
                component: ContextTestComponent,
                inputs: {
                    component: this,
                },
            },
        ],
        data: 'Data',
    };

    ctrlForm: FormGroup<{
        contextMenuMode: FormControl<ContextMenuMode>;
        contextMenuDisabled: FormControl<boolean>;
    }>;

    codeHtml = '';
    codeTs = `import { ContextMenuData } from '@ikilote/magma';

export class DemoContextMenuComponent {
    contextMenu: ContextMenuData<any> = {
        contextMenu: [
            {
                iconText: '🫵',
                label: 'List',
                action: data => {
                    this.test(data, 'list');
                },
            },
            {
                iconText: '☝️',
                label: 'Data',
                action: data => {
                    this.test(data, 'data');
                },
            },
            {
                iconText: '🫰',
                label: 'Like',
                action: data => {
                    this.test(data, 'like');
                },
            },
            {
                iconText: '👐',
                label: 'Love',
                action: data => {
                    this.test(data, 'love');
                },
            },
            {
                iconText: '👇',
                label: 'Hate',
                action: data => {
                    this.test(data, 'hate');
                },
            },
              {
                component: ContextTestComponent,
                inputs: {
                    component: this,
                },
            },
        ],
        data: 'Data',
    };
}`;

    codeTsComponent = `import { MagmaContextMenu, AbstractContextMenuComponent } from '@ikilote/magma';

@Component({
    selector: 'context-test',
    templateUrl: './demo-context-test.component.html',
    styles: [
        \`
            :host {
                display: block;
                padding: 10px;
            }
        \`,
    ],
})
export class ContextTestComponent extends AbstractContextMenuComponent {
    // inputs
    component = input<DemoContextMenuComponent>();

    action() {
        this.context()?.close();
        this.component()?.testComponent('Test component');
    }
}`;

    constructor() {
        this.ctrlForm = this.fb.groupWithError({
            contextMenuMode: { default: 'default' as ContextMenuMode },
            contextMenuDisabled: { default: false },
        });
        this.codeGeneration();
        this.ctrlForm.valueChanges.subscribe(() => {
            this.codeGeneration();
        });
    }

    test(data: string, action: string) {
        console.log(data, action);
    }

    testComponent(data: string) {
        console.log(data);
    }

    codeGeneration() {
        // tag root

        const json: Json2htmlRef = {
            tag: 'div',
            attrs: {
                '[contextMenu]': 'contextMenu',
            },
            body: ['Right-click here to display the context menu.'],
        };
        const attrs: Json2htmlAttr = json.attrs!;

        // tag attr

        if (this.ctrlForm.value.contextMenuMode !== 'default') {
            attrs['contextMenuMode'] = this.ctrlForm.value.contextMenuMode;
        }

        if (this.ctrlForm.value.contextMenuDisabled) {
            attrs['contextMenuDisabled'] = null;
        }

        this.codeHtml = new Json2html(json).toString();
    }
}
