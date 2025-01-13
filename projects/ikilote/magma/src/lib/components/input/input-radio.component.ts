import { ChangeDetectionStrategy, Component, OnInit, computed, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { MagmaInputCommon } from './input-common';

let counter = 0;

@Component({
    selector: 'mg-input-radio',
    templateUrl: './input-radio.component.html',
    styleUrls: ['./input-radio.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MagmaInputRadio), multi: true }],
    host: {
        '[id]': '_id()',
    },
})
export class MagmaInputRadio extends MagmaInputCommon implements OnInit {
    protected override componentName = 'input-radio';
    protected override counter = counter++;

    override _name = computed<string>(() => this.formControlName() || this.name() || this.host._id() || this.uid());
}
