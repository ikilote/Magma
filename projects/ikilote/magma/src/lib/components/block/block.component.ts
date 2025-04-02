import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'mg-block',
    templateUrl: './block.component.html',
    styleUrls: ['./block.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagmaBlock {}
