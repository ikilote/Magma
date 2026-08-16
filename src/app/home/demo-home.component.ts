import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
    MagmaBadge,
    MagmaBadgeLabel,
    MagmaBlock,
    MagmaBreadcrumbsModule,
    MagmaColorPickerComponent,
    MagmaContribCalendar,
    MagmaDatetimePickerComponent,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputRange,
    MagmaInputSelect,
    MagmaInputText,
    MagmaLoaderBlock,
    MagmaLoaderTile,
    MagmaMessage,
    MagmaProgress,
    MagmaSpinner,
    MagmaTabsModule,
    MagmaTagListModule,
    Select2OptionDirective,
} from '@ikilote/magma';

@Component({
    selector: 'demo-home',
    templateUrl: './demo-home.component.html',
    styleUrl: './demo-home.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        RouterLink,
        FormsModule,
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
        MagmaInput,
        MagmaInputElement,
        MagmaInputText,
        MagmaInputNumber,
        MagmaInputRange,
        MagmaInputCheckbox,
        MagmaInputSelect,
        MagmaBadge,
        MagmaBadgeLabel,
        MagmaBreadcrumbsModule,
        MagmaTagListModule,
        Select2OptionDirective,
    ],
})
export class DemoHomeComponent {
    readonly today = new Date().toISOString().split('T')[0];

    readonly tagListDemo = signal(['Angular', 'TypeScript', 'CSS']);

    readonly calendar = Array.from({ length: 365 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return { date: d.toISOString().split('T')[0], value: Math.floor(Math.random() * 20) };
    });

    categories = [
        {
            name: 'Components',
            description: '30 ready-to-use UI components.',
            link: '/component/spinner',
            count: 30,
        },
        {
            name: 'Directives',
            description: 'Angular directives to enhance your templates.',
            link: '/directive/tooltip',
            count: 10,
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
            count: 6,
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
            count: 8,
        },
    ];
}
