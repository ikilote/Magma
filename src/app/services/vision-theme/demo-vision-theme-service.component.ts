import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import {
    FormBuilderExtended,
    MagmaInput,
    MagmaInputElement,
    MagmaInputRadio,
    MagmaInputSelect,
    MagmaTableModule,
    MagmaTabsModule,
    MagmaVisionTheme,
    VisionTheme,
    VisionThemeType,
} from '@ikilote/magma';

import { Select2Data } from 'ng-select2-component';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-vision-theme-service',
    templateUrl: './demo-vision-theme-service.component.html',
    styleUrl: './demo-vision-theme-service.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ReactiveFormsModule,
        MagmaVisionTheme,
        MagmaInput,
        MagmaInputElement,
        MagmaInputRadio,
        MagmaInputSelect,
        CodeTabsComponent,
        MagmaTabsModule,
        MagmaTableModule,
    ],
})
export class DemoVisionThemeServiceComponent {
    readonly visionThemeService = inject(VisionTheme);
    protected readonly fb = inject(FormBuilderExtended);

    ctrlForm: FormGroup<{
        method: FormControl<'set' | 'add' | 'toggle' | 'next' | 'previous'>;
        theme: FormControl<VisionThemeType>;
    }>;

    methods: Select2Data = [
        { label: 'set()', value: 'set' },
        { label: 'add()', value: 'add' },
        { label: 'toggle()', value: 'toggle' },
        { label: 'next()', value: 'next' },
        { label: 'previous()', value: 'previous' },
    ];

    themes: Select2Data = [
        { label: 'none (reset)', value: 'none' },
        { label: 'protanopia', value: 'protanopia' },
        { label: 'deuteranopia', value: 'deuteranopia' },
        { label: 'tritanopia', value: 'tritanopia' },
        { label: 'achromatopsia', value: 'achromatopsia' },
        { label: 'high-contrast', value: 'high-contrast' },
    ];

    codeTs = '';

    readonly codeImport = `/* Additional required in styles.css */
@import '@ikilote/magma/assets/styles/theme-protanopia.css';
@import '@ikilote/magma/assets/styles/theme-deuteranopia.css';
@import '@ikilote/magma/assets/styles/theme-tritanopia.css';
@import '@ikilote/magma/assets/styles/theme-achromatopsia.css';
@import '@ikilote/magma/assets/styles/theme-high-contrast.css';`;

    constructor() {
        this.ctrlForm = this.fb.groupWithError({
            method: { default: 'set' as 'set' | 'add' | 'toggle' | 'next' | 'previous' },
            theme: { default: 'protanopia' as VisionThemeType },
        });

        this.generateCode();

        this.ctrlForm.valueChanges.subscribe(() => {
            this.generateCode();
        });
    }

    applyTheme() {
        const { method, theme } = this.ctrlForm.value;
        switch (method) {
            case 'set':
                this.visionThemeService.set(theme!);
                break;
            case 'add':
                this.visionThemeService.add(theme!);
                break;
            case 'toggle':
                this.visionThemeService.toggle(theme!);
                break;
            case 'next':
                this.visionThemeService.next();
                break;
            case 'previous':
                this.visionThemeService.previous();
                break;
        }
    }

    reset() {
        this.visionThemeService.set('none');
    }

    generateCode() {
        const { method, theme } = this.ctrlForm.value;
        const needsTheme = method === 'set' || method === 'add' || method === 'toggle';
        const call = needsTheme ? `this.visionTheme.${method}('${theme}');` : `this.visionTheme.${method}();`;

        this.codeTs = `import { VisionTheme } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
})
export class MyComponent {
    private readonly visionTheme = inject(VisionTheme);

    applyTheme() {
        ${call}
    }

    reset() {
        this.visionTheme.set('none');
    }
}`;
    }
}
