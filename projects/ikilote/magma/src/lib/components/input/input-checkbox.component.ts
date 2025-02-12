import {
    ChangeDetectionStrategy,
    Component,
    DoCheck,
    ElementRef,
    OnInit,
    SimpleChanges,
    booleanAttribute,
    computed,
    forwardRef,
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
    styleUrls: ['./input-checkbox.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: MagmaInputCommon, useExisting: MagmaInputCheckbox },
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MagmaInputCheckbox), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => MagmaInputCheckbox), multi: true },
    ],
    host: {
        '[id]': '_id()',
        '[class.toggle-switch]': "mode() === 'toggle'",
    },
})
export class MagmaInputCheckbox extends MagmaInputCommon implements OnInit, DoCheck {
    override readonly componentName = 'input-checkbox';
    protected override counter = counter++;
    protected override _baseValue = 'checked';

    override readonly value = input();
    readonly checked = input(false, { transform: booleanAttribute });
    readonly mode = input<'checkbox' | 'toggle'>();

    protected testChecked: boolean | undefined;
    override readonly placeholder: any = undefined; // not for checkbox

    override _name = computed<string>(() => this.formControlName() || this.name() || this.host._id() || this.uid());

    readonly label = viewChildren<ElementRef<HTMLLabelElement>>('ref');

    readonly itemUpdate = output<boolean>();

    override ngOnInit(): void {
        super.ngOnInit();
    }

    override ngOnChanges(changes: SimpleChanges): void {
        if (changes['checked']) {
            this.testChecked = changes['checked'].currentValue;
        }
    }

    ngDoCheck() {
        if (
            this.host.forId !== `${this._id()}-input` &&
            this.host.inputs().filter(item => item.componentName === this.componentName).length === 1 &&
            this.label() &&
            !this.label()[0]?.nativeElement.innerHTML.trim()
        ) {
            // For single checkboxes without label
            this.setHostLabelId();
        } else if (
            (this.host.inputs().filter(item => item.componentName === this.componentName).length > 1 ||
                this.label()?.[0]?.nativeElement.innerHTML.trim()) &&
            this.host.forId
        ) {
            this.host.forId = undefined;
            this.host.cd.detectChanges();
        }
    }

    override writeValue(value: any): void {
        this.testChecked =
            (this.host.arrayValue() || this.host.inputs().length > 1) && Array.isArray(value)
                ? value.includes(this.value())
                : this.value()
                  ? value === this.value()
                  : value === true;

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
        if (this.host.arrayValue() || this.host.inputs().length > 1) {
            const value = this.host
                .inputs()
                .filter(item => item.componentName === this.componentName && (item as MagmaInputCheckbox).testChecked)
                .map(item => item.value());
            return value;
        } else {
            return this.testChecked;
        }
    }
}
