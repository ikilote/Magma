import { Directive, NgModule } from '@angular/core';

import { MagmaEllipsisButton } from './ellipsis-button.component';
import { MagmaEllipsisItemComponent } from './ellipsis-item.component';

@Directive({ selector: 'mg-ellipsis-content' })
export class MagmaEllipsisContentDirective {}

const MagmaEllipsisButtonComponent = [MagmaEllipsisButton, MagmaEllipsisContentDirective, MagmaEllipsisItemComponent];

@NgModule({
    imports: [MagmaEllipsisButtonComponent],
    exports: [MagmaEllipsisButtonComponent],
})
export class MagmaEllipsisButtonModule {}
