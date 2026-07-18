import { ChangeDetectorRef, Component, inject, input, viewChildren } from '@angular/core';

import { MagmaWindow, MagmaWindowInfos } from './window.component';

import { MagmaResizeHostElement } from '../../directives/resizer';
import { MagmaWindowPosition, MagmaWindows } from '../../services/windows';

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
    imports: [MagmaWindow],
})
export class MagmaWindowsZone implements MagmaResizeHostElement {
    readonly cd = inject(ChangeDetectorRef);

    protected readonly windows = input.required<MagmaWindowInfos[]>();
    protected readonly context = input<MagmaWindows>();

    /** Query all rendered mg-window instances */
    private readonly windowComponents = viewChildren(MagmaWindow);

    heightElementNumber = window.innerHeight;
    widthElementNumber = window.innerWidth;
    elementSize = 1;

    select(window: MagmaWindowInfos) {
        const index = window.index();
        this.windows().forEach(win => {
            if (win.index() > index) {
                win.index.update(val => val - 1);
            }
            win.focus = false;
        });
        window.index.set(this.windows().length - 1);
        window.focus = true;
        this.cd.detectChanges();
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

    // ── Event handlers for window outputs ──────────────────────────────────

    onWindowMinimize(window: MagmaWindowInfos): void {
        this.context()?.onMinimizeWindow.next(window.id);
    }

    onWindowRestore(window: MagmaWindowInfos): void {
        this.context()?.onRestoreWindow.next(window.id);
        this.select(window);
    }

    onWindowFocus(window: MagmaWindowInfos): void {
        this.context()?.onFocusWindow.next(window.id);
        this.select(window);
    }

    // ── Methods called by MagmaWindows service ─────────────────────────────

    /**
     * Minimize a window by its id.
     */
    minimizeById(id: string): void {
        const instance = this.getWindowInstance(id);
        instance?.minimize();
    }

    /**
     * Restore a minimized window by its id.
     */
    restoreById(id: string): void {
        const instance = this.getWindowInstance(id);
        if (instance) {
            instance.restore();
            const infos = this.windows().find(w => w.id === id)!;
            this.select(infos);
        }
    }

    /**
     * Get the current position of a window relative to its zone.
     */
    getWindowPosition(id: string): MagmaWindowPosition | null {
        const instance = this.getWindowInstance(id);
        if (!instance) return null;
        return {
            x: Math.round(instance.x[0] - instance.initPosition.x),
            y: Math.round(instance.y[0] - instance.initPosition.y),
        };
    }

    /**
     * Find the MagmaWindow component instance for a given MagmaWindowInfos id.
     */
    private getWindowInstance(id: string): MagmaWindow | undefined {
        return this.windowComponents().find(w => w.component()?.id === id);
    }
}
