import {
    AfterContentChecked,
    ChangeDetectionStrategy,
    Component,
    DoCheck,
    ElementRef,
    SimpleChanges,
    booleanAttribute,
    computed,
    input,
    output,
    viewChildren,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MagmaInputCommon } from './input-common';

let counter = 0;

@Component({
    selector: 'mg-input-checkbox',
    templateUrl: './input-checkbox.component.html',
    styleUrl: './input-checkbox.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: MagmaInputCommon, useExisting: MagmaInputCheckbox },
        { provide: NG_VALUE_ACCESSOR, useExisting: MagmaInputCheckbox, multi: true },
        { provide: NG_VALIDATORS, useExisting: MagmaInputCheckbox, multi: true },
    ],
    host: {
        '[id]': '_id()',
        '[class.toggle-switch]': "mode() === 'toggle'",
    },
})
export class MagmaInputCheckbox extends MagmaInputCommon implements DoCheck, AfterContentChecked {
    override readonly componentName = 'input-checkbox';
    protected override counter = counter++;
    protected override _baseValue = 'checked';

    override readonly value = input();
    readonly checked = input(false, { transform: booleanAttribute });
    readonly mode = input<'checkbox' | 'toggle'>();

    testChecked: boolean | undefined;
    override readonly placeholder: any = undefined; // not for checkbox
    override readonly datalist: any = undefined; // not for checkbox

    override _name = computed<string>(() => this.formControlName() || this.name() || this.host?._id() || this.uid());

    readonly label = viewChildren<ElementRef<HTMLLabelElement>>('ref');

    readonly itemUpdate = output<boolean>();

    override ngOnChanges(changes: SimpleChanges): void {
        if (changes['checked']) {
            this.testChecked = changes['checked'].currentValue;
        }
    }

    ngDoCheck() {
        if (this.host) {
            if (
                this.host.forId() !== `${this._id()}-input` &&
                this.host.inputs().filter(item => item.componentName === this.componentName).length === 1 &&
                this.label() &&
                !this.label()[0]?.nativeElement.innerHTML.trim()
            ) {
                // For single checkboxes without label
                this.setHostLabelId();
            } else if (
                (this.host.inputs().filter(item => item.componentName === this.componentName).length > 1 ||
                    this.label()?.[0]?.nativeElement.innerHTML.trim()) &&
                this.host.forId()
            ) {
                this.host.forId.set(undefined);
                this.host.cd.detectChanges();
            }
        }
    }

    ngAfterContentChecked(): void {
        this.cd.detectChanges();
    }

    override writeValue(value: any): void {
        this.testChecked =
            this.host && (this.host.arrayValue() || this.host.inputs().length > 1) && Array.isArray(value)
                ? value.includes(this.value())
                : this.value()
                  ? value === this.value()
                  : value === true;

        // update all other checkboxes in the group
        if (this.host && (this.host.arrayValue() || this.host.inputs().length > 1)) {
            this.host
                .inputs()
                .filter(item => item.componentName === this.componentName && item !== this)
                .forEach(item => {
                    if (item instanceof MagmaInputCheckbox) {
                        item['_value'] = this._value;
                        if (item.testChecked && !value.includes(item.value())) {
                            item.testChecked = false;
                        } else if (!item.testChecked && value.includes(item.value())) {
                            item.testChecked = true;
                        }
                    }
                });
        }

        super.writeValue(this.getValue());
    }

    _change() {
        this.testChecked = !this.testChecked;
        const value = this.getValue();
        this.onChange(value);
        this.update.emit(value);
        this.itemUpdate.emit(this.testChecked!);

        this.onTouched();
        if (this.ngControl?.control) {
            this.validate(this.ngControl.control);
        }
    }

    override getValue() {
        if (this.host && (this.host.arrayValue() || this.host.inputs().length > 1)) {
            return this.host
                .inputs()
                .filter(item => item.componentName === this.componentName && (item as MagmaInputCheckbox).testChecked)
                .map(item => item.value());
        } else {
            return this.testChecked;
        }
    }
}
