import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';
import {
    FormBuilderExtended,
    MagmaBlock,
    MagmaInput,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputText,
    MagmaScrollableModule,
} from '@ikilote/magma';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-scrollable',
    templateUrl: './demo-scrollable.component.html',
    styleUrl: './demo-scrollable.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ReactiveFormsModule,
        CodeTabsComponent,
        MagmaScrollableModule,
        MagmaInput,
        MagmaInputElement,
        MagmaInputText,
        MagmaBlock,
        MagmaInputNumber,
    ],
})
export class DemoScrollableComponent {
    readonly fb = inject(FormBuilderExtended);

    ctrlForm: FormGroup<{
        stickySelector: FormControl<string>;
        speedMax: FormControl<string>;
        reducer: FormControl<string>;
    }>;

    scrollPosition = 0;
    currentSection = '';

    codeHtml = '';
    codeTs = `import { MagmaScrollableModule } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    imports: [MagmaScrollableModule],
})
export class MyComponent {
    scrollPosition = 0;
    currentSection = '';

    onScrolled(pos: number) {
        this.scrollPosition = Math.round(pos);
    }

    onChangedTo(id: string) {
        this.currentSection = id;
    }
}`;

    codeCss = `.scroll-container {
    height: 350px;
    overflow: auto;
    position: relative;
}

.scroll-nav {
    position: sticky;
    top: 0;
    z-index: 1;
}`;

    constructor() {
        this.ctrlForm = this.fb.groupWithError({
            stickySelector: { default: '.scroll-nav' },
            speedMax: { default: '50' },
            reducer: { default: '2' },
        });
        this.codeGeneration();
        this.ctrlForm.valueChanges.subscribe(() => {
            this.codeGeneration();
        });
    }

    onScrolled(pos: number) {
        this.scrollPosition = Math.round(pos);
    }

    onChangedTo(id: string) {
        this.currentSection = id;
    }

    codeGeneration() {
        const containerJson: Json2htmlRef = {
            tag: 'div',
            attrs: {},
            body: [],
        };
        const containerAttrs: Json2htmlAttr = containerJson.attrs!;
        const body: Json2htmlRef[] = containerJson.body as Json2htmlRef[];

        containerAttrs['mgScrollable'] = null;
        if (this.ctrlForm.value.stickySelector) {
            containerAttrs['mgScrollableSticky'] = this.ctrlForm.value.stickySelector;
        }
        if (this.ctrlForm.value.speedMax && this.ctrlForm.value.speedMax !== '50') {
            containerAttrs['mgScrollableSpeedMax'] = this.ctrlForm.value.speedMax;
        }
        if (this.ctrlForm.value.reducer && this.ctrlForm.value.reducer !== '2') {
            containerAttrs['mgScrollableReducer'] = this.ctrlForm.value.reducer;
        }
        containerAttrs['(scrolled)'] = 'onScrolled($event)';
        containerAttrs['(changedTo)'] = 'onChangedTo($event)';

        // nav
        body.push({
            tag: 'nav',
            attrs: { class: 'scroll-nav' },
            body: [
                { tag: 'button', attrs: { mgScrollGoto: 'intro' }, body: 'Intro' },
                { tag: 'button', attrs: { mgScrollGoto: 'features', mgScrollJump: null }, body: 'Features' },
                { tag: 'button', attrs: { mgScrollGoto: 'usage' }, body: 'Usage' },
            ],
        });

        // sections
        body.push({
            tag: 'section',
            attrs: { mgScrollTarget: 'intro' },
            body: [
                { tag: 'h2', body: 'Introduction' },
                { tag: 'p', body: 'Content...' },
            ],
        });
        body.push({
            tag: 'section',
            attrs: { mgScrollTarget: 'features' },
            body: [
                { tag: 'h2', body: 'Features' },
                { tag: 'p', body: 'Content...' },
            ],
        });
        body.push({
            tag: 'section',
            attrs: { mgScrollTarget: 'usage' },
            body: [
                { tag: 'h2', body: 'Usage' },
                { tag: 'p', body: 'Content...' },
            ],
        });

        this.codeHtml = new Json2html(containerJson).toString();
    }
}
