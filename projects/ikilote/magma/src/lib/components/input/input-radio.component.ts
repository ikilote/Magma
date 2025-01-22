import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    SimpleChanges,
    booleanAttribute,
    computed,
    forwardRef,
    input,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MagmaInputCommon } from './input-common';

let counter = 0;

@Component({
    selector: 'mg-input-radio',
    templateUrl: './input-radio.component.html',
    styleUrls: ['./input-radio.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: MagmaInputCommon, useExisting: MagmaInputRadio },
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MagmaInputRadio), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => MagmaInputRadio), multi: true },
    ],
    host: {
        '[id]': '_id()',
    },
})
export class MagmaInputRadio extends MagmaInputCommon implements OnInit {
    override readonly componentName = 'input-radio';
    protected override counter = counter++;

    override readonly value = input.required();

    readonly checked = input(false, { transform: booleanAttribute });

    protected testChecked: boolean | undefined;

    protected override _baseValue = 'checked';

    override _name = computed<string>(() => this.formControlName() || this.name() || this.host._id() || this.uid());

    override ngOnChanges(changes: SimpleChanges): void {
        if (changes['checked']) {
            this.testChecked = changes['checked'].currentValue;
        }
    }

    override writeValue(value: any): void {
        super.writeValue(value);
        this.testChecked = value === this.value();
    }

    _change() {
        const value = this.value();
        this.onChange(value);
        this.update.emit(value);
    }
}
