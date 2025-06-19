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
  <mg-input class="s-6">
    <mg-input-label>no directive</mg-input-label>
    <mg-input-text />
  </mg-input>

  <!-- Stop propagation for keydown -->
  <mg-input stop-propagation stopKeydown class="s-6">
    <mg-input-label>stop-propagation stopKeydown</mg-input-label>
    <mg-input-text />
  </mg-input>
</div>`;

    keydown(event: KeyboardEvent) {
        console.log(event);
    }
}
