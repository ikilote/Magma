import { Component, Renderer2, RendererStyleFlags2, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import {
    FormBuilderExtended,
    MagmaInput,
    MagmaInputElement,
    MagmaInputNumber,
} from '../../../../projects/ikilote/magma/src/public-api';

@Component({
    selector: 'demo-palette',
    templateUrl: './demo-palette.component.html',
    styleUrls: ['./demo-palette.component.scss'],
    imports: [MagmaInput, MagmaInputNumber, ReactiveFormsModule, MagmaInputElement],
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
            list: [...'0123456789A'.split('')],
        },
        {
            group: 'neutral',
            list: ['', ...'0123456789AB'.split('')],
        },
        {
            group: 'alert',
            list: [...'0123456789A'.split('')],
        },
        {
            group: 'warn',
            list: [...'0123456789A'.split('')],
        },
        {
            group: 'success',
            list: [...'0123456789A'.split('')],
        },
    ];

    readonly form: FormGroup<{
        hue: FormControl<number>;
    }>;

    constructor() {
        this.form = this.fbe.groupWithErrorNonNullable({
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
