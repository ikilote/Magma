import { Component } from '@angular/core';

import {
    MagmaInput,
    MagmaInputElement,
    MagmaInputText,
    MagmaStopPropagationDirective,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-stop-propagation',
    templateUrl: './demo-stop-propagation.component.html',
    styleUrls: ['./demo-stop-propagation.component.scss'],
    imports: [MagmaStopPropagationDirective, MagmaInput, MagmaInputText, MagmaInputElement, CodeTabsComponent],
})
export class DemoStopPropagationComponent {
    codeHtml = `<div (keydown)="consoleLog($event)">
  <mg-input>
    <mg-input-label>no directive</mg-input-label>
    <mg-input-text />
  </mg-input>

  <!-- Stop propagation for keydown -->
  <mg-input stop-propagation stopKeydown>
    <mg-input-label>stop-propagation stopKeydown</mg-input-label>
    <mg-input-text />
  </mg-input>
</div>


<div (click)="click($event)">
  <button>no directive</button>

  <!-- Stop propagation for click -->
  <button stop-propagation stopClick>stop-propagation stopClick</button>
</div>
`;

    log = '';

    keydown(event: KeyboardEvent) {
        console.log('keydown', event);
        this.log += `keydown', ${event}\n`;
    }

    click(event: MouseEvent) {
        console.log('click', event);
        this.log += `click', ${event}\n`;
    }
}
