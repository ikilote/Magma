import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Json2Js } from '@ikilote/json2html';
import {
    AbstractWindowComponent,
    FormBuilderExtended,
    MagmaInput,
    MagmaInputCheckbox,
    MagmaInputElement,
    MagmaInputNumber,
    MagmaInputSelect,
    MagmaInputText,
    MagmaTableModule,
    MagmaWindowFixed,
    MagmaWindows,
    StringPipe,
} from '@ikilote/magma';

import { Select2Data } from 'ng-select2-component';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    template: `<p><button (click)="close()">Close</button></p>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    styles: [``],
})
export class TestWindowComponent extends AbstractWindowComponent {
    static className = 'TestWindowComponent'; // for prod build
}

@Component({
    template: `<p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
    </p>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    styles: [
        `
            :host {
                overflow: auto;
            }
        `,
    ],
})
export class Test2WindowComponent extends AbstractWindowComponent {
    static className = 'Test2WindowComponent'; // for prod build
}

@Component({
    selector: 'mg-title',
    changeDetection: ChangeDetectionStrategy.Eager,
    template: `Test <strong>title</strong>`,
})
class TestTilleComponent {}

@Component({
    selector: 'demo-windows',
    templateUrl: './demo-windows.component.html',
    styleUrl: './demo-windows.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        CodeTabsComponent,
        ReactiveFormsModule,
        MagmaInput,
        MagmaInputElement,
        MagmaInputSelect,
        MagmaInputCheckbox,
        MagmaInputText,
        MagmaInputNumber,
        MagmaTableModule,
        StringPipe,
    ],
})
export class DemoWindowsComponent {
    protected readonly fb = inject(FormBuilderExtended);
    protected readonly windows = inject(MagmaWindows);

    ctrlFormZone: FormGroup<{
        component: FormControl<any>;
        position: FormControl<'default' | 'center' | 'define'>;
        posX: FormControl<number>;
        posY: FormControl<number>;
        bar: FormControl<boolean>;
        barType: FormControl<'string' | 'component'>;
        barTitle: FormControl<string>;
        barButtons: FormControl<boolean>;
        width: FormControl<string>;
        minWidth: FormControl<string>;
        maxWidth: FormControl<string>;
        height: FormControl<string>;
        minHeight: FormControl<string>;
        maxHeight: FormControl<string>;
        lock: FormControl<boolean>;
        fixed: FormControl<string>;
        over: FormControl<boolean>;
    }>;

    position: Select2Data = [
        { label: 'default', value: 'default' },
        { label: 'center', value: 'center' },
        { label: '{x, y}', value: 'define' },
    ];

    fixed: Select2Data = [
        { label: 'false', value: '' },
        { label: 'true', value: 'true' },
        { label: 'top', value: 'top' },
        { label: 'bottom', value: 'bottom' },
        { label: 'left', value: 'left' },
        { label: 'right', value: 'right' },
    ];

    type: Select2Data = [
        { label: 'string', value: 'string' },
        { label: 'component', value: 'component' },
    ];

    component: Select2Data = [
        { label: 'TestWindowComponent', value: TestWindowComponent },
        { label: 'Test2WindowComponent', value: Test2WindowComponent },
    ];

    codeTsZone = '';
    codeComponent: Record<string, string> = {
        TestWindowComponent: `@Component({
    template: \`<p><button (click)="close()">Close</button></p>\`,
})
export class TestWindowComponent extends AbstractWindowComponent {}`,
        Test2WindowComponent: `@Component({
    template: \`<p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
    </p>\`,
    styles: [
        \`
            :host {
                overflow: auto;
            }
        \`,
    ],
})
export class Test2WindowComponent extends AbstractWindowComponent {}`,
    };

