import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input } from '@angular/core';

import { MagmaWindow, MagmaWindowInfos } from './window.component';

import { MagmaWindows } from '../../services/windows';

@Component({
    selector: 'mg-windows-zone',
    templateUrl: './windows-zone.component.html',
    styleUrl: './windows-zone.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MagmaWindow],
})
export class MagmaWindowsZone {
    readonly cd = inject(ChangeDetectorRef);
    readonly windows = input.required<MagmaWindowInfos[]>();
    readonly context = input<MagmaWindows>();

    select(window: MagmaWindowInfos) {
        const index = window.index;
        this.windows().forEach(window => {
            if (window.index > index) {
                window.index -= 1;
            }
        });
        window.index = this.windows().length - 1;
    }

    remove(window: MagmaWindowInfos) {
        const context = this.context();
        if (context) {
            context.removeWindow(window);
        } else {
            const index = this.windows().findIndex(w => w.id === window.id);
            if (index !== -1) {
                this.windows().splice(index, 1);
            }
        }
    }
}
