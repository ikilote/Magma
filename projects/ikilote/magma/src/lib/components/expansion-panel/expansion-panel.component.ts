import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'mg-expansion-panel',
    templateUrl: './expansion-panel.component.html',
    styleUrls: ['./expansion-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagmaExpansionPanel {}
