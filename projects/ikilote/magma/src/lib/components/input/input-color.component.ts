import { ChangeDetectionStrategy, Component, ElementRef, booleanAttribute, input, viewChildren } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MagmaInputCommon } from './input-common';

import { MagmaColorPickerTexts } from '../color-picker/color-picker.component';
import { MagmaColorPicker } from '../color-picker/color-picker.directive';

let counter = 0;

@Component({
    selector: 'mg-input-color',
    templateUrl: './input-color.component.html',
    styleUrl: './input-color.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MagmaColorPicker],
    providers: [
        { provide: MagmaInputCommon, useExisting: MagmaInputColor },
        { provide: NG_VALUE_ACCESSOR, useExisting: MagmaInputColor, multi: true },
        { provide: NG_VALIDATORS, useExisting: MagmaInputColor, multi: true },
    ],
    host: {
        '[id]': '_id()',
    },
})
export class MagmaInputColor extends MagmaInputCommon<string[]> {
    override readonly componentName = 'input-color';
    protected override counter = counter++;

    readonly input = viewChildren<ElementRef<HTMLInputElement>>('input');
    readonly colorPicker = viewChildren<MagmaColorPicker>(MagmaColorPicker);

    readonly alpha = input(false, { transform: booleanAttribute });
    readonly clearButton = input(false, { transform: booleanAttribute });
    readonly texts = input<MagmaColorPickerTexts | undefined>();
    readonly palette = input<string[] | undefined>();

    override readonly placeholder: any = undefined; // not for color

    override get inputElement(): HTMLInputElement | undefined {
        return this.input()?.[0]?.nativeElement;
    }

    get inputDirective(): MagmaColorPicker | undefined {
        return this.colorPicker()?.[0];
    }

    colorClose(color: string) {
        this.onChange(color);
        this.writeValue(color);
        this.onTouched();
        if (this.ngControl?.control) {
            this.validate(this.ngControl.control);
        }
    }
}
