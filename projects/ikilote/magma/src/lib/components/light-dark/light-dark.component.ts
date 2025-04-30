import {
    ChangeDetectionStrategy,
    Component,
    OnChanges,
    OnInit,
    SimpleChanges,
    booleanAttribute,
    inject,
    input,
    output,
} from '@angular/core';

import { MagmaClickEnterDirective } from '../../directives/click-enter.directive';
import { LightDark, PreferenceInterfaceTheme } from '../../services/light-dark';

@Component({
    selector: 'mg-light-dark',
    templateUrl: './light-dark.component.html',
    styleUrls: ['./light-dark.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MagmaClickEnterDirective],
    hostDirectives: [MagmaClickEnterDirective],
    host: {
        '[class.dark]': '!lightDarkService.isLight()',
        '[class.light]': 'lightDarkService.isLight()',
        '[class.compact]': 'compact()',
    },
})
export class MagmaLightDark implements OnInit, OnChanges {
    protected readonly lightDarkService = inject(LightDark);
    protected readonly clickEnter = inject(MagmaClickEnterDirective);

    readonly compact = input(false, { transform: booleanAttribute });

    readonly change = output<PreferenceInterfaceTheme>();

    constructor() {
        this.clickEnter.clickEnter.subscribe(() => {
            if (this.compact()) {
                this.click();
            }
        });
    }

    ngOnInit(): void {
        this.clickEnter.disabled = !this.compact();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['compact']) {
            this.clickEnter.disabled = !changes['compact'].currentValue;
        }
    }

    click() {
        this.lightDarkService.toggleTheme();
        this.lightDarkService.changeThemeClass();

        if (this.lightDarkService.currentTheme()) {
            this.change.emit(this.lightDarkService.currentTheme());
        }
    }
}
