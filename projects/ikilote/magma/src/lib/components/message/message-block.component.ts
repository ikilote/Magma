import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MagmaMessageType } from '@ikilote/magma';

@Component({
    selector: 'mg-message-block',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagmaBlockMessage {
    type = input<MagmaMessageType>();
}
