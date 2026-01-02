import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MagmaMessageType } from '../../services/messages';

@Component({
    selector: 'mg-message',
    templateUrl: './message.component.html',
    styleUrl: './message.component.scss',
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
export class MagmaMessage {
    type = input<MagmaMessageType | `${MagmaMessageType}`>();
}
