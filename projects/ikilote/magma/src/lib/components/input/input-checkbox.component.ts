import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    booleanAttribute,
    computed,
    forwardRef,
    input,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { MagmaInputCommon } from './input-common';

let counter = 0;

@Component({
    selector: 'mg-input-checkbox',
    templateUrl: './input-checkbox.component.html',
    styleUrls: ['./input-checkbox.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MagmaInputCheckbox), multi: true }],
    host: {
        '[id]': '_id()',
    },
})
export class MagmaInputCheckbox extends MagmaInputCommon implements OnInit {
    protected override componentName = 'input-checkbox';
    protected override counter = counter++;

    override readonly value = input.required();
    readonly checked = input(false, { transform: booleanAttribute });

    override _name = computed<string>(() => this.formControlName() || this.name() || this.host._id() || this.uid());
}
