import { Component, input } from '@angular/core';

@Component({
    selector: 'mg-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrl: './breadcrumbs.component.scss',
    host: {
        '[style.--breadcrumbs-separator]': 'separator() ? `"${separator()?.trim()}"` : undefined',
    },
})
export class MagmaBreadcrumbs {
    /** interval separator */
    readonly separator = input<string | undefined>();
}
