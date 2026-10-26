import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2html, Json2htmlAttr, Json2htmlRef } from '@ikilote/json2html';
import {
    FormBuilderExtended,
    MagmaInput,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputSelect,
    MagmaSpinner,
    MagmaTableModule,
    MagmaTabsModule,
    SpinnerType,
} from '@ikilote/magma';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-spinner',
    templateUrl: './demo-spinner.component.html',
    styleUrl: './demo-spinner.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        CodeTabsComponent,
        ReactiveFormsModule,
        MagmaSpinner,
        MagmaInput,
        MagmaInputElement,
        MagmaInputNumber,
        MagmaInputSelect,
        MagmaTabsModule,
        MagmaTableModule,
    ],
})
export class DemoSpinnerComponent {
    readonly fb = inject(FormBuilderExtended);

    ctrlForm: FormGroup<{
        type: FormControl<SpinnerType>;
        // shared
        size: FormControl<number>;
        radius: FormControl<number>;
        // ticks
        tickWidth: FormControl<number>;
        // ring / arc
        strokeWidth: FormControl<number>;
        // dots / chase
        dotSize: FormControl<number>;
        count: FormControl<number>;
        minScale: FormControl<number>;
        // wave / bounce / grid
        barItemWidth: FormControl<number>;
        // bar
        barWidth: FormControl<number>;
        barHeight: FormControl<number>;
        // orbit
        orbitRadius: FormControl<number>;
        orbitBallSize: FormControl<number>;
    }>;

    readonly typeOptions = [
        { value: 'ticks', label: 'Ticks' },
        { value: 'ring', label: 'Ring' },
        { value: 'arc', label: 'Arc' },
        { value: 'dots', label: 'Dots' },
        { value: 'chase', label: 'Chase' },
        { value: 'bounce', label: 'Bounce' },
        { value: 'wave', label: 'Wave' },
        { value: 'bar', label: 'Bar' },
        { value: 'pulse', label: 'Pulse' },
        { value: 'ripple', label: 'Ripple' },
        { value: 'flip', label: 'Flip' },
        { value: 'orbit', label: 'Orbit' },
        { value: 'grid', label: 'Grid' },
        { value: 'blink', label: 'Blink' },
        { value: 'morph', label: 'Morph' },
        { value: 'comet', label: 'Comet' },
        { value: 'infinity', label: 'Infinity' },
        { value: 'heartbeat', label: 'Heartbeat' },
    ];

    get currentType(): SpinnerType {
        return this.ctrlForm?.value.type ?? 'ticks';
    }

    get isTicks(): boolean {
        return this.currentType === 'ticks';
    }
    get isRing(): boolean {
        return this.currentType === 'ring';
    }
    get isArc(): boolean {
        return this.currentType === 'arc';
    }
    get isDots(): boolean {
        return this.currentType === 'dots';
    }
    get isChase(): boolean {
        return this.currentType === 'chase';
    }
    get isBounce(): boolean {
        return this.currentType === 'bounce';
    }
    get isWave(): boolean {
        return this.currentType === 'wave';
    }
    get isBar(): boolean {
        return this.currentType === 'bar';
    }
    get isPulse(): boolean {
        return this.currentType === 'pulse';
    }
    get isRipple(): boolean {
        return this.currentType === 'ripple';
    }
    get isFlip(): boolean {
        return this.currentType === 'flip';
    }
    get isOrbit(): boolean {
        return this.currentType === 'orbit';
    }
    get isGrid(): boolean {
        return this.currentType === 'grid';
    }
    get isBlink(): boolean {
        return this.currentType === 'blink';
    }
    get isMorph(): boolean {
        return this.currentType === 'morph';
    }
    get isComet(): boolean {
        return this.currentType === 'comet';
    }
    get isInfinity(): boolean {
        return this.currentType === 'infinity';
    }
    get isHeartbeat(): boolean {
        return this.currentType === 'heartbeat';
    }

    /** Types that share the `size` input for overall dimensions. */
    get hasSize(): boolean {
        return !this.isBar;
    }

    /** Types que utilisent minScale */
    get hasMinScale(): boolean {
        return this.isDots || this.isChase || this.isPulse;
    }

    /** Types that use count */
    get hasCount(): boolean {
        return this.isDots || this.isChase || this.isBounce || this.isWave || this.isGrid || this.isBlink;
    }

    /** Types that use strokeWidth */
    get hasStrokeWidth(): boolean {
        return this.isRing || this.isArc || this.isRipple || this.isComet || this.isHeartbeat;
    }

    /** Types that use radius */
    get hasRadius(): boolean {
        return this.isTicks || this.isBar || this.isFlip || this.isGrid || this.isMorph;
    }

    codeHtml = '';

    codeTs = `import { MagmaSpinner } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    styleUrl: './my-component.component.scss',
    imports: [MagmaSpinner],
})
export class MyComponent {}`;

