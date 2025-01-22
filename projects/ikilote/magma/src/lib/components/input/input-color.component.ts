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

import { MagmaInputCommon } from './input-common';

import { MagmaColorPicker } from '../color-picker/color-picker.directive';

let counter = 0;

@Component({
    selector: 'mg-input-color',
    templateUrl: './input-color.component.html',
    styleUrls: ['./input-color.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MagmaColorPicker],
    providers: [
        { provide: MagmaInputCommon, useExisting: MagmaInputColor },
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MagmaInputColor), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => MagmaInputColor), multi: true },
    ],
    host: {
        '[id]': '_id()',
    },
})
export class MagmaInputColor extends MagmaInputCommon implements OnInit {
    override readonly componentName = 'input-color';
    protected override counter = counter++;

    readonly span = viewChild.required<ElementRef<HTMLSpanElement>>('span');

    readonly alpha = input(false, { transform: booleanAttribute });
    readonly disabled = input(false, { transform: booleanAttribute });

    get inputElement(): HTMLSpanElement {
        return this.span()?.nativeElement;
    }

    colorClose(color: string) {
        this.onChange(color);
        this.writeValue(color);
    }
}
