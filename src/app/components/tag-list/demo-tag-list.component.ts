import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';
import {
    FormBuilderExtended,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputText,
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
    ],
})
export class DemoTagListComponent {
    readonly fb = inject(FormBuilderExtended);

    // --- Section 1: Data-driven ---

    ctrlFormData: FormGroup<{
        readOnly: FormControl<boolean>;
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

    // --- Section 2: Declarative ---

    ctrlFormDecl: FormGroup<{
        readOnly: FormControl<boolean>;
        hideInput: FormControl<boolean>;
    }>;

    declLastAction = '';

    codeHtmlDeclarative = '';
    codeTsDeclarative = `import { MagmaTagListModule } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    imports: [MagmaTagListModule],
})
export class MyComponent {}`;

    // --- Section 3: Form mode ---

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
            allowClick: { default: false },
            withProposals: { default: true },
            hideInput: { default: false },
        });
        this.ctrlFormDecl = this.fb.groupWithError({
            readOnly: { default: false },
            hideInput: { default: false },
        });

        this.codeGenerationData();
        this.codeGenerationDecl();

        this.ctrlFormData.valueChanges.subscribe(() => this.codeGenerationData());
        this.ctrlFormDecl.valueChanges.subscribe(() => this.codeGenerationDecl());
    }

    // --- Data-driven handlers ---

    onTagsChange(tags: string[]) {
        this.tags = tags;
        this.lastAction = `Updated: [${tags.join(', ')}]`;
    }

    onTagClick(value: string) {
        this.lastClick = value;
    }

    // --- Declarative handlers ---

    onDeclTagsChange(tags: string[]) {
        this.declLastAction = `Tags changed: [${tags.join(', ')}]`;
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
        if (this.ctrlFormData.value.allowClick) {
            attrs['allowClick'] = null;
            attrs['(tagClick)'] = 'onTagClick($event)';
        }

        this.codeHtmlData = new Json2html(json).toString();
    }

    codeGenerationDecl() {
        const json: Json2htmlRef = {
            tag: 'mg-tag-list',
            attrs: {},
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
