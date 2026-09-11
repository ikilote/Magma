import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MagmaMenuDef, MagmaMenuItemDef, MagmaMenubarModule, MagmaTableModule, MagmaTabsModule } from '@ikilote/magma';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-menubar',
    templateUrl: './demo-menubar.component.html',
    styleUrl: './demo-menubar.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule, CodeTabsComponent, MagmaMenubarModule, MagmaTableModule, MagmaTabsModule],
})
export class DemoMenubarComponent {
    lastAction = '';

    readonly menus: MagmaMenuDef[] = [
        {
            label: 'File',
            items: [
                { label: 'New', icon: '📄', action: () => this.log('New') },
                { label: 'Open…', icon: '📂', action: () => this.log('Open') },
                { label: 'Save', icon: '💾', action: () => this.log('Save') },
                { separator: true },
                {
                    label: 'Export',
                    children: [
                        { label: 'As PDF', action: () => this.log('Export PDF') },
                        { label: 'As CSV', action: () => this.log('Export CSV') },
                        { label: 'As JSON', action: () => this.log('Export JSON') },
                    ],
                },
                { separator: true },
                { label: 'Quit', disabled: true },
            ],
        },
        {
            label: 'Edit',
            items: [
                { label: 'Undo', icon: '↩', action: () => this.log('Undo') },
                { label: 'Redo', icon: '↪', action: () => this.log('Redo') },
                { separator: true },
                { label: 'Cut', action: () => this.log('Cut') },
                { label: 'Copy', action: () => this.log('Copy') },
                { label: 'Paste', action: () => this.log('Paste') },
            ],
        },
        {
            label: 'View',
            items: [
                { label: 'Zoom in', action: () => this.log('Zoom in') },
                { label: 'Zoom out', action: () => this.log('Zoom out') },
                { separator: true },
                { label: 'Full screen', action: () => this.log('Full screen') },
            ],
        },
        { separator: true },
        {
            label: 'Help',
            items: [
                { label: 'Documentation', action: () => this.log('Docs') },
                { label: 'About', action: () => this.log('About') },
            ],
        },
    ];

    codeHtmlJson = `<!-- JSON mode -->
<mg-menubar [menus]="menuDefs" (menuItemExecuted)="onAction($event)" />`;

    codeHtmlTags = `<!-- Tag mode -->
<mg-menubar (menuItemExecuted)="onAction($event)">
  <mg-menu label="File">
    <mg-menu-item label="New"   icon="📄" (action)="newFile()" />
    <mg-menu-item label="Open…" icon="📂" (action)="open()" />
    <mg-menu-item separator />
    <mg-menu-item label="Quit"  [disabled]="true" />
  </mg-menu>
  <mg-menu label="Edit">
    <mg-menu-item label="Cut"   (action)="cut()" />
    <mg-menu-item label="Copy"  (action)="copy()" />
    <mg-menu-item label="Paste" (action)="paste()" />
  </mg-menu>
</mg-menubar>`;

    codeTs = `import { MagmaMenubarModule, MagmaMenuDef, MagmaMenuItemDef } from '@ikilote/magma';

@Component({
    imports: [MagmaMenubarModule],
})
export class MyComponent {
    readonly menus: MagmaMenuDef[] = [
        {
            label: 'File',
            items: [
                { label: 'New',  icon: '📄', action: () => this.newFile() },
                { label: 'Open', icon: '📂', action: () => this.open() },
                { separator: true },
                { label: 'Export', children: [
                    { label: 'As PDF',  action: () => this.exportPdf() },
                    { label: 'As CSV',  action: () => this.exportCsv() },
                ]},
                { label: 'Quit', disabled: true },
            ],
        },
    ];

    onAction(item: MagmaMenuItemDef) {
        console.log('Executed:', item.label);
    }
}`;

    log(action: string) {
        this.lastAction = action;
    }

    onAction(item: MagmaMenuItemDef) {
        this.lastAction = item.label ?? '?';
    }
}
