import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnInit,
    booleanAttribute,
    forwardRef,
    input,
    output,
    viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { MagmaInputCommon } from './input-common';

import { MagmaColorPicker } from '../color-picker/color-picker.directive';

@Component({
    selector: 'mg-input-color',
    templateUrl: './input-color.component.html',
    styleUrls: ['./input-color.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MagmaColorPicker],
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MagmaInputColor), multi: true }],
})
export class MagmaInputColor extends MagmaInputCommon implements OnInit {
    readonly span = viewChild.required<ElementRef<HTMLSpanElement>>('span');

    readonly alpha = input(false, { transform: booleanAttribute });
    readonly disabled = input(false, { transform: booleanAttribute });

    readonly update = output<string>();

    get inputElement(): HTMLSpanElement {
        return this.span()?.nativeElement;
    }

    colorClose(color: string) {
        this.onChange(color);
        this.writeValue(color);
    }
}
