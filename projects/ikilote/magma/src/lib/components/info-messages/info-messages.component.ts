import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';

import { InfoMessageComponent } from './info-message.component';

import { MagmaMessage, MagmaMessageInfo } from '../../services/message';

@Component({
    selector: 'info-messages',
    templateUrl: './info-messages.component.html',
    styleUrls: ['./info-messages.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [InfoMessageComponent],
})
export class InfoMessagesComponent {
    // inject

    protected readonly messageService = inject(MagmaMessage);
    private readonly cd = inject(ChangeDetectorRef);

    // template

    constructor() {
        this.messageService.onAddMessage.subscribe(() => {
            this.cd.detectChanges();
        });
    }

    destruct(message: MagmaMessageInfo) {
        this.messageService.removeMessage(message);
        this.cd.detectChanges();
        this.messageService.testDispose();
    }
}
