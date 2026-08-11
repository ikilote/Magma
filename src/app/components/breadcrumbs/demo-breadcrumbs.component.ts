import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';
import {
    FormBuilderExtended,
    MagmaBreadcrumbsModule,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputText,
} from '@ikilote/magma';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

interface BreadcrumbStep {
    label: string;
    link: string;
}

@Component({
    selector: 'demo-breadcrumbs',
    templateUrl: './demo-breadcrumbs.component.html',
    styleUrl: './demo-breadcrumbs.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ReactiveFormsModule,
        CodeTabsComponent,
        MagmaBreadcrumbsModule,
        MagmaInput,
        MagmaInputElement,
        MagmaInputCheckbox,
        MagmaInputText,
    ],
})
export class DemoBreadcrumbsComponent {
    readonly fb = inject(FormBuilderExtended);

    ctrlForm: FormGroup<{
        separator: FormControl<string>;
        useRouterLink: FormControl<boolean>;
    }>;

    addForm: FormGroup<{
        label: FormControl<string>;
        link: FormControl<string>;
    }>;

    steps: BreadcrumbStep[] = [
        { label: 'Home', link: '/' },
        { label: 'Components', link: '/component' },
        { label: 'Breadcrumbs', link: '/component/breadcrumbs' },
    ];

    codeHtml = '';
    codeTs = `import { MagmaBreadcrumbsModule } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    imports: [MagmaBreadcrumbsModule],
})
export class MyComponent {}`;

    codeCss = [
        { name: '--breadcrumbs-gap', value: '8px' },
        { name: '--breadcrumbs-font-size', value: '0.9em' },
        { name: '--breadcrumbs-separator', value: "'/'" },
        { name: '--breadcrumbs-separator-color', value: 'var(--neutral600)' },
        { name: '--breadcrumbs-link-color', value: 'var(--link-color)' },
        { name: '--breadcrumbs-link-hover-color', value: 'var(--link-hover-color)' },
        { name: '--breadcrumbs-active-color', value: 'var(--neutral950)' },
        { name: '--breadcrumbs-active-font-weight', value: '600' },
    ];

    constructor() {
        this.ctrlForm = this.fb.groupWithError({
            separator: { default: '' },
            useRouterLink: { default: true },
        });
        this.addForm = this.fb.groupWithError({
            label: { default: '' },
            link: { default: '' },
        });
        this.codeGeneration();
        this.ctrlForm.valueChanges.subscribe(() => this.codeGeneration());
    }

    addStep() {
        const label = this.addForm.value.label?.trim();
        const link = this.addForm.value.link?.trim();
        if (label) {
            this.steps = [...this.steps, { label, link: link || '' }];
            this.addForm.reset();
            this.codeGeneration();
        }
    }

    removeStep(index: number) {
        this.steps = this.steps.filter((_, i) => i !== index);
        this.codeGeneration();
    }

    resetSteps() {
        this.steps = [
            { label: 'Home', link: '/' },
            { label: 'Components', link: '/component' },
            { label: 'Breadcrumbs', link: '/component/breadcrumbs' },
        ];
        this.codeGeneration();
    }

    codeGeneration() {
        const useRouter = this.ctrlForm.value.useRouterLink;
        const linkAttr = useRouter ? 'link' : 'href';

        const bodyAttrs: Json2htmlAttr = {};
        if (this.ctrlForm.value.separator) {
            bodyAttrs['separator'] = this.ctrlForm.value.separator;
        }

        const body: Json2htmlRef[] = this.steps.map((step, i) => {
            const isLast = i === this.steps.length - 1;
            return {
                tag: 'mg-breadcrumb',
                attrs: {
                    [linkAttr]: !isLast ? (step.link ?? undefined) : undefined,
                    active: isLast ? null : undefined,
                },
                body: [step.label],
            };
        });

        const json: Json2htmlRef = {
            tag: 'mg-breadcrumbs',
            attrs: bodyAttrs,
            body,
        };

        this.codeHtml = new Json2html(json).toString();
    }
}
