import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'mg-loader-block',
    templateUrl: './loader-block.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './loader-block.component.scss',
})
export class MagmaLoaderBlock {}
