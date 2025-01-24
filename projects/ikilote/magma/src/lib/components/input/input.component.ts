import {
    ChangeDetectionStrategy,
    Component,
    booleanAttribute,
    computed,
    contentChildren,
    input,
    signal,
} from '@angular/core';
import { NgControl } from '@angular/forms';

import { MagmaInputCommon } from './input-common';

let counter = 0;

@Component({
    selector: 'mg-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[id]': '_id()',
    },
})
export class MagmaInput {
    readonly id = input<string>();

    /** for checkbox */
    readonly arrayValue = input(false, { transform: booleanAttribute });

    protected counter = counter++;
    protected uid = computed<string>(() => `mg-input-${this.counter}`);

    _id = computed<string>(() => this.id() || this.uid());

    ngControl: NgControl | null = null;

    _errorMessage = signal<string | null>(null);

    readonly inputs = contentChildren(MagmaInputCommon);
}
