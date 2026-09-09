import { AfterContentInit, Component, booleanAttribute, contentChildren, input } from '@angular/core';

import { MagmaExpansionPanel } from './expansion-panel.component';

/**
 * Wraps multiple `mg-expansion-panel` components to create an accordion.
 *
 * By default, only one panel can be open at a time.
 * Add the `multiple` attribute (or bind `[multiple]="true"`) to allow several
 * panels to be open simultaneously.
 *
 * @example — exclusive (default)
 * ```html
 * <mg-accordion>
 *   <mg-expansion-panel>…</mg-expansion-panel>
 *   <mg-expansion-panel>…</mg-expansion-panel>
 * </mg-accordion>
 * ```
 *
 * @example — multiple panels open at once
 * ```html
 * <mg-accordion multiple>
 *   <mg-expansion-panel>…</mg-expansion-panel>
 *   <mg-expansion-panel>…</mg-expansion-panel>
 * </mg-accordion>
 * ```
 */
@Component({
    selector: 'mg-accordion',
    template: '<ng-content />',
    styleUrl: './accordion.component.scss',
    host: {
        role: 'group',
    },
})
export class MagmaAccordion implements AfterContentInit {
    /** When true, multiple panels can be open at the same time. Defaults to false. */
    readonly multiple = input(false, { transform: booleanAttribute });

    readonly panels = contentChildren(MagmaExpansionPanel);

    ngAfterContentInit(): void {
        this.panels().forEach(panel => {
            panel.update.subscribe(event => {
                if (event.open && !this.multiple()) {
                    this.closeOthers(event.component);
                }
            });
        });
    }

    private closeOthers(active: MagmaExpansionPanel): void {
        this.panels()
            .filter(p => p !== active)
            .forEach(p => p.open.set(false));
    }
}
