import { Component } from '@angular/core';

import { MagmaBlockMessage, MagmaMessage } from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-message',
    templateUrl: './demo-message.component.html',
    styleUrls: ['./demo-message.component.scss'],
    imports: [MagmaMessage, MagmaBlockMessage, CodeTabsComponent],
})
export class DemoMessageComponent {
    codeHtml = `<mg-message>
  <h1>Test</h1>
  <p>Test</p>
</mg-message>`;
    codeHtmlSub = `<mg-message>
  <mg-message-block>
    <p>no type</p>
  </mg-message-block>
  <mg-message-block type="success">
    <p>success</p>
  </mg-message-block>
  <mg-message-block type="warn">
    <p>warn</p>
  </mg-message-block>
  <mg-message-block type="error">
    <p>error</p>
  </mg-message-block>
  <mg-message-block type="tip">
    <p>tip</p>
  </mg-message-block>
  <mg-message-block type="info">
    <p>info</p>
  </mg-message-block>
</mg-message>`;
}