    constructor() {
        this.ctrlForm = this.fb.groupWithError({
            type: { default: 'ticks' as SpinnerType },
            size: { default: 0, emptyOnInit: true },
            radius: { default: 0, emptyOnInit: true },
            tickWidth: { default: 0, emptyOnInit: true },
            strokeWidth: { default: 0, emptyOnInit: true },
            dotSize: { default: 0, emptyOnInit: true },
            count: { default: 0, emptyOnInit: true },
            minScale: { default: 0, emptyOnInit: true },
            barItemWidth: { default: 0, emptyOnInit: true },
            barWidth: { default: 0, emptyOnInit: true },
            barHeight: { default: 0, emptyOnInit: true },
            orbitRadius: { default: 0, emptyOnInit: true },
            orbitBallSize: { default: 0, emptyOnInit: true },
        });
        this.codeGeneration();
        this.ctrlForm.valueChanges.subscribe(() => this.codeGeneration());
    }

    codeGeneration() {
        const json: Json2htmlRef = { tag: 'mg-spinner', attrs: {} };
        const attrs: Json2htmlAttr = json.attrs!;
        const v = this.ctrlForm.value;

        if (v.type && v.type !== 'ticks') {
            attrs['type'] = v.type;
        }

        switch (v.type) {
            case 'ticks':
                if (v.size) {
                    attrs['size'] = v.size;
                }
                if (v.tickWidth) {
                    attrs['tickWidth'] = v.tickWidth;
                }
                if (v.radius) {
                    attrs['radius'] = v.radius;
                }
                break;
            case 'ring':
            case 'arc':
                if (v.size) {
                    attrs['size'] = v.size;
                }
                if (v.strokeWidth) {
                    attrs['strokeWidth'] = v.strokeWidth;
                }
                break;
            case 'dots':
            case 'chase':
                if (v.size) {
                    attrs['size'] = v.size;
                }
                if (v.dotSize) {
                    attrs['dotSize'] = v.dotSize;
                }
                if (v.count) {
                    attrs['count'] = v.count;
                }
                if (v.minScale) {
                    attrs['minScale'] = v.minScale;
                }
                break;
            case 'bounce':
                if (v.size) {
                    attrs['size'] = v.size;
                }
                if (v.count) {
                    attrs['count'] = v.count;
                }
                break;
            case 'wave':
                if (v.size) {
                    attrs['size'] = v.size;
                }
                if (v.count) {
                    attrs['count'] = v.count;
                }
                if (v.barItemWidth) {
                    attrs['barItemWidth'] = v.barItemWidth;
                }
                break;
            case 'bar':
                if (v.barWidth) {
                    attrs['barWidth'] = v.barWidth;
                }
                if (v.barHeight) {
                    attrs['barHeight'] = v.barHeight;
                }
                if (v.radius) {
                    attrs['radius'] = v.radius;
                }
                break;
            case 'pulse':
                if (v.size) {
                    attrs['size'] = v.size;
                }
                if (v.minScale) {
                    attrs['minScale'] = v.minScale;
                }
                break;
            case 'ripple':
                if (v.size) {
                    attrs['size'] = v.size;
                }
                if (v.strokeWidth) {
                    attrs['strokeWidth'] = v.strokeWidth;
                }
                break;
            case 'flip':
                if (v.size) {
                    attrs['size'] = v.size;
                }
                if (v.radius) {
                    attrs['radius'] = v.radius;
                }
                break;
            case 'orbit':
                if (v.size) {
                    attrs['size'] = v.size;
                }
                if (v.orbitRadius) {
                    attrs['orbitRadius'] = v.orbitRadius;
                }
                if (v.orbitBallSize) {
                    attrs['orbitBallSize'] = v.orbitBallSize;
                }
                break;
            case 'grid':
                if (v.size) {
                    attrs['size'] = v.size;
                }
                if (v.count) {
                    attrs['count'] = v.count;
                }
                if (v.radius) {
                    attrs['radius'] = v.radius;
                }
                break;
            case 'blink':
                if (v.size) {
                    attrs['size'] = v.size;
                }
                if (v.count) {
                    attrs['count'] = v.count;
                }
                if (v.dotSize) {
                    attrs['dotSize'] = v.dotSize;
                }
                break;
            case 'morph':
                if (v.size) {
                    attrs['size'] = v.size;
                }
                if (v.radius) {
                    attrs['radius'] = v.radius;
                }
                break;
            case 'comet':
                if (v.size) {
                    attrs['size'] = v.size;
                }
                if (v.strokeWidth) {
                    attrs['strokeWidth'] = v.strokeWidth;
                }
                break;
            case 'infinity':
                if (v.size) {
                    attrs['size'] = v.size;
                }
                if (v.dotSize) {
                    attrs['dotSize'] = v.dotSize;
                }
                break;
            case 'heartbeat':
                if (v.size) {
                    attrs['size'] = v.size;
                }
                if (v.strokeWidth) {
                    attrs['strokeWidth'] = v.strokeWidth;
                }
                break;
        }

        this.codeHtml = new Json2html(json).toString();
    }
}
