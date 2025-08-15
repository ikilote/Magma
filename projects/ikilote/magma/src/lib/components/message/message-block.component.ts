import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MagmaMessageType } from '../../services/messages';

@Component({
    selector: 'mg-message-block',
    templateUrl: './message-block.component.html',
    styleUrls: ['./message-block.component.scss'],
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
export class MagmaBlockMessage {
    type = input<MagmaMessageType | `${MagmaMessageType}`>();
}
