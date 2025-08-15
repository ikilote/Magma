import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MagmaMessageType } from '../../services/messages';

@Component({
    selector: 'mg-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule],
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
