import { Component } from '@angular/core';

import { MagmaBlock } from '../../../../projects/ikilote/magma/src/lib/components/block/block.component';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-block',
    templateUrl: './demo-block.component.html',
    styleUrl: './demo-block.component.scss',
    imports: [MagmaBlock, CodeTabsComponent],
})
export class DemoBlockComponent {
    codeHtml = `<mg-block>
  <h1>Test</h1>
  <p>Test</p>
</mg-block>`;

    codeHtmlGridGad = `<div class="gap">
  <mg-block class="s-3 s-6-l s-12-s">
    <h1>Test</h1>
    <p>Test</p>
  </mg-block>
  <mg-block class="s-3 s-6-l s-12-s">
    <h1>Test</h1>
    <p>Test</p>
  </mg-block>
  <mg-block class="s-6 s-12-l">
    <h1>Test</h1>
    <p>Test</p>
  </mg-block>
  <mg-block class="s-6 s-12-l">
    <h1>Test</h1>
    <p>Test</p>
  </mg-block>
  ...
</div>`;

    codeTs = `import { MagmaBlock } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    styleUrl: './my-component.component.scss',
    imports: [
        MagmaBlock
    ],
})
export class DemoBlockComponent { }`;
}
