import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MagmaMessage } from '../../../../projects/ikilote/magma/src/public-api';

@Component({
    selector: 'info-messages',
    templateUrl: './info-messages.component.html',
    styleUrls: ['./info-messages.component.scss'],
    imports: [FormsModule, ReactiveFormsModule],
})
export class DemoInfoMessageComponent {
    readonly mgMessage = inject(MagmaMessage);

    add() {
        this.mgMessage.addMessage('Test', { time: '5s' });
    }
}
