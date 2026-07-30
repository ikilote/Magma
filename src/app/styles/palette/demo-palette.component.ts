import { DecimalPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Renderer2,
    RendererStyleFlags2,
    inject,
    signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import {
    FormBuilderExtended,
    LightDark,
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
        DecimalPipe,
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
    private readonly lightDark = inject(LightDark);
    private readonly cd = inject(ChangeDetectorRef);

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

        // Recalculate contrast when the theme changes (light ↔ dark).
        this.lightDark.themeChange$.subscribe(() => {
            setTimeout(() => {
                this.apply();
                this.cssUpdate();
            }, 50);
        });
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
            if (value !== null && value !== undefined) {
                this.renderer.setStyle(
                    document.body,
                    knob.variable,
                    `${value}${knob.unit}`,
                    RendererStyleFlags2.DashCase,
                );
            }
        }
    }

    // ── CSS variable list ────────────────────────────────────────────────────

    private cssUpdate() {
        this.css = `body {
  ${this.knobs.map(v => `${v.variable}: ${this.form.value[v.name]}${v.unit};`).join('\n  ')}
}`;
        this.updateContrastPairs();
    }

    // ── Contrast checker ────────────────────────────────────────────────────

    /** Pairs of semantic tokens whose contrast matters for accessibility. */
    readonly contrastPairs: { label: string; fgVar: string; bgVar: string; ratio: () => number }[] = [];

    private readonly pairDefs: { fgVar: string; bgVar: string }[] = [
        { fgVar: '--color-on-surface', bgVar: '--color-surface' },
        { fgVar: '--color-on-surface', bgVar: '--color-surface-raised' },
        { fgVar: '--color-on-surface', bgVar: '--color-surface-sunken' },
        { fgVar: '--color-on-surface-muted', bgVar: '--color-surface' },
        { fgVar: '--color-on-surface-muted', bgVar: '--color-surface-raised' },
        { fgVar: '--color-border', bgVar: '--color-surface' },
        { fgVar: '--color-border', bgVar: '--color-surface-raised' },
        { fgVar: '--color-border-strong', bgVar: '--color-surface' },
        { fgVar: '--color-on-primary', bgVar: '--color-primary' },
        { fgVar: '--color-on-primary', bgVar: '--color-primary-hover' },
    ];

    private updateContrastPairs() {
        const style = getComputedStyle(document.body);
        // Clear and rebuild so the template picks up new signal values.
        this.contrastPairs.length = 0;
        for (const def of this.pairDefs) {
            const fgColor = style.getPropertyValue(def.fgVar).trim();
            const bgColor = style.getPropertyValue(def.bgVar).trim();
            const r = this.computeContrast(fgColor, bgColor);
            const ratio = signal(r);
            this.contrastPairs.push({
                label: `${def.fgVar} on ${def.bgVar}`,
                fgVar: def.fgVar,
                bgVar: def.bgVar,
                ratio,
            });
        }
        this.cd.markForCheck();
    }

    /** WCAG 2.1 contrast ratio from two resolved CSS color strings. */
    private computeContrast(fg: string, bg: string): number {
        const l1 = this.relativeLuminance(fg);
        const l2 = this.relativeLuminance(bg);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
    }

    /** Parses a resolved CSS color (rgb or hsl) and returns WCAG relative luminance. */
    private relativeLuminance(color: string): number {
        // Use a temporary element to let the browser resolve any format to rgb.
        const el = document.createElement('div');
        el.style.color = color;
        document.body.appendChild(el);
        const resolved = getComputedStyle(el).color;
        document.body.removeChild(el);
        const m = resolved.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!m) {
            return 0;
        }
        const [r, g, b] = [+m[1] / 255, +m[2] / 255, +m[3] / 255].map(c =>
            c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
        );
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
}
