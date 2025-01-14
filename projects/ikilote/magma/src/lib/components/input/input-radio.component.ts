import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    booleanAttribute,
    computed,
    forwardRef,
    input,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { MagmaInputCommon } from './input-common';

let counter = 0;

@Component({
    selector: 'mg-input-radio',
    templateUrl: './input-radio.component.html',
    styleUrls: ['./input-radio.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MagmaInputRadio), multi: true }],
    host: {
        '[id]': '_id()',
    },
})
export class MagmaInputRadio extends MagmaInputCommon implements OnInit {
    protected override componentName = 'input-radio';
    protected override counter = counter++;

    override readonly value = input.required();

    readonly checked = input(false, { transform: booleanAttribute });

    _checked = computed(() => this.testChecked ?? this.checked());

    protected override _baseValue = 'checked';

    protected testChecked: boolean | undefined;

    override _name = computed<string>(() => this.formControlName() || this.name() || this.host._id() || this.uid());

    override writeValue(value: any): void {
        super.writeValue(value);
        this.testChecked = value === this.value();
    }

    _change(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.onChange(value);
        this.update.emit(value);
    }
}
