import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input } from '@angular/core';

import { MagmaWindow, MagmaWindowInfos } from './window.component';

import { MagmaResizeHostElement } from '../../directives/resizer';
import { MagmaWindows } from '../../services/windows';

/**
 * This component is necessary for the `Windows` service to function but can hardly be used in another context,
 * so it is not present in `public-api`.
 *
 * Please use: `mg-windows-container`
 */
@Component({
    selector: 'mg-windows-zone',
    templateUrl: './windows-zone.component.html',
    styleUrl: './windows-zone.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MagmaWindow],
})
export class MagmaWindowsZone implements MagmaResizeHostElement {
    protected readonly windows = input.required<MagmaWindowInfos[]>();
    protected readonly context = input<MagmaWindows>();
    readonly cd = inject(ChangeDetectorRef);

    heightElementNumber = window.innerHeight;
    widthElementNumber = window.innerWidth;
    elementSize = 1;

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
