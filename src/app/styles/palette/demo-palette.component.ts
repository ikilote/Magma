import { ChangeDetectionStrategy, Component, Renderer2, RendererStyleFlags2, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FormBuilderExtended } from '@ikilote/magma';

@Component({
    selector: 'demo-palette',
    templateUrl: './demo-palette.component.html',
    styleUrl: './demo-palette.component.scss',
    imports: [ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.Eager,
    host: {
        '[style.--primaryH]': 'form.value.hue',
    },
})
export class DemoPaletteComponent {
    private readonly fbe = inject(FormBuilderExtended);
    private readonly renderer = inject(Renderer2);

    palette = [
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

    readonly form: FormGroup<{
        hue: FormControl<number>;
    }>;

    constructor() {
        this.form = this.fbe.groupWithError({
            hue: { default: 210 },
        });

        this.form.get('hue')?.valueChanges.subscribe(value => {
            const body = document.body;
            const r = this.renderer.setStyle;
            const dash = RendererStyleFlags2.DashCase;
            // title
            r(body, '--primaryH', value, dash);
        });
    }
}
