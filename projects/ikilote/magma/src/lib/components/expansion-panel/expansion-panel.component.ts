import { Component, booleanAttribute, input, model, output } from '@angular/core';

export interface MagmaExpansionPanelUpdateEvent {
    open: boolean;
    component: MagmaExpansionPanel;
}

@Component({
    selector: 'mg-expansion-panel',
    templateUrl: './expansion-panel.component.html',
    styleUrl: './expansion-panel.component.scss',
})
export class MagmaExpansionPanel {
    /**
     * Whether the panel is open.
     * Two-way bindable via `[(open)]` — used by `mg-accordion` to close panels programmatically.
     */
    open = model<boolean>(false);
    disabled = input(false, { transform: booleanAttribute });

    update = output<MagmaExpansionPanelUpdateEvent>();

    updateOpen(detail: HTMLDetailsElement) {
        const nextOpen = !detail.open;
        this.open.set(nextOpen);
        this.update.emit({
            open: nextOpen,
            component: this,
        });
    }
}
