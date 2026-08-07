import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Service, Type, inject } from '@angular/core';

import { Subject } from 'rxjs';

import { MagmaInfoMessagesComponent } from '../components/info-messages/info-messages.component';

export enum MagmaMessageType {
    info = 'info',
    success = 'success',
    warn = 'warn',
    error = 'error',
    tip = 'tip',
}

export type MagmaMessageContent = string | { component: Type<unknown>; input?: Record<string, unknown> };

export interface MagmaMessageInfo {
    message: MagmaMessageContent;
    type: MagmaMessageType;
    time: string;
}

@Service()
export class MagmaMessages {
    private readonly overlay = inject(Overlay);

    private _overlayRef?: OverlayRef;

    readonly messages: MagmaMessageInfo[] = [];

    readonly onAddMessage = new Subject<void>();

    addMessage(message: MagmaMessageContent, options: { type?: MagmaMessageType; time?: string } = {}) {
        if (!this.messages.length) {
            this.init();
        }

        this.messages.push({ message, type: options.type || MagmaMessageType.info, time: options.time || '3s' });
        this.onAddMessage.next();
    }

    removeMessage(message: MagmaMessageInfo) {
        this.messages.splice(this.messages.indexOf(message), 1);
    }

    clearMessages() {
        if (this.messages.length) {
            this.messages.splice(0, this.messages.length);
        }
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
        const userProfilePortal = new ComponentPortal(MagmaInfoMessagesComponent);
        // The attached component instance is not retained: nothing calls
        // setInput on it yet (see the commented line below).
        overlayRef.attach(userProfilePortal);
        //  attached.setInput('context', this);
        this._overlayRef = overlayRef;
    }
}
