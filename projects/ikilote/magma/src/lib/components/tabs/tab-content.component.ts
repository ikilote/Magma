import { Component, input, model } from '@angular/core';

@Component({
    selector: 'mg-tab-content',
    templateUrl: './tab-content.component.html',
    styleUrl: './tab-content.component.scss',
    host: {
        '[attr.id]': '"tab-content-" + id()',
    },
})
export class MagmaTabContent {
    // input

    readonly id = input.required<string>();
    readonly selected = model<boolean>(false);
}
