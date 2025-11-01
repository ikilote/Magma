import {
    AfterContentChecked,
    ChangeDetectionStrategy,
    Component,
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
export class MagmaInputRadio extends MagmaInputCommon implements AfterContentChecked {
    override readonly componentName = 'input-radio';
    protected override counter = counter++;

    override readonly value = input.required();

    readonly checked = input(false, { transform: booleanAttribute });
    override readonly placeholder: any = undefined; // not for radio
    override readonly datalist: any = undefined; // not for radio

    protected testChecked: boolean | undefined;

    protected override _baseValue = 'checked';

    override _name = computed<string>(() => this.formControlName() || this.name() || this.host?._id() || this.uid());

    override ngOnChanges(changes: SimpleChanges): void {
        if (changes['checked']) {
            this.testChecked = changes['checked'].currentValue;
        }
    }

    override writeValue(value: any): void {
        super.writeValue(value);
        this.testChecked = value === this.value();
        this.cd.detectChanges();
    }

    ngAfterContentChecked(): void {
        this.cd.detectChanges();
    }

    _change() {
        const value = this.value();
        this.onChange(value);
        this.onTouched();
        this.update.emit(value);
    }
}
