import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';

import { InfoMessageComponent } from './info-message.component';

import { MagmaMessageInfo, MagmaMessages } from '../../services/messages';

@Component({
    selector: 'info-messages',
    templateUrl: './info-messages.component.html',
    styleUrls: ['./info-messages.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [InfoMessageComponent],
})
export class InfoMessagesComponent {
    // inject

    protected readonly messages = inject(MagmaMessages);
    private readonly cd = inject(ChangeDetectorRef);

    // template

    constructor() {
        this.messages.onAddMessage.subscribe(() => {
            this.cd.detectChanges();
        });
    }

    destruct(message: MagmaMessageInfo) {
        this.messages.removeMessage(message);
        this.cd.detectChanges();
        this.messages.testDispose();
    }
}
