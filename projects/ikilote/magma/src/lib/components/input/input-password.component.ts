import { Component, booleanAttribute, input } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { MagmaInputCommon } from './input-common';
import { MagmaInputText } from './input-text.component';

let counter = 0;

@Component({
    selector: 'mg-input-password',
    templateUrl: './input-password.component.html',
    styleUrl: './input-password.component.scss',
    imports: [ReactiveFormsModule],
    providers: [
        { provide: MagmaInputCommon, useExisting: MagmaInputPassword },
        { provide: NG_VALUE_ACCESSOR, useExisting: MagmaInputPassword, multi: true },
        { provide: NG_VALIDATORS, useExisting: MagmaInputPassword, multi: true },
    ],
    host: {
        '[id]': '_id()',
    },
})
export class MagmaInputPassword extends MagmaInputText {
    override readonly componentName = 'input-password';
    protected override counter = counter++;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Angular signal inputs cannot be cleanly overridden to undefined
    override readonly clearCross: any = undefined; // not for password
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Angular signal inputs cannot be cleanly overridden to undefined
    override readonly datalist: any = undefined; // not for password

    readonly eye = input(null, { transform: booleanAttribute });
    /** Label for the show-password toggle button (visible state). Defaults to English. */
    readonly hidePasswordLabel = input('Hide password');
    /** Label for the show-password toggle button (hidden state). Defaults to English. */
    readonly showPasswordLabel = input('Show password');

    protected show = false;

    toggleShowPassword() {
        this.show = !this.show;
    }
}
