import { Directive, NgModule } from '@angular/core';

import { MagmaExpansionPanel } from './expansion-panel.component';

@Directive({ selector: 'mg-expansion-header' })
export class MagmaExpansionHeader {}

@Directive({ selector: 'mg-expansion-content' })
export class MagmaExpansionContent {}

const MagmaExpansionComponent = [MagmaExpansionPanel, MagmaExpansionContent, MagmaExpansionHeader];

@NgModule({
    imports: [MagmaExpansionComponent],
    exports: [MagmaExpansionComponent],
})
export class MagmaExpansionPanelModule {}
