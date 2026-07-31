import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-chips',
    templateUrl: './demo-chips.component.html',
    styleUrl: './demo-chips.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [CodeTabsComponent],
})
export class DemoChipsComponent {
    single = '<button class="chip">Chip</button>';
    group = `<div class="chips">
  <button class="chip">Option A</button>
  <button class="chip">Option B</button>
  <button class="chip">Option C</button>
</div>`;
    disabled = '<button class="chip" disabled>Disabled</button>';
    link = '<a href="/style/chips" class="chip">Link chip</a>';
}
