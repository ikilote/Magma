import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    booleanAttribute,
    forwardRef,
    input,
    viewChildren,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { MagmaInputCommon } from './input-common';

import { MagmaTextareaAutosizeDirective } from '../../directives/textarea-autosize.directive';
import { numberAttributeOrUndefined } from '../../utils/coercion';

let counter = 0;

@Component({
    selector: 'mg-input-textarea',
    templateUrl: './input-textarea.component.html',
    styleUrls: ['./input-textarea.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, MagmaTextareaAutosizeDirective],
    providers: [
        { provide: MagmaInputCommon, useExisting: MagmaInputTextarea },
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MagmaInputTextarea), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => MagmaInputTextarea), multi: true },
    ],
    host: {
        '[id]': '_id()',
        '[style.--min]': 'minHeight()',
        '[style.--max]': 'maxHeight()',
        '[style.--default]': 'height()',
    },
})
export class MagmaInputTextarea extends MagmaInputCommon {
    override readonly componentName = 'input-textarea';
    protected override counter = counter++;

    readonly input = viewChildren<ElementRef<HTMLTextAreaElement>>('input');

    readonly autosize = input(false, { transform: booleanAttribute });
    readonly maxlength = input(undefined, { transform: numberAttributeOrUndefined });
    readonly height = input<string>();
    readonly maxHeight = input<string>();
    readonly minHeight = input<string>();

    get inputElement(): HTMLTextAreaElement {
        return this.input()?.[0]?.nativeElement;
    }

    override writeValue(value: any): void {
        super.writeValue(value);
        this.inputElement!.value = value;
    }

    changeValue(event: Event) {
        const value = ((event as InputEvent).target as HTMLTextAreaElement).value;
        this.onChange(value);
        this.update.emit(value);
    }

    inputValue(event: Event) {
        const value = ((event as InputEvent).target as HTMLTextAreaElement).value;
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
}
