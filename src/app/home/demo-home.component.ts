import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
    MagmaAccordion,
    MagmaBadge,
    MagmaBadgeLabel,
    MagmaBlock,
    MagmaBreadcrumbsModule,
    MagmaColorPickerComponent,
    MagmaContribCalendar,
    MagmaDatetimePickerComponent,
    MagmaExpansionContent,
    MagmaExpansionHeader,
    MagmaExpansionPanel,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputRange,
    MagmaInputSelect,
    MagmaInputText,
    MagmaMenuDirective,
    MagmaMenuItemDirective,
    MagmaMenubarComponent,
    MagmaMessage,
    MagmaProgress,
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
        MagmaProgress,
        MagmaMessage,
        MagmaTabsModule,
        MagmaBlock,
        MagmaColorPickerComponent,
        MagmaDatetimePickerComponent,
        MagmaContribCalendar,
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
        MagmaAccordion,
        MagmaExpansionContent,
        MagmaExpansionHeader,
        MagmaExpansionPanel,
        MagmaMenubarComponent,
        MagmaMenuDirective,
        MagmaMenuItemDirective,
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
            description: '28 ready-to-use UI components.',
            link: '/component/spinner',
            count: 28,
        },
        {
            name: 'Directives',
            description: 'Angular directives to enhance your templates.',
            link: '/directive/tooltip',
            count: 11,
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
            count: 8,
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
