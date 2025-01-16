import { ChangeDetectionStrategy, Component, ElementRef, OnInit, forwardRef, viewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { MagmaInputCommon } from './input-common';

let counter = 0;

@Component({
    selector: 'mg-input-text',
    templateUrl: './input-text.component.html',
    styleUrls: ['./input-text.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: MagmaInputCommon, useExisting: MagmaInputText },
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MagmaInputText), multi: true },
    ],
    host: {
        '[id]': '_id()',
    },
})
export class MagmaInputText extends MagmaInputCommon implements OnInit {
    override readonly componentName = 'input-text';
    protected override counter = counter++;

    readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');

    get inputElement(): HTMLInputElement {
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

    focus(value: boolean) {
        if (!value) {
            this.onTouched();
        }
    }
}
