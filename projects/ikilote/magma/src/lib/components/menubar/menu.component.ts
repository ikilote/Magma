import { AfterContentInit, Directive, contentChildren, input, output } from '@angular/core';

import { MagmaMenuItemDirective } from './menu-item.component';
import { MagmaMenuDef, MagmaMenuItemDef } from './menubar.types';

/**
 * Tag-mode menu directive: `<mg-menu>`.
 *
 * Groups `<mg-menu-item>` children under a labelled top-level menu entry.
 * Nested `<mg-menu>` inside `<mg-menu-item>` is achieved via the `children`
 * binding on `MagmaMenuItemDirective` — for full nesting use JSON mode.
 *
 * @example
 * ```html
 * <mg-menubar>
 *   <mg-menu label="File">
 *     <mg-menu-item label="New"  (action)="newFile()" />
 *     <mg-menu-item separator />
 *     <mg-menu-item label="Quit" [disabled]="true" />
 *   </mg-menu>
 * </mg-menubar>
 * ```
 */
@Directive({
    selector: 'mg-menu',
})
export class MagmaMenuDirective implements AfterContentInit {
    label = input.required<string>();
    icon = input<string>();

    readonly menuItemExecuted = output<MagmaMenuItemDef>();

    readonly items = contentChildren(MagmaMenuItemDirective);

    /** Resolved def — populated after content init. */
    def: MagmaMenuDef = { label: '', items: [] };

    ngAfterContentInit(): void {
        this.def = {
            label: this.label(),
            icon: this.icon(),
            items: this.items().map(i => i.toDef()),
        };
    }
}
