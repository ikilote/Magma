import { Component, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Select2Data } from 'ng-select2-component';

import {
    FormBuilderExtended,
    InfoMessageComponent,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputSelect,
    MagmaInputText,
    MagmaInputTextarea,
    MagmaMessageType,
    MagmaMessages,
    MagmaStopPropagationDirective,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'block-test',
    template: `<div>
        {{ text() }}
        <button (click)="action()" stop-propagation stopClick>Close</button>
    </div> `,
    styles: [
        `
            :host {
                display: block;
                padding: 10px;
            }
        `,
    ],
    imports: [MagmaStopPropagationDirective],
})
export class ContextTestComponent {
    context = input<InfoMessageComponent>();
    component = input<DemoInfoMessageComponent>();
    text = input<string>();

    action() {
        this.component()?.testComponent('Test component');
    }
}

@Component({
    selector: 'demo-info-messages',
    templateUrl: './demo-info-messages.component.html',
    styleUrls: ['./demo-info-messages.component.scss'],
    imports: [
        ReactiveFormsModule,
        MagmaInput,
        MagmaInputElement,
        MagmaInputText,
        MagmaInputTextarea,
        MagmaInputSelect,
        MagmaInputCheckbox,
        CodeTabsComponent,
    ],
})
export class DemoInfoMessageComponent {
    readonly fbe = inject(FormBuilderExtended);
    readonly mgMessages = inject(MagmaMessages);

    readonly data: Select2Data = [
        { value: '', label: 'default' },
        { value: MagmaMessageType.info, label: 'info' },
        { value: MagmaMessageType.tip, label: 'tip' },
        { value: MagmaMessageType.error, label: 'error' },
        { value: MagmaMessageType.warn, label: 'warn' },
        { value: MagmaMessageType.success, label: 'success' },
    ];

    readonly formGroup: FormGroup<{
        component: FormControl<boolean>;
        text: FormControl<string>;
        time: FormControl<string>;
        type: FormControl<MagmaMessageType>;
    }>;

    codeTs = '';
    codeTsComponent = '';

    constructor() {
        this.formGroup = this.fbe.groupWithErrorNonNullable({
            component: { default: false },
            text: { default: 'Test' },
            time: { default: '' },
            type: { default: undefined },
        });

        this.formGroup.valueChanges.subscribe(() => {
            this.codeGenerator();
        });

        this.codeGenerator();
    }

    sendMessage() {
        if (this.formGroup.value.component) {
            this.mgMessages.addMessage(
                {
                    component: ContextTestComponent,
                    input: {
                        text: this.formGroup.value.text,
                        component: this,
                    },
                },
                {
                    time: this.formGroup.value.time,
                    type: this.formGroup.value.type,
                },
            );
        } else if (this.formGroup.value.text) {
            this.mgMessages.addMessage(this.formGroup.value.text, {
                time: this.formGroup.value.time,
                type: this.formGroup.value.type,
            });
        }
    }

    codeGenerator() {
        this.codeTs = `import { MagmaMessage } from '@ikilote/magma';

@Component({
     ...
})
export class SendMessageComponent {
  readonly mgMessage = inject(MagmaMessage);

  sendMessage() {
    this.mgMessage.addMessage(${
        this.formGroup.value.component
            ? `{
        component: ContextTestComponent,
        input: {
            text: \`${this.formGroup.value.text?.replaceAll('`', '\\`')}\`,
            component: this,
        },
    }`
            : `\`${this.formGroup.value.text?.replaceAll('`', '\\`')}\``
    }${
        this.formGroup.value.time || this.formGroup.value.type
            ? `, {${
                  this.formGroup.value.time
                      ? `
      time: "${this.formGroup.value.time}",`
                      : ''
              }${
                  this.formGroup.value.type
                      ? `
      type: MagmaMessageType.${this.formGroup.value.type},`
                      : ''
              }
    }`
            : ''
    });
  }
}`;
        this.codeTsComponent = this.formGroup.value.component
            ? `@Component({
    selector: 'block-test',
    template: \`<div>
        {{ text() }}
        <button (click)="action()" stop-propagation stopClick>Close</button>
    </div> \`,
    styles: [
        \`:host { display: block; padding: 10px; }\`,
    ],
    imports: [MagmaStopPropagationDirective],
})
export class ContextTestComponent {
    context = input<InfoMessageComponent>();
    component = input<DemoInfoMessageComponent>();
    text = input<string>();

    action() {
        this.component()?.testComponent('Test component');
    }
}
`
            : '';
    }

    testComponent(data: string) {
        console.log(data);
    }
}
