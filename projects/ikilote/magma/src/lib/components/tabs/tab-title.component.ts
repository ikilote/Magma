import {
    ChangeDetectionStrategy,
    Component,
    OnChanges,
    OnInit,
    SimpleChanges,
    inject,
    input,
    model,
} from '@angular/core';

import { MagmaTabs } from './tabs.component';

import { MagmaClickEnterDirective } from '../../directives/click-enter.directive';

@Component({
    selector: 'mg-tab-title',
    templateUrl: './tab-title.component.html',
    styleUrls: ['./tab-title.component.scss'],
    host: {
        '[attr.id]': 'id()',
        '[class.selected]': 'selected()',
        tabindex: '0',
    },
    hostDirectives: [MagmaClickEnterDirective],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagmaTabTitle implements OnInit, OnChanges {
    // inject

    private readonly tabs = inject(MagmaTabs, { host: true });
    private readonly click = inject(MagmaClickEnterDirective);

    // input

    readonly id = input.required<string>();
    readonly selected = model<boolean>(false);

    constructor() {
        this.click.clickEnter.subscribe(() => {
            this.onclick();
        });
    }

    ngOnInit(): void {
        if (this.selected()) {
            this.onclick();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['selected']?.currentValue) {
            this.onclick();
        }
    }

    onclick() {
        if (this.tabs && this.id()) {
            setTimeout(() => {
                this.tabs.update(this.id());
            });
        }
    }
}
