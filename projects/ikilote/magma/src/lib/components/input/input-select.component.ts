import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnInit,
    booleanAttribute,
    forwardRef,
    input,
    viewChild,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Select2, Select2Data, Select2UpdateEvent, Select2UpdateValue } from 'ng-select2-component';

import { MagmaInputCommon } from './input-common';

let counter = 0;

@Component({
    selector: 'mg-input-select',
    templateUrl: './input-select.component.html',
    styleUrls: ['./input-select.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: MagmaInputCommon, useExisting: MagmaInputSelect },
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MagmaInputSelect), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => MagmaInputSelect), multi: true },
    ],
    host: {
        '[id]': '_id()',
    },
    imports: [Select2],
})
export class MagmaInputSelect extends MagmaInputCommon implements OnInit {
    override readonly componentName = 'input-select';
    protected override counter = counter++;

    readonly data = input.required<Select2Data>();
    readonly multiple = input(false, { transform: booleanAttribute });

    readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');

    changeValue(event: Select2UpdateEvent<Select2UpdateValue>) {
        const value = event.value;
        this.onChange(value);
        this.update.emit(value);
    }

    focus(value: boolean) {
        if (!value) {
            this.onTouched();
            if (this.ngControl?.control) {
                this.validate(this.ngControl.control);
            }
        }
    }
}
