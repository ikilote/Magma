import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
  input,
  model,
} from '@angular/core';

import { MagmaTabs } from './tabs.component';

@Component({
    selector: 'mg-tab-title',
    templateUrl: './tab-title.component.html',
    styleUrls: ['./tab-title.component.scss'],
    host: {
        '[attr.id]': 'id()',
        '[class.selected]': 'selected()',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagmaTabTitle implements OnInit, OnChanges {
    // inject

    private readonly tabs = inject(MagmaTabs, { host: true });

    // input

    readonly id = input.required<string>();
    readonly selected = model<boolean>(false);

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

    @HostListener('click')
    onclick() {
        if (this.tabs && this.id()) {
          setTimeout(() => {
            this.tabs.update(this.id());
          })
        }
    }
}
