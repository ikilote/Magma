import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'mg-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagmaInput {}
