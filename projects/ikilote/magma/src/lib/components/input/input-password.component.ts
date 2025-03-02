import { ChangeDetectionStrategy, Component, booleanAttribute, forwardRef, input } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { MagmaInputCommon } from './input-common';
import { MagmaInputText } from './input-text.component';

let counter = 0;

@Component({
    selector: 'mg-input-password',
    templateUrl: './input-password.component.html',
    styleUrls: ['./input-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule],
    providers: [
        { provide: MagmaInputCommon, useExisting: MagmaInputPassword },
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MagmaInputPassword), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => MagmaInputPassword), multi: true },
    ],
    host: {
        '[id]': '_id()',
    },
})
export class MagmaInputPassword extends MagmaInputText {
    override readonly componentName = 'input-password';
    protected override counter = counter++;

    override readonly clearCross: any = undefined; // not for password
    override readonly datalist: any = undefined; // not for password

    readonly eye = input(null, { transform: booleanAttribute });

    protected show = false;

    toggleShowPassword() {
        this.show = !this.show;
    }
}
