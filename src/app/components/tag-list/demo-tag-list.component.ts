import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';
import {
    FormBuilderExtended,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputText,
    MagmaTableModule,
    MagmaTabsModule,
    MagmaTagItem,
    MagmaTagListModule,
} from '@ikilote/magma';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-tag-list',
    templateUrl: './demo-tag-list.component.html',
    styleUrl: './demo-tag-list.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ReactiveFormsModule,
        CodeTabsComponent,
        MagmaTagListModule,
        MagmaInput,
        MagmaInputElement,
        MagmaInputCheckbox,
        MagmaInputText,
        MagmaTabsModule,
        MagmaTableModule,
    ],
})
export class DemoTagListComponent {
    readonly fb = inject(FormBuilderExtended);

    // --- API Reference ---

    codeInterface = `interface MagmaTagItem {
    value: string;
    label: string;
    removeI18n?: string;
    removable: boolean;
}`;

    // --- Section 1: Data-driven (string[]) ---

    ctrlFormData: FormGroup<{
        readOnly: FormControl<boolean>;
        disabled: FormControl<boolean>;
        allowClick: FormControl<boolean>;
        withProposals: FormControl<boolean>;
        hideInput: FormControl<boolean>;
    }>;

    tags: string[] = ['Angular', 'TypeScript', 'RxJS', 'Signals'];
    proposals = ['Angular', 'TypeScript', 'RxJS', 'Signals', 'Node.js', 'Deno', 'Bun'];
    lastAction = '';
    lastClick = '';

    codeHtmlData = '';
    codeTsData = `import { MagmaTagListModule } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    imports: [MagmaTagListModule],
})
export class MyComponent {
    tags = ['Angular', 'TypeScript', 'RxJS'];
    proposals = ['Angular', 'TypeScript', 'RxJS', 'Node.js', 'Deno'];

    onTagsChange(tags: string[]) {
        this.tags = tags;
    }

    onTagClick(value: string) {
        console.log('Clicked:', value);
    }
}`;

    // --- Section 2: Data-driven (MagmaTagItem[]) ---

    tagItems: MagmaTagItem[] = [
        { value: 'fr', label: '🇫🇷 France', removable: true },
        { value: 'de', label: '🇩🇪 Germany', removable: true },
        { value: 'us', label: '🇺🇸 USA', removable: false },
    ];
    tagItemLastAction = '';
    tagItemLastClick = '';

    get tagItemsDisplay(): string {
        return this.tagItems.map(t => `${t.label} (${t.value})`).join(', ');
    }

    codeHtmlTagItem = `<mg-tag-list
  [tags]="tagItems"
  [allowClick]="true"
  (tagsChange)="onTagItemsChange($event)"
  (tagClick)="onTagItemClick($event)"
  placeholder="Add..."
/>`;

    codeTsTagItem = `import { MagmaTagItem, MagmaTagListModule } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    imports: [MagmaTagListModule],
})
export class MyComponent {
    tagItems: MagmaTagItem[] = [
        { value: 'fr', label: '🇫🇷 France', removable: true },
        { value: 'de', label: '🇩🇪 Germany', removable: true },
        { value: 'us', label: '🇺🇸 USA', removable: false },
    ];

    onTagItemsChange(tags: string[]) {
        console.log('Values:', tags);
    }

    onTagItemClick(value: string) {
        console.log('Clicked:', value);
    }
}`;

    // --- Section 3: Declarative ---

    ctrlFormDecl: FormGroup<{
        readOnly: FormControl<boolean>;
    }>;

    declLastAction = '';

    codeHtmlDeclarative = '';
    codeTsDeclarative = `import { MagmaTagListModule } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    imports: [MagmaTagListModule],
})
export class MyComponent {
    onTagsChange(tags: string[]) {
        // Includes declared tags + dynamically added tags
        console.log('All tags:', tags);
    }
}`;

    // --- Section 4: Form mode ---

    formTags = new FormControl<string[]>(['Vue', 'React', 'Svelte']);
    formSetValue = new FormControl('');

