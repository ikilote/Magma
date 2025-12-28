import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'mg-loader-message',
    templateUrl: './loader-message.component.html',
    styleUrl: './loader-message.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagmaLoaderMessage {}
