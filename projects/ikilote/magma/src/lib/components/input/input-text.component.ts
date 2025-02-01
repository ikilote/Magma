import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    booleanAttribute,
    forwardRef,
    input,
    viewChild,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { MagmaInputCommon } from './input-common';

import { numberAttributeOrUndefined } from '../../utils/coercion';

let counter = 0;

@Component({
    selector: 'mg-input-text',
    templateUrl: './input-text.component.html',
    styleUrls: ['./input-text.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule],
    providers: [
        { provide: MagmaInputCommon, useExisting: MagmaInputText },
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MagmaInputText), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => MagmaInputText), multi: true },
    ],
    host: {
        '[id]': '_id()',
    },
})
export class MagmaInputText extends MagmaInputCommon {
    override readonly componentName: string = 'input-text';
    protected override counter = counter++;

    readonly maxlength = input(undefined, { transform: numberAttributeOrUndefined });
    readonly clearCross = input(null, { transform: booleanAttribute });

    readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');

    get inputElement(): HTMLInputElement | undefined {
        return this.input()?.nativeElement;
    }

    changeValue(event: Event) {
        const value = ((event as InputEvent).target as HTMLInputElement).value;
        this.onChange(value);
        this.update.emit(value);
    }

    inputValue(event: Event) {
        const value = ((event as InputEvent).target as HTMLInputElement).value;
        this.onChange(value);
    }

    focus(focus: boolean) {
        if (!focus) {
            this.onTouched();
            if (this.ngControl?.control) {
                this.validate(this.ngControl.control);
            }
        }
    }

    clearField() {
        this.inputElement!.value = '';
    }
}
