import { NgModule } from '@angular/core';

import { MagmaTabContent } from './tab-content.component';
import { MagmaTabTitle } from './tab-title.component';
import { MagmaTabs } from './tabs.component';

const MagmaTabsComponent = [MagmaTabs, MagmaTabTitle, MagmaTabContent];

@NgModule({
    imports: [MagmaTabsComponent],
    exports: [MagmaTabsComponent],
})
export class MagmaTabsModule {}
