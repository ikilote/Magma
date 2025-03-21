import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    TemplateRef,
    booleanAttribute,
    forwardRef,
    input,
    numberAttribute,
    output,
    viewChildren,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import {
    Select2,
    Select2AutoCreateEvent,
    Select2Data,
    Select2RemoveEvent,
    Select2ScrollEvent,
    Select2SearchEvent,
    Select2SelectionOverride,
    Select2Template,
    Select2UpdateEvent,
    Select2UpdateValue,
} from 'ng-select2-component';

import { MagmaInputCommon } from './input-common';

let counter = 0;

@Component({
    selector: 'mg-input-select',
    templateUrl: './input-select.component.html',
    styleUrls: ['./input-select.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: MagmaInputCommon, useExisting: MagmaInputSelect },
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MagmaInputSelect), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => MagmaInputSelect), multi: true },
    ],
    host: {
        '[id]': '_id()',
    },
    imports: [Select2],
})
export class MagmaInputSelect extends MagmaInputCommon implements OnInit {
    override readonly componentName = 'input-select';
    protected override counter = counter++;

    override readonly datalist: any = undefined; // not for select

    // ----------------------- input
    readonly data = input.required<Select2Data>();

    /** minimum characters to start filter search */
    readonly minCharForSearch = input(0, { transform: numberAttribute });

    /** text placeholder */
    readonly displaySearchStatus = input<'default' | 'hidden' | 'always' | undefined>(undefined);

    /** in multiple: maximum selection element (0 = no limit) */
    readonly limitSelection = input(0, { transform: numberAttribute });

    /** dropdown position */
    readonly listPosition = input<'above' | 'below' | 'auto'>('below');

    /** overlay with CDK Angular position */
    readonly overlay = input(false, { transform: booleanAttribute });

    /** select one or more item */
    readonly multiple = input(false, { transform: booleanAttribute });

    /** drag'n drop list of items in multiple */
    readonly multipleDrag = input(false, { transform: booleanAttribute });

    /** use the material style */
    readonly styleMode = input<'material' | 'noStyle' | 'borderless' | 'default'>('default');

    /** message when no result */
    readonly noResultMessage = input<string>();

    /** maximum results limit (0 = no limit) */
    readonly maxResults = input(0, { transform: numberAttribute });

    /** message when maximum results */
    readonly maxResultsMessage = input('Too many results…');

    /** infinite scroll distance */
    readonly infiniteScrollDistance = input(1.5, { transform: numberAttribute });

    /** infinite scroll distance */
    readonly infiniteScrollThrottle = input(150, { transform: numberAttribute });

    /** infinite scroll activated */
    readonly infiniteScroll = input(false, { transform: booleanAttribute });

    /** auto create if not exist */
    readonly autoCreate = input(false, { transform: booleanAttribute });

    /** no template for label selection */
    readonly noLabelTemplate = input(false, { transform: booleanAttribute });

    /** use it for change the pattern of the filter search */
    readonly editPattern = input<((str: string) => string) | undefined>(undefined);

    /** template(s) for formatting */
    readonly templates = input<Select2Template>(undefined);

    /** template for formatting selected option */
    readonly templateSelection = input<TemplateRef<any> | undefined>(undefined);

    /** the max height of the results container when opening the select */
    readonly resultMaxHeight = input('200px');

    /** Active Search event */
    readonly customSearchEnabled = input(false, { transform: booleanAttribute });

    /** minimal data of show the search field */
    readonly minCountForSearch = input(undefined, { transform: numberAttribute });

    /** Whether items are hidden when has. */
    readonly hideSelectedItems = input(false, { transform: booleanAttribute });

    /** Tab index for the select2 element. */
    readonly tabIndex = input(0, { transform: numberAttribute });

    /** reset with no selected value */
    readonly resettable = input(false, { transform: booleanAttribute });

    /** selected value when × is clicked */
    readonly resetSelectedValue = input<any>(undefined);

    /** grid: item by line
     * * 0 = no grid
     * * number = item by line (4)
     * * string = minimal size item (100px)
     */
    readonly grid = input('');

    /**
     * Replace selection by a text
     * * if string: `%size%` = total selected options
     * * if function: juste show the string
     */
    readonly selectionOverride = input<Select2SelectionOverride | undefined>(undefined);

    /** force selection on one line */
    readonly selectionNoWrap = input(false, { transform: booleanAttribute });

    /** Add an option to select or remove all (if all is selected) */
    readonly showSelectAll = input(false, { transform: booleanAttribute });

    /** Text for remove all options */
    readonly removeAllText = input('Remove all');

    /** Text for select all options */
    readonly selectAllText = input('Select all');

    // -- WAI related inputs ---

    /** title attribute applied to the input */
    readonly title = input<string>();

    /** aria-labelledby attribute applied to the input, to specify en external label */
    readonly ariaLabelledby = input<string>();

    /** aria-describedby attribute applied to the input */
    readonly ariaDescribedby = input<string>();

    /** aria-invalid attribute applied to the input, to force error state */
    readonly ariaInvalid = input<boolean, unknown>(false, { transform: booleanAttribute });

    /** description of the reset button when using 'resettable'. Default value : 'Reset' */
    readonly ariaResetButtonDescription = input<string>('Reset');

    /** like native select keyboard navigation (only single mode) */
    readonly nativeKeyboard = input<boolean, unknown>(false, { transform: booleanAttribute });

    // ----------------------- output

    readonly autoCreateItem = output<Select2AutoCreateEvent<Select2UpdateValue>>();
    readonly open = output<Select2>();
    readonly close = output<Select2>();
    readonly focus = output<Select2>();
    readonly blur = output<Select2>();
    readonly search = output<Select2SearchEvent<Select2UpdateValue>>();
    readonly scroll = output<Select2ScrollEvent>();
    readonly removeOption = output<Select2RemoveEvent<Select2UpdateValue>>();

    // ----------------------- internal

    readonly input = viewChildren(Select2);

    override get inputElement(): Select2 | undefined {
        return this.input()?.[0];
    }

    override writeValue(value: any): void {
        super.writeValue(value);
        this.inputElement?.writeValue(value);
    }

    changeValue(event: Select2UpdateEvent<Select2UpdateValue>) {
        const value = event.value;
        this.onChange(value);
        this.update.emit(value);
    }

    _focus(value: boolean, event: Select2) {
        if (!value) {
            this.blur.emit(event);
            this.onTouched();
            if (this.ngControl?.control) {
                this.validate(this.ngControl.control);
            }
        } else {
            this.focus.emit(event);
        }
    }
}
