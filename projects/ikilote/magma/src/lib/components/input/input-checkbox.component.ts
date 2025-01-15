import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    SimpleChanges,
    booleanAttribute,
    computed,
    forwardRef,
    input,
    output,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { MagmaInputCommon } from './input-common';

let counter = 0;

@Component({
    selector: 'mg-input-checkbox',
    templateUrl: './input-checkbox.component.html',
    styleUrls: ['./input-checkbox.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: MagmaInputCommon, useExisting: MagmaInputCheckbox },
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MagmaInputCheckbox), multi: true },
    ],
    host: {
        '[id]': '_id()',
    },
})
export class MagmaInputCheckbox extends MagmaInputCommon implements OnInit {
    override readonly componentName = 'input-checkbox';
    protected override counter = counter++;
    protected override _baseValue = 'checked';

    override readonly value = input();
    readonly checked = input(false, { transform: booleanAttribute });

    protected testChecked: boolean | undefined;

    override _name = computed<string>(() => this.formControlName() || this.name() || this.host._id() || this.uid());

    readonly itemUpdate = output<boolean>();

    override ngOnChanges(changes: SimpleChanges): void {
        if (changes['checked']) {
            this.testChecked = changes['checked'].currentValue;
        }
    }

    override writeValue(value: any): void {
        this.testChecked =
            (this.host.arrayValue() || this.host.inputs().length > 1) && Array.isArray(value)
                ? value.includes(this.value())
                : this.value()
                  ? value === this.value()
                  : value === true;

        super.writeValue(this.getValue());
    }

    _change() {
        this.testChecked = !this.testChecked;
        const value = this.getValue();
        this.onChange(value);
        this.update.emit(value);
        this.itemUpdate.emit(this.testChecked!);
    }

    getValue() {
        if (this.host.arrayValue() || this.host.inputs().length > 1) {
            const value = this.host
                .inputs()
                .filter(item => item.componentName === 'input-checkbox' && (item as MagmaInputCheckbox).testChecked)
                .map(item => item.value());
            return value;
        } else {
            return this.testChecked;
        }
    }
}
