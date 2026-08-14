import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import {
    MagmaBlock,
    MagmaBlockMessage,
    MagmaInput,
    MagmaInputElement,
    MagmaInputSelect,
    MagmaMessage,
    MagmaTabsModule,
    MagmaVisionTheme,
    VISION_THEMES,
    VisionTheme,
    VisionThemeType,
} from '@ikilote/magma';

import { Select2Data } from 'ng-select2-component';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-accessibility',
    templateUrl: './demo-accessibility.component.html',
    styleUrl: './demo-accessibility.component.scss',
    imports: [
        MagmaTabsModule,
        MagmaMessage,
        MagmaBlock,
        MagmaBlockMessage,
        MagmaInput,
        MagmaInputElement,
        MagmaInputSelect,
        MagmaVisionTheme,
        CodeTabsComponent,
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class DemoAccessibilityComponent {
    readonly visionThemeService = inject(VisionTheme);

    readonly themes = VISION_THEMES;

    /** Dropdown data for the theme selector. */
    readonly themeSelectData: Select2Data = VISION_THEMES.map(t => ({
        label: t.label,
        value: t.key,
    }));

    /** Palette swatches to display. */
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

    /** CSS code snippet for the currently active theme. */
    get cssSnippet(): string {
        const key = this.visionThemeService.current();
        if (key === 'none') {
            return '/* No accessibility theme applied — using default palette. */';
        }
        return `/* Import the theme file alongside css-var.css */
@import '@ikilote/magma/assets/styles/theme-${key}.css';

/* Toggle the class on <body> to activate */
document.body.classList.add('theme-${key}');`;
    }

    /** Full integration example shown in the Usage tab. */
    readonly integrationCss = `/* styles.css — import all themes you want to support */
@import '@ikilote/magma/assets/styles/css-var.css';
@import '@ikilote/magma/assets/styles/theme-protanopia.css';
@import '@ikilote/magma/assets/styles/theme-tritanopia.css';
@import '@ikilote/magma/assets/styles/theme-high-contrast.css';

/* Option 1: Use the service */
import { VisionTheme } from '@ikilote/magma';

const visionTheme = inject(VisionTheme);
visionTheme.set('protanopia');
visionTheme.set('none'); // reset

/* Option 2: Use the component */
<mg-vision-theme />             // compact — click to cycle
<mg-vision-theme [compact]="false" />  // with label`;

    /** Applies the selected theme. */
    applyTheme(key: VisionThemeType | string) {
        this.visionThemeService.set(key as VisionThemeType);
    }

    /** Returns the active theme info. */
    get activeThemeInfo() {
        return (
            this.visionThemeService.availableThemes.find(t => t.key === this.visionThemeService.current()) ??
            this.visionThemeService.availableThemes[0]
        );
    }
}
