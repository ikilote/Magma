import { CdkDrag } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

import { MagmaLimitFocusDirective } from '../../directives/limit-focus.directive';

@Component({
    selector: 'mg-window',
    templateUrl: './window.component.html',
    styleUrl: './window.component.scss',
    host: {},
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CdkDrag, MagmaLimitFocusDirective],
})
export class MagmaWindow {
    isOpen = signal(false);

    readonly onClose = output();

    open() {
        this.isOpen.set(true);
    }

    close() {
        this.isOpen.set(false);
        this.onClose.emit();
    }
}
