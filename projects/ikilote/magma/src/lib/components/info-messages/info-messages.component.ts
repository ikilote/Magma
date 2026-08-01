import { ChangeDetectorRef, Component, inject } from '@angular/core';

import { MagmaInfoMessageComponent } from './info-message.component';

import { MagmaMessageInfo, MagmaMessages } from '../../services/messages';

@Component({
    selector: 'mg-info-messages',
    templateUrl: './info-messages.component.html',
    styleUrl: './info-messages.component.scss',
    imports: [MagmaInfoMessageComponent],
})
export class MagmaInfoMessagesComponent {
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
