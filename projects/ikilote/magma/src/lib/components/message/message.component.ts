import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MagmaMessageType } from '@ikilote/magma';

@Component({
    selector: 'mg-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagmaMessage {
    type = input<MagmaMessageType>();
}
