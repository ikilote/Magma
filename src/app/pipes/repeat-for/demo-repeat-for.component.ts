import { Component } from '@angular/core';

import { RepeatForPipe } from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-repeat-for',
    templateUrl: './demo-repeat-for.component.html',
    styleUrls: ['./demo-repeat-for.component.scss'],
    imports: [CodeTabsComponent, RepeatForPipe],
})
export class DemoeRepeatForComponent {
    default = `<ul>
  @for (i of 15 | repeatFor; track $index) {
    <li>{{ $index }}</li>
  }
</ul>`;
}
