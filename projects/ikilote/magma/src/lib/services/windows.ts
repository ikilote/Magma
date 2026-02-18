import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Type, inject } from '@angular/core';

import { Subject } from 'rxjs';

import { MagmaWindow, MagmaWindowInfos } from '../../public-api';

let index = 0;

@Injectable({ providedIn: 'root' })
export class MagmaWindows {
    private readonly overlay = inject(Overlay);

    readonly windows: MagmaWindowInfos[] = [];

    readonly onAddWindow = new Subject<MagmaWindowInfos>();

    openWindow(component: Type<any>, inputs: Record<string, any> = {}, id?: string) {
        const info = { component, inputs, id: id || 'window-' + index++ };
        this.windows.push(info);

        this.init(info);
        this.onAddWindow.next(info);
        return info;
    }

    removeWindow(window: MagmaWindowInfos) {
        this.removeWindowById(window.id);
    }

    removeWindowById(id: String) {
        const index = this.windows.findIndex(w => w.id === id);
        if (index > -1) {
            this.windows.splice(index, 1)[0]?.overlayRef?.dispose();
        }
    }

    private init(infos: MagmaWindowInfos) {
        const overlayRef = this.overlay.create({
            hasBackdrop: false,
            panelClass: 'overlay-window',
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy: this.overlay.position().global().right(),
        });
        const userProfilePortal = new ComponentPortal(MagmaWindow);
        const component = overlayRef.attach(userProfilePortal);
        component.setInput('component', infos);
        component.setInput('context', this);
        component.instance.open();
        infos.overlayRef = overlayRef;
    }
}
