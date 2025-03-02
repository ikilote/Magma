import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { numberAttributeOrUndefined } from '@ikilote/magma';

import { MagmaInputCommon } from './input-common';

let counter = 0;

@Component({
    selector: 'mg-input-range',
    templateUrl: './input-range.component.html',
    styleUrls: ['./input-range.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule],
    providers: [
        { provide: MagmaInputCommon, useExisting: MagmaInputRange },
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MagmaInputRange), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => MagmaInputRange), multi: true },
    ],
    host: {
        '[id]': '_id()',
    },
})
export class MagmaInputRange extends MagmaInputCommon {
    override readonly componentName = 'input-range';
    protected override counter = counter++;

    readonly step = input(1, { transform: numberAttributeOrUndefined });
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
