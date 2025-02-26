import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Select2Data } from 'ng-select2-component';

import {
    FormBuilderExtended,
    MagmaInput,
    MagmaInputElement,
    MagmaInputSelect,
    MagmaInputText,
    MagmaInputTextarea,
    MagmaMessage,
    MagmaMessageType,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

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
        CodeTabsComponent,
    ],
})
export class DemoInfoMessageComponent {
    readonly fbe = inject(FormBuilderExtended);
    readonly mgMessage = inject(MagmaMessage);

    readonly data: Select2Data = [
        { value: MagmaMessageType.info, label: 'info' },
        { value: MagmaMessageType.error, label: 'error' },
    ];

    readonly formGroup: FormGroup<{
        text: FormControl<string>;
        time: FormControl<string>;
        type: FormControl<MagmaMessageType>;
    }>;

    codeTs = '';

    constructor() {
        this.formGroup = this.fbe.groupWithErrorNonNullable({
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
        if (this.formGroup.value.text) {
            this.mgMessage.addMessage(this.formGroup.value.text, {
                time: this.formGroup.value.time,
                type: this.formGroup.value.type,
            });
        }
    }

    codeGenerator() {
        this.codeTs = `@Component({
     ...
})
export class SendMessageComponent {
  readonly mgMessage = inject(MagmaMessage);

  sendMessage() {
    this.mgMessage.addMessage(\`${this.formGroup.value.text?.replaceAll('`', '\\`')}\`${
        this.formGroup.value.time || this.formGroup.value.type
            ? `{${
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
    }
}
