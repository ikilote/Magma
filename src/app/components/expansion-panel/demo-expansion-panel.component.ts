import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Json2html, Json2htmlRef } from '@ikilote/json2html';

import {
    MagmaExpansionPanelModule,
    MagmaExpansionPanelUpdateEvent,
    MagmaInput,
    MagmaInputCheckbox,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-expansion-panel',
    templateUrl: './demo-expansion-panel.component.html',
    styleUrls: ['./demo-expansion-panel.component.scss'],
    imports: [FormsModule, CodeTabsComponent, MagmaExpansionPanelModule, MagmaInput, MagmaInputCheckbox],
})
export class DemoExpansionPanelComponent {
    open = true;
    disabled = false;

    codeHtml = '';
    codeTs = `import { MagmaExpansionPanelModule } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    styleUrls: ['./my-component.component.scss'],
    imports: [
        MagmaExpansionPanelModule
    ],
})
export class DemoExpansionPanelComponent {
    open = true;

    update(event: MagmaExpansionPanelUpdateEvent) {
         this.open = event.open;
    }
}`;

    constructor() {
        this.generator();
    }

    generator() {
        const json: Json2htmlRef = {
            tag: 'mg-expansion-panel',
            attrs: {
                open: this.open ? null : undefined,
                disabled: this.disabled ? null : undefined,
                '(update)': 'update($event)',
            },
            body: [
                {
                    tag: 'mg-expansion-header',
                    body: {
                        tag: 'p',
                        body: 'test',
                    },
                },
                {
                    tag: 'mg-expansion-content',
                    body: [
                        {
                            tag: 'h2',
                            body: 'test',
                        },
                        {
                            tag: 'p',
                            body: 'test content',
                        },
                    ],
                },
            ],
        };

        this.codeHtml = new Json2html(json).toString();
    }

    update(event: MagmaExpansionPanelUpdateEvent) {
        this.open = event.open;
    }
}
