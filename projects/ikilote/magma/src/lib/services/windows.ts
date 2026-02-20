import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Type, inject } from '@angular/core';

import { Subject } from 'rxjs';

import { MagmaWindowInfos } from '../../public-api';
import { MagmaWindowsZone } from '../components/window/windows-zone.component';

let index = 0;

@Injectable({ providedIn: 'root' })
export class MagmaWindows {
    private readonly overlay = inject(Overlay);

    readonly windows: MagmaWindowInfos[] = [];

    readonly onAddWindow = new Subject<MagmaWindowInfos>();

    component?: ComponentRef<MagmaWindowsZone>;
    overlayRef?: OverlayRef;

    openWindow(
        component: Type<any>,
        params?: { inputs?: Record<string, any>; id?: string; position?: 'default' | 'center' },
    ) {
        const infos: MagmaWindowInfos = {
            component,
            inputs: params?.inputs ?? {},
            id: params?.id || 'window-' + index++,
            index: 0,
            position: params?.position,
        };
        infos.index = this.windows.push(infos);

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
            if (this.windows.length === 0) {
                this.overlayRef?.dispose();
                this.overlayRef = undefined;
                this.component = undefined;
            }
        }
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
