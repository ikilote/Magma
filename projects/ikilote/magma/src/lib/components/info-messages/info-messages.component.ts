import { ChangeDetectorRef, Component, OnInit, inject, input } from '@angular/core';

import { MagmaInfoMessageComponent } from './info-message.component';

import { MagmaMessageInfo, MagmaMessages } from '../../services/messages';
import { MagmaOverlayPosition, overlayPositionClasses } from '../../utils/position';

@Component({
    selector: 'mg-info-messages',
    templateUrl: './info-messages.component.html',
    styleUrl: './info-messages.component.scss',
    imports: [MagmaInfoMessageComponent],
    host: {
        '[class]': 'placementClasses()',
    },
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

    /**
     * Screen position of the overlay bucket this component lives in.
     * Injected by `MagmaMessages.ensureBucket()`.
     * Used to derive CSS placement classes so styles adapt to each corner/edge.
     */
    readonly position = input<MagmaOverlayPosition>({ bottom: '10px', right: '10px' });

    // template

    ngOnInit(): void {
        this.messages.onAddMessage.subscribe(() => {
            this.cd.detectChanges();
        });
    }

    protected visibleMessages(): MagmaMessageInfo[] {
        return this.messages.messagesForZones(this.zoneIds());
    }

    /** CSS classes derived from the zone position, applied to :host and passed to children. */
    protected placementClasses(): string[] {
        return overlayPositionClasses(this.position());
    }

    destruct(message: MagmaMessageInfo) {
        this.messages.removeMessage(message);
        this.cd.detectChanges();
        this.messages.testDispose(message.zone);
    }
}
