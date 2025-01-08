import { Component } from '@angular/core';

import { Highlight } from 'ngx-highlightjs';

@Component({
    selector: 'demo-icons',
    templateUrl: './demo-icons.component.html',
    styleUrls: ['./demo-icons.component.scss'],
    imports: [Highlight],
})
export class DemoIconsComponent {
    listIcons = [
        'icon-add',
        'icon-arrow-down-1FBA6',
        'icon-background-color',
        'icon-bookmark',
        'icon-browser',
        'icon-clone',
        'icon-down',
        'icon-edit',
        'icon-edit-2',
        'icon-enlarge',
        'icon-expand',
        'icon-fullscreen',
        'icon-group',
        'icon-home',
        'icon-info',
        'icon-left',
        'icon-licenses',
        'icon-login',
        'icon-logout',
        'icon-minimize',
        'icon-minimize-2',
        'icon-mode-columns',
        'icon-mode-axis',
        'icon-mode-bingo',
        'icon-mode-iceberg',
        'icon-mode-teams',
        'icon-mode-tierlist',
        'icon-moon',
        'icon-not-verified',
        'icon-params',
        'icon-power',
        'icon-private',
        'icon-private-search',
        'icon-profile',
        'icon-public',
        'icon-public-search',
        'icon-reduce',
        'icon-remove',
        'icon-right',
        'icon-save-server',
        'icon-search',
        'icon-server',
        'icon-share',
        'icon-signup',
        'icon-sun',
        'icon-text-color',
        'icon-tile',
        'icon-up',
        'icon-validated-A1',
        'icon-validated-A2',
        'icon-validated-A3',
        'icon-validated-B1',
        'icon-validated-B2',
        'icon-validated-B3',
        'icon-validated-C1',
        'icon-validated-C2',
        'icon-validated-C3',
        'icon-validated-D1',
        'icon-validated-D2',
        'icon-validated-D3',
        'icon-validated-E1',
        'icon-validated-E2',
        'icon-validated-E3',
        'icon-deleted',
        'icon-admin',
        'icon-moderator',
        'icon-banned',
        'icon-validated',
        'icon-user',
    ];

    selectedIcon: string | undefined;
    selectedIconCode: string | undefined;

    select(icon: string) {
        this.selectedIcon = icon;
        this.selectedIconCode = `<span class="${icon}"></span>`;
    }
}
