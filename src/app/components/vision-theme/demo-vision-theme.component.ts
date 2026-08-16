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
    MagmaVisionTheme,
    VisionTheme,
    VisionThemeInfo,
    VisionThemeType,
} from '@ikilote/magma';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-vision-theme',
    templateUrl: './demo-vision-theme.component.html',
    styleUrl: './demo-vision-theme.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ReactiveFormsModule,
        MagmaVisionTheme,
        MagmaInput,
        MagmaInputElement,
        MagmaInputText,
        MagmaInputCheckbox,
        CodeTabsComponent,
        MagmaTabsModule,
        MagmaTableModule,
    ],
})
export class DemoVisionThemeComponent {
    readonly visionThemeService = inject(VisionTheme);
    readonly fb = inject(FormBuilderExtended);

    lastEmitted: VisionThemeType | VisionThemeType[] | null = null;

    ctrlForm: FormGroup<{
        compact: FormControl<boolean>;
        multiple: FormControl<boolean>;
        ariaLabel: FormControl<string>;
        listAriaLabel: FormControl<string>;
        clearAllLabel: FormControl<string>;
    }>;

    codeHtml = '';
    codeTs = `import { MagmaVisionTheme } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    imports: [MagmaVisionTheme],
})
export class MyComponent {}`;

    constructor() {
        this.ctrlForm = this.fb.groupWithError({
            compact: { default: false },
            multiple: { default: false },
            ariaLabel: { default: '' },
            listAriaLabel: { default: '' },
            clearAllLabel: { default: '' },
        });
        this.codeGeneration();
        this.ctrlForm.valueChanges.subscribe(() => {
            this.codeGeneration();
        });
    }

    codeGeneration() {
        const value = this.ctrlForm.value;

        const attrs: Json2htmlAttr = {};

        if (value.compact) {
            attrs['compact'] = null;
        }
        if (value.multiple) {
            attrs['multiple'] = null;
        }
        if (value.ariaLabel) {
            attrs['ariaLabel'] = value.ariaLabel;
        }
        if (value.listAriaLabel) {
            attrs['listAriaLabel'] = value.listAriaLabel;
        }
        if (value.clearAllLabel) {
            attrs['clearAllLabel'] = value.clearAllLabel;
        }

        const json: Json2htmlRef = {
            tag: 'mg-vision-theme',
            attrs,
        };

        this.codeHtml = new Json2html(json).toString();
    }

    onThemeChange(theme: VisionThemeType) {
        this.lastEmitted = theme;
    }

    onThemesChange(theme: VisionThemeType[]) {
        this.lastEmitted = theme;
    }

    /** Custom translated themes for i18n demo. */
    readonly frenchThemes: VisionThemeInfo[] = [
        { key: 'none', label: 'Par défaut', description: 'Palette de couleurs standard.' },
        {
            key: 'protanopia',
            label: 'Protanopie',
            description: 'Daltonisme rouge-vert — remplace rouge/vert par bleu/orange.',
        },
        {
            key: 'deuteranopia',
            label: 'Deutéranopie',
            description: 'Daltonisme rouge-vert (vert faible) — remplace rouge/vert par bleu/orange.',
        },
        {
            key: 'tritanopia',
            label: 'Tritanopie',
            description: 'Daltonisme bleu-jaune — remplace bleu/jaune par rouge/cyan.',
        },
        {
            key: 'achromatopsia',
            label: 'Achromatopsie',
            description: 'Daltonisme total — toutes les teintes désaturées, contraste par luminosité uniquement.',
        },
        { key: 'high-contrast', label: 'Contraste élevé', description: 'Contraste maximum pour la basse vision.' },
    ];

    /** Custom themes with additional options. */
    readonly extendedThemes: VisionThemeInfo[] = [
        { key: 'none', label: 'Default', description: 'No adjustments.' },
        { key: 'protanopia', label: 'Protanopia', description: 'Red-green.' },
        { key: 'high-contrast', label: 'High Contrast', description: 'Maximum contrast.' },
        { key: 'dyslexia', label: 'Dyslexia-friendly', description: 'Custom theme with OpenDyslexic font.' },
    ];

    readonly codeHtmlI18n = `<!-- French labels -->
<mg-vision-theme
  [themes]="frenchThemes"
  ariaLabel="Thème d'accessibilité visuelle"
  listAriaLabel="Thèmes visuels"
/>`;

    readonly codeHtmlCustom = `<!-- Custom theme list (add your own) -->
<mg-vision-theme
  [themes]="extendedThemes"
/>`;

    readonly codeTsI18n = `import { VisionThemeInfo } from '@ikilote/magma';

readonly frenchThemes: VisionThemeInfo[] = [
    { key: 'none', label: 'Par défaut', description: 'Palette standard.' },
    { key: 'protanopia', label: 'Protanopie', description: 'Daltonisme rouge-vert.' },
    { key: 'deuteranopia', label: 'Deutéranopie', description: 'Daltonisme rouge-vert (vert faible).' },
    { key: 'tritanopia', label: 'Tritanopie', description: 'Daltonisme bleu-jaune.' },
    { key: 'achromatopsia', label: 'Achromatopsie', description: 'Daltonisme total.' },
    { key: 'high-contrast', label: 'Contraste élevé', description: 'Contraste maximum.' },
];`;

    readonly codeTsCustom = `import { VisionThemeInfo } from '@ikilote/magma';

readonly extendedThemes: VisionThemeInfo[] = [
    { key: 'none', label: 'Default', description: 'No adjustments.' },
    { key: 'protanopia', label: 'Protanopia', description: 'Red-green.' },
    { key: 'high-contrast', label: 'High Contrast', description: 'Maximum contrast.' },
    { key: 'dyslexia', label: 'Dyslexia-friendly', description: 'OpenDyslexic font.' },
];

// Create a matching CSS file: theme-dyslexia.css
body.theme-dyslexia { --font-family: 'OpenDyslexic', sans-serif; }`;

    readonly codeTsService = `import { VisionTheme } from '@ikilote/magma';

@Component({ ... })
export class MyComponent {
    private readonly visionTheme = inject(VisionTheme);

    switchTheme() {
        this.visionTheme.set('protanopia');
        this.visionTheme.next();     // cycle forward
        this.visionTheme.set('none'); // reset
    }
}`;

    readonly codeCssImport = `/* styles.css */
@import '@ikilote/magma/assets/styles/css-var.css';
@import '@ikilote/magma/assets/styles/theme-protanopia.css';
@import '@ikilote/magma/assets/styles/theme-deuteranopia.css';
@import '@ikilote/magma/assets/styles/theme-tritanopia.css';
@import '@ikilote/magma/assets/styles/theme-achromatopsia.css';
@import '@ikilote/magma/assets/styles/theme-high-contrast.css';`;
}
