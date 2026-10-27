import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';
import {
    FormBuilderExtended,
    MagmaCard3dDirective,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaTableModule,
    MagmaTabsModule,
} from '@ikilote/magma';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-card-3d',
    templateUrl: './demo-card-3d.component.html',
    styleUrl: './demo-card-3d.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        ReactiveFormsModule,
        MagmaCard3dDirective,
        MagmaInput,
        MagmaInputElement,
        MagmaInputNumber,
        MagmaInputCheckbox,
        MagmaTabsModule,
        MagmaTableModule,
        CodeTabsComponent,
    ],
})
export class DemoCard3dComponent {
    private readonly fb = inject(FormBuilderExtended);

    ctrlForm: FormGroup<{
        maxAngle: FormControl<number>;
        perspective: FormControl<number>;
        scale: FormControl<number>;
        glare: FormControl<boolean>;
        glareMax: FormControl<number>;
        sheen: FormControl<boolean>;
        lightAngle: FormControl<number>;
        sheenMax: FormControl<number>;
    }>;

    codeHtml = '';

    codeTs = `import { MagmaCard3dDirective } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    imports: [MagmaCard3dDirective],
})
export class MyComponent {}`;

    codeCss = `.card {
    border-radius: 12px;
    padding: 24px;
    background: var(--mg-color-surface);
    box-shadow: var(--mg-shadow-2);
}`;

    constructor() {
        this.ctrlForm = this.fb.groupWithError({
            maxAngle: { default: 15 },
            perspective: { default: 1000 },
            scale: { default: 1.05 },
            glare: { default: true },
            glareMax: { default: 0.6 },
            sheen: { default: false },
            lightAngle: { default: 135 },
            sheenMax: { default: 0.6 },
        });

        effect(() => this.codeGeneration());
        this.ctrlForm.valueChanges.subscribe(() => this.codeGeneration());
    }

    get hasGlare(): boolean {
        return !!this.ctrlForm?.value.glare;
    }

    get hasSheen(): boolean {
        return !!this.ctrlForm?.value.sheen;
    }

    codeGeneration(): void {
        const v = this.ctrlForm.value;
        const json: Json2htmlRef = { tag: 'div', attrs: { mgCard3d: null } };
        const attrs: Json2htmlAttr = json.attrs!;

        if (v.maxAngle != null && v.maxAngle !== 15) {
            attrs['mgCard3dMax'] = v.maxAngle;
        }
        if (v.perspective && v.perspective !== 1000) {
            attrs['mgCard3dPerspective'] = v.perspective;
        }
        if (v.scale && v.scale !== 1.05) {
            attrs['mgCard3dScale'] = v.scale;
        }
        if (v.glare) {
            attrs['mgCard3dGlare'] = null;
        }
        if (v.glare && v.glareMax != null && v.glareMax !== 0.6) {
            attrs['mgCard3dGlareMax'] = v.glareMax;
        }
        if (v.sheen) {
            attrs['mgCard3dSheen'] = null;
        }
        if (v.sheen && v.lightAngle != null && v.lightAngle !== 135) {
            attrs['mgCard3dLightAngle'] = v.lightAngle;
        }
        if (v.sheen && v.sheenMax != null && v.sheenMax !== 0.6) {
            attrs['mgCard3dSheenMax'] = v.sheenMax;
        }

        this.codeHtml = new Json2html(json).toString();
    }
}
