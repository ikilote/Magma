import { ChangeDetectionStrategy, Component, ElementRef, OnInit, forwardRef, output, viewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { MagmaInputCommon } from './input-common';

@Component({
    selector: 'mg-input-text',
    templateUrl: './input-text.component.html',
    styleUrls: ['./input-text.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MagmaInputText), multi: true }],
})
export class MagmaInputText extends MagmaInputCommon implements OnInit {
    readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');

    readonly update = output<string>();

    get inputElement(): HTMLInputElement {
        return this.input()?.nativeElement;
    }

    changeValue(event: Event) {
        const value = ((event as InputEvent).target as HTMLInputElement).value;
        console.log('change', value);
        this.onChange(value);
        this.update.emit(value);
    }
    inputValue(event: Event) {
        const value = ((event as InputEvent).target as HTMLInputElement).value;
        console.log('input', value);
        this.onChange(value);
    }

    focus(value: boolean) {
        console.log('focus', value);

        if (!value) {
            this.onTouched();
        }
    }
}
