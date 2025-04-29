import { ChangeDetectionStrategy, Component, booleanAttribute, inject, input, output } from '@angular/core';

import { MagmaClickEnterDirective } from '../../directives/click-enter.directive';
import { LightDark, PreferenceInterfaceTheme } from '../../services/light-dark';

@Component({
    selector: 'mg-light-dark',
    templateUrl: './light-dark.component.html',
    styleUrls: ['./light-dark.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MagmaClickEnterDirective],
    host: {
        '[attr.tabindex]': 'true',
        '[class.dark]': '!lightDarkService.isLight()',
        '[class.light]': 'lightDarkService.isLight()',
        '[class.compact]': 'compact()',
    },
})
export class MagmaLightDark {
    protected readonly lightDarkService = inject(LightDark);

    readonly compact = input(false, { transform: booleanAttribute });

    readonly change = output<PreferenceInterfaceTheme>();

    click() {
        this.lightDarkService.toggleTheme();
        this.lightDarkService.changeThemeClass();

        if (this.lightDarkService.currentTheme()) {
            this.change.emit(this.lightDarkService.currentTheme());
        }
    }
}
