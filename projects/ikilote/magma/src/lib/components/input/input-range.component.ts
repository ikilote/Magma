import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { MagmaInputCommon } from './input-common';

import { numberAttributeOrUndefined } from '../../utils/coercion';

let counter = 0;

@Component({
    selector: 'mg-input-range',
    templateUrl: './input-range.component.html',
    styleUrls: ['./input-range.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule],
    providers: [
        { provide: MagmaInputCommon, useExisting: MagmaInputRange },
        { provide: NG_VALUE_ACCESSOR, useExisting: MagmaInputRange, multi: true },
        { provide: NG_VALIDATORS, useExisting: MagmaInputRange, multi: true },
    ],
    host: {
        '[id]': '_id()',
    },
})
export class MagmaInputRange extends MagmaInputCommon<number[]> {
    override readonly componentName = 'input-range';
    protected override counter = counter++;

    readonly step = input(undefined, { transform: numberAttributeOrUndefined });
    readonly min = input(undefined, { transform: numberAttributeOrUndefined });
    readonly max = input(undefined, { transform: numberAttributeOrUndefined });

    changeValue(event: Event) {
        this.update.emit(this.inputValue(event));
    }

    inputValue(event: Event) {
        const value = +this.getInput(event).value;
        this._value = value;
        this.onChange(value);
        return value;
    }

    private getInput(event: Event): HTMLInputElement {
        return (event as InputEvent).target as HTMLInputElement;
    }
}
