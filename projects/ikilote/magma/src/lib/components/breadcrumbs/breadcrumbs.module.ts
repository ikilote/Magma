import { NgModule } from '@angular/core';

import { MagmaBreadcrumbItem } from './breadcrumb-item.component';
import { MagmaBreadcrumbs } from './breadcrumbs.component';

const MagmaBreadcrumbsComponents = [MagmaBreadcrumbs, MagmaBreadcrumbItem];

@NgModule({
    imports: [MagmaBreadcrumbsComponents],
    exports: [MagmaBreadcrumbsComponents],
})
export class MagmaBreadcrumbsModule {}
