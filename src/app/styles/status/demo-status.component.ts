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
    basic = `<span class="status status-success">Online</span>
<span class="status status-warning">Degraded</span>
<span class="status status-danger">Offline</span>
<span class="status status-info">Processing</span>
<span class="status status-neutral">Unknown</span>
<span class="status status-offline">Disconnected</span>`;

    dotOnly = `<span class="status status-success"></span>
<span class="status status-warning"></span>
<span class="status status-danger"></span>
<span class="status status-info"></span>`;

    pulse = `<span class="status status-success status-pulse">Live</span>
<span class="status status-danger status-pulse">Recording</span>`;

    cssVars = `/* Customize globally or scoped */
.my-status {
    --status-dot-size: 10px;
    --status-gap: 8px;
    --status-font-size: 1em;
}`;
}
