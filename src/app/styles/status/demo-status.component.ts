import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-status',
    templateUrl: './demo-status.component.html',
    styleUrl: './demo-status.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [CodeTabsComponent],
})
export class DemoStatusComponent {
    basic = `<span class="mg-status">Default</span>
<span class="mg-status mg-status-success">Online</span>
<span class="mg-status mg-status-warning">Degraded</span>
<span class="mg-status mg-status-danger">Offline</span>
<span class="mg-status mg-status-info">Processing</span>
<span class="mg-status mg-status-neutral">Unknown</span>
<span class="mg-status mg-status-offline">Disconnected</span>`;

    dotOnly = `<span class="mg-status"></span>
<span class="mg-status mg-status-success"></span>
<span class="mg-status mg-status-warning"></span>
<span class="mg-status mg-status-danger"></span>
<span class="mg-status mg-status-info"></span>
<span class="mg-status mg-status-neutral"></span>
<span class="mg-status mg-status-offline"></span>`;

    pulse = `<span class="mg-status mg-status-success mg-status-pulse">Live</span>
<span class="mg-status mg-status-danger mg-status-pulse">Recording</span>`;

    cssVars = `/* Customize globally or scoped */
.my-status {
    --mg-status-dot-size: 10px;
    --mg-status-gap: 8px;
    --mg-status-font-size: 1em;
}`;
}
