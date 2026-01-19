import { CommonModule } from '@angular/common';
import {
    AfterContentChecked,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnChanges,
    SimpleChanges,
    booleanAttribute,
    computed,
    contentChildren,
    inject,
    input,
    signal,
} from '@angular/core';
import { NgControl } from '@angular/forms';

import { MagmaInputCommon } from './input-common';

let counter = 0;

@Component({
    selector: 'mg-input',
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule],
    host: {
        '[id]': '_id()',
    },
})
export class MagmaInput implements OnChanges, AfterContentChecked {
    readonly cd = inject(ChangeDetectorRef);

    readonly id = input<string>();

    forId = signal<string | undefined>(undefined);

    /** for checkbox */
    readonly arrayValue = input(false, { transform: booleanAttribute });
    readonly forceValue = input(false, { transform: booleanAttribute });
    /** for checkbox & radio */
    readonly alignMode = input<'row' | 'column'>('row');

    protected counter = counter++;
    protected uid = computed<string>(() => `mg-input-${this.counter}`);

    _id = computed<string>(() => this.id() || this.uid());

    ngControl: NgControl | null = null;

    _errorMessage = signal<string | null>(null);

    readonly inputs = contentChildren(MagmaInputCommon);

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['arrayValue'] && this.inputs()[0]?.componentName === 'input-checkbox') {
            this.inputs()[0].onChange(this.inputs()[0].getValue());
        }
    }

    ngAfterContentChecked(): void {
        if (this.inputs()?.length) {
            this.inputs().forEach(e => {
                e.host ??= this;
                // force to update computed name
                e.refreshTrigger?.set(null);
            });
        }
    }
}
