import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, viewChild } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { MagmaInputCommon } from './input-common';

let counter = 0;

@Component({
    selector: 'mg-input-textarea',
    templateUrl: './input-textarea.component.html',
    styleUrls: ['./input-textarea.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule],
    providers: [
        { provide: MagmaInputCommon, useExisting: MagmaInputTextarea },
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MagmaInputTextarea), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => MagmaInputTextarea), multi: true },
    ],
    host: {
        '[id]': '_id()',
    },
})
export class MagmaInputTextarea extends MagmaInputCommon {
    override readonly componentName = 'input-textarea';
    protected override counter = counter++;

    readonly input = viewChild.required<ElementRef<HTMLTextAreaElement>>('input');

    get inputElement(): HTMLTextAreaElement {
        return this.input()?.nativeElement;
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