    constructor() {
        this.ctrlFormZone = this.fb.groupWithError({
            component: { default: TestWindowComponent },
            position: { default: 'default' as 'default' | 'center' | 'define' },
            posX: { default: 0 },
            posY: { default: 0 },
            bar: { default: true },
            barType: { default: 'string' as 'string' | 'component' },
            barTitle: { default: 'Title' },
            barButtons: { default: true },
            width: { default: '' },
            minWidth: { default: '' },
            maxWidth: { default: '' },
            height: { default: '' },
            minHeight: { default: '' },
            maxHeight: { default: '' },
            lock: { default: false },
            fixed: { default: '' as string },
            over: { default: false },
        });
        this.codeGenerationZone();

        this.ctrlFormZone.valueChanges.subscribe(() => {
            this.codeGenerationZone();
        });
    }

    openWindow() {
        const fixedValue = this.ctrlFormZone.value.fixed;
        const fixed = fixedValue === 'true' ? true : fixedValue || undefined;

        this.windows.openWindow(this.ctrlFormZone.value.component, {
            position:
                this.ctrlFormZone.value.position === 'define'
                    ? { x: this.ctrlFormZone.value.posX ?? 0, y: this.ctrlFormZone.value.posY ?? 0 }
                    : this.ctrlFormZone.value.position,
            bar: {
                active: this.ctrlFormZone.value.bar,
                title:
                    this.ctrlFormZone.value.barType === 'component'
                        ? { component: TestTilleComponent }
                        : this.ctrlFormZone.value.barTitle,
                buttons: this.ctrlFormZone.value.barButtons,
            },
            size: {
                lock: this.ctrlFormZone.value.lock || undefined,
                width: {
                    min: this.ctrlFormZone.value.minWidth || undefined,
                    max: this.ctrlFormZone.value.maxWidth || undefined,
                    init: this.ctrlFormZone.value.width || undefined,
                },
                height: {
                    min: this.ctrlFormZone.value.minHeight || undefined,
                    max: this.ctrlFormZone.value.maxHeight || undefined,
                    init: this.ctrlFormZone.value.height || undefined,
                },
            },
            fixed: fixed as MagmaWindowFixed,
            over: this.ctrlFormZone.value.over,
        });
    }

    codeGenerationZone() {
        const fixedValue = this.ctrlFormZone.value.fixed;
        const fixed = fixedValue === 'true' ? true : fixedValue || undefined;

        const param = {
            position:
                this.ctrlFormZone.value.position === 'define'
                    ? { x: this.ctrlFormZone.value.posX ?? 0, y: this.ctrlFormZone.value.posY ?? 0 }
                    : this.ctrlFormZone.value.position,
            bar: {
                active: this.ctrlFormZone.value.bar,
                title:
                    this.ctrlFormZone.value.barType === 'component'
                        ? { component: 'TestTilleComponent', inputs: {} }
                        : this.ctrlFormZone.value.barTitle,
                buttons: this.ctrlFormZone.value.barButtons,
            },
            size: {
                lock: this.ctrlFormZone.value.lock || undefined,
                width: {
                    min: this.ctrlFormZone.value.minWidth || undefined,
                    max: this.ctrlFormZone.value.maxWidth || undefined,
                    init: this.ctrlFormZone.value.width || undefined,
                },
                height: {
                    min: this.ctrlFormZone.value.minHeight || undefined,
                    max: this.ctrlFormZone.value.maxHeight || undefined,
                    init: this.ctrlFormZone.value.height || undefined,
                },
            },
            fixed,
            over: this.ctrlFormZone.value.over,
        };

        this.codeTsZone = `import { MagmaWindows } from '@ikilote/magma';

@Component({
    selector: 'my-component',
    templateUrl: './my-component.component.html',
    styleUrl: './my-component.component.scss',
})
export class DemoBlockComponent {
    protected readonly windows = inject(MagmaWindows);

    openWindow() {
        this.windows.openWindow(
            ${this.ctrlFormZone.value.component.className.replace('_', '')},
            ${new Json2Js(param, {
                tabAdded: 3,
                tabAddedExceptFirst: true,
            })
                .toString()
                .replace("'TestTilleComponent'", 'TestTilleComponent')}
        );
    }
}`;
    }
}
