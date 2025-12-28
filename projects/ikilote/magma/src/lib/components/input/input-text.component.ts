import { ChangeDetectionStrategy, Component, ElementRef, booleanAttribute, input, viewChildren } from '@angular/core';
import { FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { MagmaInputCommon } from './input-common';

import { numberAttributeOrUndefined } from '../../utils/coercion';

let counter = 0;

@Component({
    selector: 'mg-input-text',
    templateUrl: './input-text.component.html',
    styleUrl: './input-text.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, FormsModule],
    providers: [
        { provide: MagmaInputCommon, useExisting: MagmaInputText },
        { provide: NG_VALUE_ACCESSOR, useExisting: MagmaInputText, multi: true },
        { provide: NG_VALIDATORS, useExisting: MagmaInputText, multi: true },
    ],
    host: {
        '[id]': '_id()',
    },
})
export class MagmaInputText extends MagmaInputCommon<(string | { label?: string; value: string })[]> {
    override readonly componentName: string = 'input-text';
    protected override counter = counter++;

    readonly maxlength = input(undefined, { transform: numberAttributeOrUndefined });
    readonly clearCross = input(null, { transform: booleanAttribute });
    readonly type = input<'text' | 'email' | 'url' | 'tel'>('text');

    readonly input = viewChildren<ElementRef<HTMLInputElement>>('input');

    override get inputElement(): HTMLInputElement | undefined {
        return this.input()?.[0]?.nativeElement;
    }

    override writeValue(value: any): void {
        super.writeValue(value);
        this.inputElement!.value = value ?? '';
    }

    changeValue(event: Event) {
        const value = ((event as InputEvent).target as HTMLInputElement).value;
        super.writeValue(value);
        this.onChange(value);
        this.update.emit(value);
    }

    inputValue(event: Event) {
        const value = ((event as InputEvent).target as HTMLInputElement).value;
        super.writeValue(value);
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
        super.writeValue('');
        this.onChange('');
        this.update.emit('');
    }
}
