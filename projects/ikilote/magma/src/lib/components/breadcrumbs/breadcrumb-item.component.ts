import { NgTemplateOutlet } from '@angular/common';
import { Component, booleanAttribute, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'mg-breadcrumb',
    templateUrl: './breadcrumb-item.component.html',
    styleUrl: './breadcrumb-item.component.scss',
    imports: [NgTemplateOutlet, RouterLink],
})
export class MagmaBreadcrumbItem {
    /** Native href link. Use for external URLs or simple anchors. */
    readonly href = input<string | undefined>();

    /** Angular routerLink. Use for SPA navigation. */
    readonly link = input<string | string[] | undefined>();

    /** Marks this item as the current page (last item in the breadcrumb) */
    readonly active = input(false, { transform: booleanAttribute });
}
