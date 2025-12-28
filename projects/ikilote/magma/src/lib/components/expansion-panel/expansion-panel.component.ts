import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';

export interface MagmaExpansionPanelUpdateEvent {
    open: boolean;
    component: MagmaExpansionPanel;
}

@Component({
    selector: 'mg-expansion-panel',
    templateUrl: './expansion-panel.component.html',
    styleUrl: './expansion-panel.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagmaExpansionPanel {
    open = input(false, { transform: booleanAttribute });
    disabled = input(false, { transform: booleanAttribute });

    update = output<MagmaExpansionPanelUpdateEvent>();

    updateOpen(detail: HTMLDetailsElement) {
        this.update.emit({
            open: !detail.open,
            component: this,
        });
    }
}
