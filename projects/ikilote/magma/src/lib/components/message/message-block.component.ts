import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MagmaMessageType } from '../../services/messages';

@Component({
    selector: 'mg-message-block',
    templateUrl: './message-block.component.html',
    styleUrl: './message-block.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
    host: {
        '[class.info]': 'type() === "info"',
        '[class.success]': 'type() === "success"',
        '[class.warn]': 'type() === "warn"',
        '[class.error]': 'type() === "error"',
        '[class.tip]': 'type() === "tip"',
    },
})
export class MagmaBlockMessage {
    type = input<MagmaMessageType | `${MagmaMessageType}`>();
}
