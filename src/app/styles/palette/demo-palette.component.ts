import { ChangeDetectionStrategy, Component, Renderer2, RendererStyleFlags2, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import {
    FormBuilderExtended,
    MagmaBlock,
    MagmaBlockMessage,
    MagmaInput,
    MagmaInputElement,
    MagmaInputRange,
    MagmaInputSelect,
    MagmaInputText,
    MagmaInputTextarea,
    MagmaMessage,
    MagmaTabsModule,
} from '@ikilote/magma';

import { Select2Data } from 'ng-select2-component';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

/** Values shipped by the library, and the reset target. */
const DEFAULTS = {
    primaryH: 210,
    primaryS: 15,
    primarySsoft: 5,
    neutralH: 0,
    neutralS: 0,
    alertH: 0,
    warnH: 15,
    successH: 120,
};

type KnobName = keyof typeof DEFAULTS;

/** A palette variable exposed as a slider. */
interface PaletteKnob {
    name: KnobName;
    /** CSS custom property it drives. */
    variable: string;
    label: string;
    min: number;
    max: number;
    /** Unit appended to the value, e.g. '%' for saturations. */
    unit: '' | '%';
}

@Component({
    selector: 'demo-palette',
    templateUrl: './demo-palette.component.html',
    styleUrl: './demo-palette.component.scss',
    imports: [
        ReactiveFormsModule,
        MagmaTabsModule,
        MagmaMessage,
        MagmaBlock,
        MagmaInput,
        MagmaInputElement,
        MagmaInputRange,
        MagmaInputSelect,
        MagmaInputText,
        MagmaInputTextarea,
        MagmaBlockMessage,
        CodeTabsComponent,
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class DemoPaletteComponent {
    private readonly fbe = inject(FormBuilderExtended);
    private readonly renderer = inject(Renderer2);

    css = '';

    /**
     * Every hue and saturation the library exposes. Each family is driven by a
     * hue; primary and neutral also expose their saturation. The saturation
     * curve of alert / warn / success stays in the library, so only their hue
     * is tweakable here.
     */
    readonly knobs: PaletteKnob[] = [
        { name: 'primaryH', variable: '--primaryH', label: 'Primary hue', min: 0, max: 360, unit: '' },
        { name: 'primaryS', variable: '--primaryS', label: 'Primary saturation', min: 0, max: 100, unit: '%' },
        {
            name: 'primarySsoft',
            variable: '--primarySsoft',
            label: 'Primary soft saturation (050 and 950 steps)',
            min: 0,
            max: 100,
            unit: '%',
        },
        { name: 'neutralH', variable: '--neutralH', label: 'Neutral hue', min: 0, max: 360, unit: '' },
        {
            name: 'neutralS',
            variable: '--neutralS',
            label: 'Neutral saturation (0% is a pure grey)',
            min: 0,
            max: 100,
            unit: '%',
        },
        { name: 'alertH', variable: '--alertH', label: 'Alert hue', min: 0, max: 360, unit: '' },
        { name: 'warnH', variable: '--warnH', label: 'Warn hue', min: 0, max: 360, unit: '' },
        { name: 'successH', variable: '--successH', label: 'Success hue', min: 0, max: 360, unit: '' },
    ];

    /** Sample options for the select in the Components tab. */
    readonly selectOptions: Select2Data = [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
    ];

    readonly palette = [
        {
            group: 'primary',
            list: ['050', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'],
        },
        {
            group: 'neutral',
            list: [
                '000',
                '010',
                '025',
                '050',
                '100',
                '200',
                '300',
                '400',
                '500',
                '600',
                '700',
                '800',
                '900',
                '950',
                '990',
            ],
        },
        {
            group: 'alert',
            list: ['050', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'],
        },
        {
            group: 'warn',
            list: ['050', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'],
        },
        {
            group: 'success',
            list: ['050', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'],
        },
    ];

    readonly form = this.fbe.groupWithError({
        primaryH: { default: DEFAULTS.primaryH },
        primaryS: { default: DEFAULTS.primaryS },
        primarySsoft: { default: DEFAULTS.primarySsoft },
        neutralH: { default: DEFAULTS.neutralH },
        neutralS: { default: DEFAULTS.neutralS },
        alertH: { default: DEFAULTS.alertH },
        warnH: { default: DEFAULTS.warnH },
        successH: { default: DEFAULTS.successH },
    });

    constructor() {
        this.form.valueChanges.subscribe(() => {
            this.apply();
            this.cssUpdate();
        });
        this.cssUpdate();
    }

    /** Restores the values shipped by the library. */
    reset() {
        this.form.setValue({ ...DEFAULTS });
    }

    /** Formats a knob value for display, unit included. */
    display(knob: PaletteKnob): string {
        return `${this.form.value[knob.name] ?? DEFAULTS[knob.name]}${knob.unit}`;
    }

    private apply() {
        for (const knob of this.knobs) {
            const value = this.form.value[knob.name];
            if (value === null || value === undefined) continue;
            this.renderer.setStyle(document.body, knob.variable, `${value}${knob.unit}`, RendererStyleFlags2.DashCase);
        }
    }
    private cssUpdate() {
        this.css = `body {
  ${this.knobs.map(v => `${v.variable}: ${this.form.value[v.name]}${v.unit};`).join('\n  ')}
}`;
    }
}
