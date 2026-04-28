import { Component } from '@angular/core';

import { MagmaCssVarEditor } from '../../../../projects/ikilote/magma/src/lib/components/css-var-editor/css-var-editor.component';
import { MagmaBorderEditor } from '../../../../projects/ikilote/magma/src/lib/components/css-var-editor/editors/border-editor.component';
import { MagmaColorMixEditor } from '../../../../projects/ikilote/magma/src/lib/components/css-var-editor/editors/color-mix-editor.component';
import { MagmaFilterEditor } from '../../../../projects/ikilote/magma/src/lib/components/css-var-editor/editors/filter-editor.component';
import { MagmaGradientEditor } from '../../../../projects/ikilote/magma/src/lib/components/css-var-editor/editors/gradient-editor.component';
import { MagmaShadowEditor } from '../../../../projects/ikilote/magma/src/lib/components/css-var-editor/editors/shadow-editor.component';
import { MagmaTransformEditor } from '../../../../projects/ikilote/magma/src/lib/components/css-var-editor/editors/transform-editor.component';
import { MagmaTypographyEditor } from '../../../../projects/ikilote/magma/src/lib/components/css-var-editor/editors/typography-editor.component';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-css-var-editor',
    templateUrl: './demo-css-var-editor.component.html',
    styleUrl: './demo-css-var-editor.component.scss',
    imports: [
        MagmaCssVarEditor,
        MagmaShadowEditor,
        MagmaGradientEditor,
        MagmaBorderEditor,
        MagmaColorMixEditor,
        MagmaFilterEditor,
        MagmaTransformEditor,
        MagmaTypographyEditor,
        CodeTabsComponent,
    ],
})
export class DemoCssVarEditorComponent {
    codeFullEditor = `<mg-css-var-editor />`;

    codeFiltered = `<mg-css-var-editor filter="--button" />`;

    codeStandalone = `<mg-shadow-editor (valueChange)="onShadow($event)" />
<mg-gradient-editor (valueChange)="onGradient($event)" />
<mg-border-editor (valueChange)="onBorder($event)" />
<mg-color-mix-editor (valueChange)="onColorMix($event)" />
<mg-filter-editor (valueChange)="onFilter($event)" />
<mg-transform-editor (valueChange)="onTransform($event)" />
<mg-typography-editor (valueChange)="onTypography($event)" />`;

    codeTs = `import {
    MagmaCssVarEditor,
    MagmaShadowEditor,
    MagmaGradientEditor,
    MagmaBorderEditor,
    MagmaColorMixEditor,
    MagmaFilterEditor,
    MagmaTransformEditor,
    MagmaTypographyEditor,
} from '@ikilote/magma';

@Component({
    imports: [
        MagmaCssVarEditor,
        MagmaShadowEditor,
        // ...
    ],
})
export class MyComponent { }`;

    codeLabels = `import { CssVarEditorLabels } from '@ikilote/magma';

const frLabels: CssVarEditorLabels = {
    search: 'Rechercher',
    searchPlaceholder: 'Rechercher une variable...',
    resetAll: 'Tout réinitialiser',
    copyChanges: 'Copier les modifications',
    noResults: 'Aucune variable trouvée.',
};`;

    codeLabelsHtml = `<mg-css-var-editor [labels]="frLabels" />`;

    lastShadow = '';
    lastGradient = '';
    lastBorder = '';
    lastColorMix = '';
    lastFilter = '';
    lastTransform = '';
    lastTypography = '';
}
