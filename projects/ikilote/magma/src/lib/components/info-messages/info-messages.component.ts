import { ChangeDetectorRef, Component, OnInit, inject, input } from '@angular/core';

import { MagmaInfoMessageComponent } from './info-message.component';

import { MagmaMessageInfo, MagmaMessages } from '../../services/messages';

@Component({
    selector: 'mg-info-messages',
    templateUrl: './info-messages.component.html',
    styleUrl: './info-messages.component.scss',
    imports: [MagmaInfoMessageComponent],
})
export class MagmaInfoMessagesComponent implements OnInit {
    // inject

    protected readonly messages = inject(MagmaMessages);
    private readonly cd = inject(ChangeDetectorRef);

    /**
     * Set of zone ids this component instance is responsible for.
     * Injected by `MagmaMessages` service after attaching the portal.
     * Defaults to `{ 'default' }` for backward-compatibility when the
     * component is used directly in a template.
     */
    readonly zoneIds = input<Set<string>>(new Set(['default']));

    // template

    ngOnInit(): void {
        this.messages.onAddMessage.subscribe(() => {
            this.cd.detectChanges();
        });
    }

    protected visibleMessages(): MagmaMessageInfo[] {
        return this.messages.messagesForZones(this.zoneIds());
    }

    destruct(message: MagmaMessageInfo) {
        this.messages.removeMessage(message);
        this.cd.detectChanges();
        this.messages.testDispose(message.zone);
    }
}
