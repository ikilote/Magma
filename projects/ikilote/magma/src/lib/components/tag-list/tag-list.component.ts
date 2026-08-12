import {
    Component,
    ElementRef,
    NgModule,
    booleanAttribute,
    computed,
    contentChildren,
    forwardRef,
    input,
    output,
    signal,
    viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MagmaClickEnterDirective } from '@ikilote/magma';

import { MagmaTag } from './tag.component';

export interface MagmaTagItem {
    value: string;
    label: string;
    removeI18n?: string;
    removable: boolean;
}

@Component({
    selector: 'mg-tag-list',
    templateUrl: './tag-list.component.html',
    styleUrl: './tag-list.component.scss',
    host: {
        role: 'list',
        'aria-label': 'Tag list',
        '[class.readonly]': 'readOnly()',
        '[class.disabled]': 'disabled()',
    },
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MagmaTagList),
            multi: true,
        },
    ],
    imports: [MagmaClickEnterDirective],
})
export class MagmaTagList implements ControlValueAccessor {
    // --- Inputs ---

    /** Data-driven mode: provide tags as a string array */
    readonly tags = input<(string | MagmaTagItem)[]>();

    /** Autocomplete proposals for the inline input */
    readonly proposals = input<string[]>([]);

    /** When true, hides remove buttons and input */
    readonly readOnly = input(false, { transform: booleanAttribute });

    /** When true, the component is disabled (form integration) */
    readonly disabled = input(false, { transform: booleanAttribute });

    /** When true, clicking a tag emits tagClick */
    readonly allowClick = input(false, { transform: booleanAttribute });

    /** When true, impossible to add with input use `add()` method */
    readonly hideInput = input(false, { transform: booleanAttribute });

    /** Placeholder for the inline input */
    readonly placeholder = input('');

    /** Aria-Label text format for removal button*/
    readonly removeAriaLabel = input('Remove: %item');

    /** Aria-Label text format for input to add item*/
    readonly addAriaLabel = input('Add tag');

    // --- Outputs ---

    /** Emitted when the tags list changes (data-driven mode) */
    readonly tagsChange = output<string[]>();

    /** Emitted when a tag is clicked (requires allowClick) */
    readonly tagClick = output<string>();

    // --- Content children (declarative mode) ---

    readonly declaredTags = contentChildren(MagmaTag);

    // --- View children ---

    readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('input');

    // --- Internal state ---

    readonly inputValue = signal<string>('');

    /** Internal model for CVA and data-driven mode */
    readonly internalTags = signal<string[]>([]);

    /** Resolved tag items (merges declarative + data-driven) */
    readonly resolvedTags = computed<MagmaTagItem[]>(() => {
        const declared = this.declaredTags();
        if (declared.length > 0) {
            // Declarative mode: tags come from <mg-tag> children
            return declared.map(tag => ({
                value: tag.value(),
                label: tag.value(), // label from ng-content isn't accessible, use value
                removeI18n: this.removeAriaLabel().replace('%item', tag.value()),
                removable: tag.removable(),
            }));
        }

        // Data-driven or CVA mode
        const dataInput = this.tags();
        const source = dataInput ?? this.internalTags();
        return source.map(value =>
            typeof value === 'string'
                ? {
                      value,
                      label: value,
                      removeI18n: this.removeAriaLabel().replace('%item', value),
                      removable: true,
                  }
                : {
                      value: value.value,
                      label: value.label,
                      removeI18n: value.removeI18n || this.removeAriaLabel().replace('%item', value.label),
                      removable: value.removable,
                  },
        );
    });

    // --- ControlValueAccessor ---

    private onChange: (value: string[]) => void = () => {};
    private onTouched: () => void = () => {};

    writeValue(value: string[] | null): void {
        this.internalTags.set(value ?? []);
    }

    registerOnChange(fn: (value: string[]) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    // --- Actions ---

    add(tag: string | MagmaTagItem): boolean {
        if (this.readOnly() || this.disabled()) {
            return false;
        }

        const value = typeof tag === 'string' ? tag : tag.value;
        const current = this.getCurrentValues().map(v => (typeof v === 'string' ? v : v.value));
        if (!value || current.includes(value)) {
            return false;
        }

        const updated = [...current, value];
        this.emitChange(updated);
        return true;
    }

    remove(tag: string | MagmaTagItem): void {
        if (this.readOnly() || this.disabled()) {
            return;
        }
        const current = this.getCurrentValues();
        const updated = current.filter(v => v !== (typeof tag === 'string' ? tag : tag.value));
        this.emitChange(updated);
    }

    onEnter(): void {
        if (this.readOnly() || this.disabled()) {
            return;
        }
        const inputEl = this.inputRef()?.nativeElement;
        if (!inputEl) {
            return;
        }
        const value = inputEl.value.trim();
        if (!value) {
            return;
        }
        const current = this.getCurrentValues();
        if (current.includes(value)) {
            inputEl.value = '';
            return;
        }

        const updated = [...current, value];
        inputEl.value = '';
        inputEl.focus();
        this.emitChange(updated);
    }

    onTagClick(tag: MagmaTagItem): void {
        if (this.allowClick()) {
            this.tagClick.emit(tag.value);
        }
    }

    onBlur(): void {
        this.onTouched();
    }

    // --- Private ---

    private getCurrentValues(): (string | MagmaTagItem)[] {
        const dataInput = this.tags();
        console.log('valeeee', dataInput, [...this.internalTags()]);
        return dataInput ? [...dataInput] : [...this.internalTags()];
    }

    private emitChange(updated: (string | MagmaTagItem)[]): void {
        // CVA mode
        const updatedList = updated.map<string>(e => (typeof e === 'string' ? e : e.value));
        console.log('updatedList', updatedList, [...this.internalTags()]);
        this.internalTags.set(updatedList);
        this.onChange(updatedList);

        // Data-driven mode
        this.tagsChange.emit(updatedList);
    }
}

const MagmaTagListExports = [MagmaTagList, MagmaTag];

@NgModule({
    imports: [MagmaTagListExports],
    exports: [MagmaTagListExports],
})
export class MagmaTagListModule {}
