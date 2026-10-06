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
    single = '<button class="mg-chip">Chip</button>';
    group = `<div class="mg-chips">
  <button class="mg-chip">Option A</button>
  <button class="mg-chip">Option B</button>
  <button class="mg-chip">Option C</button>
</div>`;
    disabled = '<button class="mg-chip" disabled>Disabled</button>';
    link = '<a href="/style/chips" class="mg-chip">Link chip</a>';
}
