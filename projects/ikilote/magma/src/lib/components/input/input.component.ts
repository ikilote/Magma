import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

let counter = 0;

@Component({
    selector: 'mg-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[id]': '_id()',
    },
})
export class MagmaInput {
    readonly id = input<string>();

    protected counter = counter++;
    protected uid = computed<string>(() => `mg-input-${this.counter}`);

    _id = computed<string>(() => this.id() || this.uid());
}
