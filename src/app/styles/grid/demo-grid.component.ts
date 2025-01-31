import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MagmaInput, MagmaInputCheckbox } from '@ikilote/magma';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-grid',
    templateUrl: './demo-grid.component.html',
    styleUrls: ['./demo-grid.component.scss'],
    imports: [CodeTabsComponent, MagmaInput, MagmaInputCheckbox, FormsModule],
    host: {
        '[class.show-border]': 'show',
    },
})
export class DemoGridComponent {
    show = true;

    code = `<div>
  <div class="s-6"><code>.s-6</code></div>
  <div class="s-6"><code>.s-6</code></div>
  <div class="s-4"><code>.s-4</code></div>
  <div class="s-4"><code>.s-4</code></div>
  <div class="break"><code>.break</code></div>
  <div class="s-3"><code>.s-3</code></div>
  <div class="s-3"><code>.s-3</code></div>
  <div class="s-3"><code>.s-3</code></div>
  <div class="break"><code>.break</code></div>
  <div class="s-2"><code>.s-2</code></div>
  <div class="s-2"><code>.s-2</code></div>
  <div class="s-1"><code>.s-1</code></div>
  <div class="s-1"><code>.s-1</code></div>
  <div class="s-f"><code>.s-f</code></div>
  <div class="s-1"><code>.s-1</code></div>
  <div class="sub">
    <div class="s-6"><code>.s-6</code></div>
    <div class="s-6"><code>.s-6</code></div>
    <div class="s-6"><code>.s-6</code></div>
  </div>
  <div class="s-12"><code>.s-12</code></div>
  <div class="s-11"><code>.s-11</code></div>
  <div class="s-10"><code>.s-10</code></div>
  <div class="s-9"><code>.s-9</code></div>
  <div class="s-8"><code>.s-8</code></div>
  <div class="s-7"><code>.s-7</code></div>
  <div class="s-5"><code>.s-5</code></div>
  <div class="s-6">
    <div class="s-6"><code>.s-6</code></div>
    <div class="s-2"><code>.s-2</code></div>
  </div>
  <div class="s-6"><code>.s-6</code></div>
  <div class="sub">
    <div class="s-6">
      <div class="s-6"><code>.s-6</code></div>
      <div class="s-6"><code>.s-6</code></div>
    </div>
    <div class="s-6"><code>.s-6</code></div>
  </div>
</div>`;
}
