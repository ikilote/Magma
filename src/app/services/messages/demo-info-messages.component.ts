import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2Js } from '@ikilote/json2html';
import {
    ArrayFilterPipe,
    FormBuilderExtended,
    MagmaInfoMessageComponent,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputSelect,
    MagmaInputText,
    MagmaInputTextarea,
    MagmaMessageType,
    MagmaMessageZoneConfig,
    MagmaMessages,
    MagmaOverlayPosition,
    MagmaStopPropagationDirective,
    MagmaTableModule,
    MagmaTabsModule,
} from '@ikilote/magma';

import { Select2Data } from 'ng-select2-component';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'block-test',
    template: `<div>
        {{ text() }}
        <button (click)="action()" stopPropagation stopClick>Close</button>
    </div> `,
    styles: [
        `
            :host {
                display: block;
                padding: 10px;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaStopPropagationDirective],
})
export class ContextTestComponent {
    context = input<MagmaInfoMessageComponent>();
    component = input<DemoInfoMessageComponent>();
    text = input<string>();

    action() {
        this.component()?.testComponent('Test component');
    }
}

// ── Predefined zones for the demo ─────────────────────────────────────────────

const DEMO_ZONES: { id: string; label: string; config: MagmaMessageZoneConfig }[] = [
    { id: 'bottom-right', label: 'bottom-right', config: { position: { bottom: '10px', right: '10px' } } },
    { id: 'top-right', label: 'top-right', config: { position: { top: '10px', right: '10px' } } },
    { id: 'top-left', label: 'top-left', config: { position: { top: '10px', left: '10px' } } },
    { id: 'bottom-left', label: 'bottom-left', config: { position: { bottom: '10px', left: '10px' } } },
    { id: 'top-center', label: 'top-center', config: { position: { top: '10px', centerHorizontally: '' } } },
    { id: 'top-left-edge', label: 'top-left (edge)', config: { position: { top: '10px', left: '0' } } },
    { id: 'bottom-left-edge', label: 'bottom-left (edge)', config: { position: { bottom: '10px', left: '0' } } },
    { id: 'top-center-edge', label: 'top-center (edge)', config: { position: { top: '0', centerHorizontally: '' } } },
    { id: 'top-right-edge', label: 'top-right (edge)', config: { position: { top: '10px', right: '0' } } },
    {
        id: 'bottom-center-edge',
        label: 'bottom-center (edge)',
        config: { position: { bottom: '0', centerHorizontally: '' } },
    },
];

@Component({
    selector: 'demo-info-messages',
    templateUrl: './demo-info-messages.component.html',
    styleUrl: './demo-info-messages.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ReactiveFormsModule,
        JsonPipe,
        MagmaInput,
        MagmaInputElement,
        MagmaInputText,
        MagmaInputTextarea,
        MagmaInputSelect,
        MagmaInputCheckbox,
        ArrayFilterPipe,
        CodeTabsComponent,
        MagmaTabsModule,
        MagmaTableModule,
    ],
})
export class DemoInfoMessageComponent {
    readonly fbe = inject(FormBuilderExtended);
    readonly mgMessages = inject(MagmaMessages);

    readonly demoZones = DEMO_ZONES;

    /** All zones registered so far (predefined + custom). */
    allZones: { id: string; label: string; config: MagmaMessageZoneConfig }[] = [...DEMO_ZONES];

    readonly typeData: Select2Data = [
        { value: '', label: 'default (info)' },
        { value: MagmaMessageType.info, label: 'info' },
        { value: MagmaMessageType.tip, label: 'tip' },
        { value: MagmaMessageType.error, label: 'error' },
        { value: MagmaMessageType.warn, label: 'warn' },
        { value: MagmaMessageType.success, label: 'success' },
    ];

    zoneData: Select2Data = DEMO_ZONES.map(z => ({ value: z.id, label: z.label }));

    readonly formGroup: FormGroup<{
        component: FormControl<boolean>;
        text: FormControl<string>;
        time: FormControl<string>;
        type: FormControl<MagmaMessageType>;
        zone: FormControl<string>;
    }>;

    /** Form for creating a new custom zone. */
    readonly newZoneForm: FormGroup<{
        id: FormControl<string>;
        top: FormControl<string>;
        bottom: FormControl<string>;
        left: FormControl<string>;
        right: FormControl<string>;
        centerHorizontally: FormControl<boolean>;
        centerVertically: FormControl<boolean>;
    }>;

    newZoneError = '';

    codeTs = '';
    codeTsComponent = '';

    constructor() {
        // Register all demo zones upfront.
        DEMO_ZONES.forEach(z => this.mgMessages.addZone(z.id, z.config));

        this.formGroup = this.fbe.groupWithError({
            component: { default: false },
            text: { default: 'Test' },
            time: { default: '' },
            type: { default: '' as MagmaMessageType },
            zone: { default: 'bottom-right' },
        });

        this.newZoneForm = this.fbe.groupWithError({
            id: { default: '' },
            top: { default: '' },
            bottom: { default: '' },
            left: { default: '' },
            right: { default: '' },
            centerHorizontally: { default: false },
            centerVertically: { default: false },
        });

        this.formGroup.valueChanges.subscribe(() => this.codeGenerator());
        this.codeGenerator();
    }

    filter = (e: string) => !!e;

    sendMessage() {
        const { component, text, time, type, zone } = this.formGroup.value;

        if (component) {
            this.mgMessages.addMessage(
                { component: ContextTestComponent, input: { text, component: this } },
                { time: time || undefined, type: type || undefined, zone: zone || undefined },
            );
        } else if (text) {
            this.mgMessages.addMessage(text, {
                time: time || undefined,
                type: type || undefined,
                zone: zone || undefined,
            });
        }
    }

    addCustomZone() {
        const { id, top, bottom, left, right, centerHorizontally, centerVertically } = this.newZoneForm.value;
        this.newZoneError = '';

        if (!id?.trim()) {
            this.newZoneError = 'Zone id is required.';
            return;
        }

        const position: MagmaOverlayPosition = {};
        if (top) position.top = top;
        if (bottom) position.bottom = bottom;
        if (left) position.left = left;
        if (right) position.right = right;
        if (centerHorizontally) position.centerHorizontally = '';
        if (centerVertically) position.centerVertically = '';

        if (!Object.keys(position).length) {
            this.newZoneError = 'At least one position value is required.';
            return;
        }

        const zoneId = id.trim();
        const config: MagmaMessageZoneConfig = { position };
        this.mgMessages.addZone(zoneId, config);
        const existing = this.allZones.findIndex(z => z.id === zoneId);
        const entry = { id: zoneId, label: zoneId, config };
        if (existing >= 0) {
            this.allZones[existing] = entry;
        } else {
            this.allZones = [...this.allZones, entry];
        }
        this.zoneData = this.allZones.map(z => ({ value: z.id, label: z.label }));

        this.newZoneForm.reset({
            id: '',
            top: '',
            bottom: '',
            left: '',
            right: '',
            centerHorizontally: false,
            centerVertically: false,
        });
    }

    codeGenerator() {
        const { component, text, time, type, zone } = this.formGroup.value;
        const hasOptions = time || type || zone;
        // Build the addZone call for the selected zone.
        const selectedZone = zone ? this.allZones.find(z => z.id === zone) : null;
        const addZoneCode = selectedZone
            ? `\n    this.mgMessages.addZone('${selectedZone.id}', {
      position: ${new Json2Js(selectedZone.config.position, { tabAdded: 2, tabAddedExceptFirst: true }).toString()},
    });`
            : '';

        this.codeTs = `import { MagmaMessages, MagmaMessageType } from '@ikilote/magma';

@Component({ ... })
export class SendMessageComponent {
  readonly mgMessages = inject(MagmaMessages);

  constructor() {${addZoneCode}
  }

  sendMessage() {
    this.mgMessages.addMessage(${
        component
            ? `{
        component: ContextTestComponent,
        input: { text: \`${text?.replaceAll('`', '\\`')}\`, component: this },
    }`
            : `\`${text?.replaceAll('`', '\\`')}\``
    }${
        hasOptions
            ? `, {${time ? `\n      time: "${time}",` : ''}${type ? `\n      type: MagmaMessageType.${type},` : ''}${
                  zone ? `\n      zone: '${zone}',` : ''
              }
    }`
            : ''
    });
  }
}`;

        this.codeTsComponent = component
            ? `@Component({
    selector: 'block-test',
    template: \`<div>
        {{ text() }}
        <button (click)="action()" stopPropagation stopClick>Close</button>
    </div>\`,
    imports: [MagmaStopPropagationDirective],
})
export class ContextTestComponent {
    context = input<InfoMessageComponent>();
    component = input<DemoInfoMessageComponent>();
    text = input<string>();

    action() { this.component()?.testComponent('Test component'); }
}
`
            : '';
    }

    testComponent(data: string) {
        console.log(data);
    }
}
