import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, inject } from '@angular/core';

import { Subject } from 'rxjs';

import { InfoMessagesComponent } from '../components/info-messages/info-messages.component';

export enum MagmaMessageType {
    info = 'info',
    error = 'error',
}

export interface MagmaMessageInfo {
    message: string;
    type: MagmaMessageType;
    time: string;
}

@Injectable({ providedIn: 'root' })
export class MagmaMessage {
    private readonly overlay = inject(Overlay);

    private _overlayRef?: OverlayRef;

    readonly messages: MagmaMessageInfo[] = [];

    readonly onAddMessage = new Subject<void>();

    addMessage(message: string, options: { type?: MagmaMessageType; time?: string } = {}) {
        if (!this.messages.length) {
            this.init();
        }

        this.messages.push({ message, type: options.type || MagmaMessageType.info, time: options.time || '3s' });
        this.onAddMessage.next();
    }

    removeMessage(message: MagmaMessageInfo) {
        this.messages.splice(this.messages.indexOf(message), 1);
    }

    testDispose() {
        if (!this.messages.length) {
            this._overlayRef!.dispose();
            this._overlayRef = undefined;
        }
    }

    private init() {
        const overlayRef = this.overlay.create({
            hasBackdrop: false,
            panelClass: 'overlay-message',
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy: this.overlay.position().global().right(),
        });
        const userProfilePortal = new ComponentPortal(InfoMessagesComponent);
        const component = overlayRef.attach(userProfilePortal);
        //  component.setInput('context', this);
        this._overlayRef = overlayRef;
    }
}
