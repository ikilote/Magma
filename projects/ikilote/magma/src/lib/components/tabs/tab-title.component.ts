import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
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
    styleUrl: './tab-title.component.scss',
    host: {
        '[attr.id]': '"tab-" + id()',
        '[class.selected]': 'selected()',
        tabindex: '0',
    },
    hostDirectives: [MagmaClickEnterDirective],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagmaTabTitle implements OnInit, OnChanges {
    // inject

    private readonly click = inject(MagmaClickEnterDirective);
    readonly element = inject(ElementRef<HTMLElement>);

    // input

    readonly id = input.required<string>();
    readonly selected = model<boolean>(false);

    // host : not use inject(MagmaTabs, { host: true }); to fix circular dependency
    tabs?: MagmaTabs;

    constructor() {
        this.click.clickEnter.subscribe(() => {
            this.onclick();
        });
    }

    @HostListener('keydown.ArrowLeft')
    focusLeft() {
        if (this.tabs) {
            this.tabs.titles()[Math.max(0, this.tabs.titles().indexOf(this) - 1)].element.nativeElement.focus();
        }
    }

    @HostListener('keydown.ArrowRight')
    focusRight() {
        if (this.tabs) {
            this.tabs
                .titles()
                [
                    Math.min(this.tabs.titles().length - 1, this.tabs.titles().indexOf(this) + 1)
                ].element.nativeElement.focus();
        }
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
        setTimeout(() => {
            if (this.tabs && this.id()) {
                this.tabs.update(this.id());
                this.tabs.tabpanel()?.nativeElement.focus();
            }
        });
    }
}
