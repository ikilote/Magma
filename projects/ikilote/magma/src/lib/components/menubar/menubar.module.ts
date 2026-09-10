import { NgModule } from '@angular/core';

import { MagmaMenuDropdownComponent } from './menu-dropdown.component';
import { MagmaMenuItemDirective } from './menu-item.component';
import { MagmaMenuDirective } from './menu.component';
import { MagmaMenubarComponent } from './menubar.component';

const MENUBAR_COMPONENTS = [
    MagmaMenubarComponent,
    MagmaMenuDropdownComponent,
    MagmaMenuDirective,
    MagmaMenuItemDirective,
];

@NgModule({
    imports: [MENUBAR_COMPONENTS],
    exports: [MENUBAR_COMPONENTS],
})
export class MagmaMenubarModule {}