    codeHtmlForm = `<mg-tag-list [formControl]="formTags" placeholder="Add framework..." />`;
    codeTsForm = `import { MagmaTagListModule } from '@ikilote/magma';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    imports: [MagmaTagListModule, ReactiveFormsModule],
})
export class MyComponent {
    formTags = new FormControl<string[]>(['Vue', 'React', 'Svelte']);
}`;

    constructor() {
        this.ctrlFormData = this.fb.groupWithError({
            readOnly: { default: false },
            disabled: { default: false },
            allowClick: { default: false },
            withProposals: { default: true },
            hideInput: { default: false },
        });
        this.ctrlFormDecl = this.fb.groupWithError({
            readOnly: { default: false },
        });

        this.codeGenerationData();
        this.codeGenerationDecl();

        this.ctrlFormData.valueChanges.subscribe(() => this.codeGenerationData());
        this.ctrlFormDecl.valueChanges.subscribe(() => this.codeGenerationDecl());
    }

    // --- Data-driven (string[]) handlers ---

    onTagsChange(tags: string[]) {
        this.tags = tags;
        this.lastAction = `[${tags.join(', ')}]`;
    }

    onTagClick(value: string) {
        this.lastClick = value;
    }

    // --- Data-driven (MagmaTagItem[]) handlers ---

    onTagItemsChange(tags: string[]) {
        // Rebuild tagItems: keep existing MagmaTagItem objects, add new ones as simple items
        this.tagItems = tags.map(value => {
            const existing = this.tagItems.find(t => t.value === value);
            return existing ?? { value, label: value, removable: true };
        });
        this.tagItemLastAction = `[${tags.join(', ')}]`;
    }

    onTagItemClick(value: string) {
        this.tagItemLastClick = value;
    }

    // --- Declarative handlers ---

    onDeclTagsChange(tags: string[]) {
        this.declLastAction = `[${tags.join(', ')}]`;
    }

    // --- Form handlers ---

    addToForm() {
        const value = this.formSetValue.value?.trim();
        if (value && !this.formTags.value?.includes(value)) {
            this.formTags.setValue([...(this.formTags.value ?? []), value]);
            this.formSetValue.reset();
        }
    }

    resetForm() {
        this.formTags.setValue(['Vue', 'React', 'Svelte']);
    }

    // --- Code generation ---

    codeGenerationData() {
        const json: Json2htmlRef = { tag: 'mg-tag-list', attrs: {} };
        const attrs: Json2htmlAttr = json.attrs!;

        attrs['[tags]'] = 'tags';
        attrs['(tagsChange)'] = 'onTagsChange($event)';
        attrs['placeholder'] = 'Add tag...';

        if (this.ctrlFormData.value.withProposals) {
            attrs['[proposals]'] = 'proposals';
        }
        if (this.ctrlFormData.value.hideInput) {
            attrs['hideInput'] = null;
        }
        if (this.ctrlFormData.value.readOnly) {
            attrs['readOnly'] = null;
        }
        if (this.ctrlFormData.value.disabled) {
            attrs['disabled'] = null;
        }
        if (this.ctrlFormData.value.allowClick) {
            attrs['allowClick'] = null;
            attrs['(tagClick)'] = 'onTagClick($event)';
        }

        this.codeHtmlData = new Json2html(json).toString();
    }

    codeGenerationDecl() {
        const json: Json2htmlRef = {
            tag: 'mg-tag-list',
            attrs: { '(tagsChange)': 'onTagsChange($event)' },
            body: [
                { tag: 'mg-tag', attrs: { value: 'angular' }, body: 'Angular' },
                { tag: 'mg-tag', attrs: { value: 'typescript' }, body: 'TypeScript' },
                { tag: 'mg-tag', attrs: { value: 'rxjs', removable: 'false' }, body: 'RxJS' },
            ],
        };
        if (this.ctrlFormDecl.value.readOnly) {
            json.attrs!['readOnly'] = null;
        }
        this.codeHtmlDeclarative = new Json2html(json).toString();
    }
}
