import { Directive, input, output } from '@angular/core';

import { MagmaMenuItemDef } from './menubar.types';

/**
 * Tag-mode item directive: `<mg-menu-item>`.
 *
 * Declare items inside `<mg-menu>` when you need custom labels or icons
 * that are not easily expressible as plain data.
 *
 * @example
 * ```html
 * <mg-menu-item label="Save" icon="save" (action)="save()" />
 * <mg-menu-item separator />
 * <mg-menu-item label="Delete" [disabled]="true" />
 * ```
 */
@Directive({
    selector: 'mg-menu-item',
})
export class MagmaMenuItemDirective {
    label = input<string>();
    icon = input<string>();
    separator = input(false);
    disabled = input(false);

    // Emitted by the menubar component — consumers can also bind to it directly.
    readonly action = output<void>();

    /** Convert to a plain def for unified rendering. */
    toDef(): MagmaMenuItemDef {
        return {
            label: this.label(),
            icon: this.icon(),
            separator: this.separator(),
            disabled: this.disabled(),
            action: this.action.emit.bind(this.action),
        };
    }
}
