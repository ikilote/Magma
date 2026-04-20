import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
    MagmaBlock,
    MagmaColorPickerComponent,
    MagmaContribCalendar,
    MagmaDatetimePickerComponent,
    MagmaLoaderBlock,
    MagmaLoaderTile,
    MagmaMessage,
    MagmaProgress,
    MagmaSpinner,
    MagmaTabsModule,
} from '../../../projects/ikilote/magma/src/public-api';

@Component({
    selector: 'demo-home',
    templateUrl: './demo-home.component.html',
    styleUrl: './demo-home.component.scss',
    imports: [
        RouterLink,
        MagmaSpinner,
        MagmaProgress,
        MagmaMessage,
        MagmaTabsModule,
        MagmaBlock,
        MagmaColorPickerComponent,
        MagmaDatetimePickerComponent,
        MagmaContribCalendar,
        MagmaLoaderBlock,
        MagmaLoaderTile,
    ],
})
export class DemoHomeComponent {
    readonly today = new Date().toISOString().split('T')[0];

    readonly calendar = Array.from({ length: 365 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return { date: d.toISOString().split('T')[0], value: Math.floor(Math.random() * 20) };
    });

    categories = [
        {
            name: 'Components',
            description: '20+ ready-to-use UI components.',
            link: '/component/spinner',
            count: 20,
        },
        {
            name: 'Directives',
            description: 'Angular directives to enhance your templates.',
            link: '/directive/tooltip',
            count: 9,
        },
        {
            name: 'Pipes',
            description: 'Utility pipes to transform your data.',
            link: '/pipe/num-format',
            count: 8,
        },
        {
            name: 'Services',
            description: 'Reusable services for your applications.',
            link: '/service/cache',
            count: 3,
        },
        {
            name: 'Utils',
            description: 'Utility functions for every use case.',
            link: '/utils/array',
            count: 16,
        },
        {
            name: 'Styles',
            description: 'Design system: palette, grid, icons.',
            link: '/style/palette',
            count: 5,
        },
    ];
}
