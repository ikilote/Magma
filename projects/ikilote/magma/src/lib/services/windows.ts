import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Type, inject, signal } from '@angular/core';

import { Subject } from 'rxjs';

import { MagmaWindowInfos, MagmaWindowInitParams } from '../components/window/window.component';
import { MagmaWindowsZone } from '../components/window/windows-zone.component';

let index = 0;

export interface MagmaWindowPosition {
    x: number;
    y: number;
}

@Injectable({ providedIn: 'root' })
export class MagmaWindows {
    private readonly overlay = inject(Overlay);

    readonly windows: MagmaWindowInfos[] = [];

    readonly onAddWindow = new Subject<MagmaWindowInfos>();
    readonly onRemoveWindow = new Subject<string>();
    readonly onMinimizeWindow = new Subject<string>();
    readonly onRestoreWindow = new Subject<string>();
    readonly onFocusWindow = new Subject<string>();

    component?: ComponentRef<MagmaWindowsZone>;
    overlayRef?: OverlayRef;

    openWindow(component: Type<any>, params?: MagmaWindowInitParams) {
        const infos: MagmaWindowInfos = {
            component,
            index: signal(0),
            // default
            inputs: {},
            id: 'window-' + index++,
            zoneSelector: 'mg-windows-zone',
            ...params,
        };
        infos.index.set(this.windows.push(infos) - 1);

        if (this.overlayRef === undefined) {
            this.init();
        }

        this.onAddWindow.next(infos);
        this.component?.instance.cd.detectChanges();
        return infos;
    }

    removeWindow(window: MagmaWindowInfos) {
        this.removeWindowById(window.id);
    }

    removeWindowById(id: String) {
        const index = this.windows.findIndex(w => w.id === id);
        if (index !== -1) {
            this.windows.splice(index, 1);
            this.onRemoveWindow.next(id as string);
            if (this.windows.length === 0) {
                this.overlayRef?.dispose();
                this.overlayRef = undefined;
                this.component = undefined;
            }
        }
    }

    /**
     * Minimize a window by id. The window stays in the overlay but is visually hidden.
     */
    minimizeWindowById(id: string): void {
        this.component?.instance.minimizeById(id);
    }

    /**
     * Restore a minimized window by id.
     */
    restoreWindowById(id: string): void {
        this.component?.instance.restoreById(id);
    }

    /**
     * Get the current position of a window relative to its zone (boundary element).
     * Returns null if the window is not found.
     */
    getWindowPosition(id: string): MagmaWindowPosition | null {
        return this.component?.instance.getWindowPosition(id) ?? null;
    }

    private init() {
        const overlayRef = this.overlay.create({
            hasBackdrop: false,
            panelClass: 'overlay-window',
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy: this.overlay.position().global(),
        });
        const userProfilePortal = new ComponentPortal(MagmaWindowsZone);
        this.component = overlayRef.attach(userProfilePortal);
        this.component.setInput('windows', this.windows);
        this.component.setInput('context', this);
        this.overlayRef = overlayRef;
    }
}
