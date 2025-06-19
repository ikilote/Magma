import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlObject } from '@ikilote/json2html';

import { MagmaBlock } from '../../../../projects/ikilote/magma/src/lib/components/block/block.component';
import { MagmaInputCheckbox } from '../../../../projects/ikilote/magma/src/lib/components/input/input-checkbox.component';
import { MagmaInput } from '../../../../projects/ikilote/magma/src/lib/components/input/input.component';
import { FormBuilderExtended, MagmaClickEnterDirective } from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-click-enter',
    templateUrl: './demo-click-enter.component.html',
    styleUrls: ['./demo-click-enter.component.scss'],
    imports: [
        ReactiveFormsModule,
        MagmaClickEnterDirective,
        CodeTabsComponent,
        MagmaBlock,
        MagmaInput,
        MagmaInputCheckbox,
    ],
})
export class DemoClickEnterComponent {
    readonly fb = inject(FormBuilderExtended);

    codeTs = `@Component({
    selector: 'demo-test',
    templateUrl: './demo-test.component.html',
    styleUrls: ['./demo-test.component.scss'],
    imports: [MagmaClickEnterDirective],
})
export class TestComponent {
    events = '';

    click() {
        this.events += 'click-enter\n';
    }

}`;
    codeTsBlock = `@Component({
  selector: 'demo-test',
  templateUrl: './demo-test.component.html',
  styleUrls: ['./demo-test.component.scss'],
  imports: [MagmaClickEnterDirective, MagmaBlock],
})
export class TestComponent {
  events = '';

  click() {
      this.events += 'click-enter\n';
  }

}`;

    codeHtml = `<span (clickEnter)="click()">Click</span>`;

    codeBlockHtml = `<mg-block (clickEnter)="click()">Click</mg-block>`;

    events1 = '';
    events2 = '';

    click1() {
        this.events1 += 'click-enter\n';
    }

    click2() {
        this.events2 += 'click-enter\n';
    }

    ctrlForm1: FormGroup<{
        disabled: FormControl<boolean>;
    }>;
    ctrlForm2: FormGroup<{
        disabled: FormControl<boolean>;
    }>;

    constructor() {
        this.ctrlForm1 = this.fb.groupWithErrorNonNullable({
            disabled: { default: false },
        });
        this.ctrlForm2 = this.fb.groupWithErrorNonNullable({
            disabled: { default: false },
        });
        this.codeGeneration1();
        this.codeGeneration2();
        this.ctrlForm1.valueChanges.subscribe(() => {
            this.codeGeneration1();
        });
        this.ctrlForm2.valueChanges.subscribe(() => {
            this.codeGeneration2();
        });
    }

    codeGeneration1() {
        // tag root
        const json: Json2htmlObject = [
            {
                tag: 'span',
                attrs: {
                    '(clickEnter)': `click($event)`,
                    disable: this.ctrlForm1.value.disabled ? null : undefined,
                },
                body: 'Click zone',
            },
        ];
        this.codeHtml = new Json2html(json).toString();
    }

    codeGeneration2() {
        const jsonBlock: Json2htmlObject = [
            {
                tag: 'mg-block',
                attrs: {
                    '(clickEnter)': `click($event)`,
                    disable: this.ctrlForm2.value.disabled ? null : undefined,
                },
                body: 'Click',
            },
        ];

        this.codeBlockHtml = new Json2html(jsonBlock).toString();
    }
}
