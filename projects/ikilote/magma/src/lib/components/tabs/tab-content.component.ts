import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

@Component({
    selector: 'mg-tab-content',
    templateUrl: './tab-content.component.html',
    styleUrls: ['./tab-content.component.scss'],
    host: {
        '[attr.id]': 'id()',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagmaTabContent {
    // input

    readonly id = input<string>();
    readonly selected = model<boolean>(false);
}
