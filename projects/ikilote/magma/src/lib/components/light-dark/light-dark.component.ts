import {
    ChangeDetectionStrategy,
    Component,
    HostListener,
    Renderer2,
    RendererFactory2,
    booleanAttribute,
    inject,
    input,
    output,
} from '@angular/core';

export type PreferenceInterfaceTheme = 'dark' | 'light';

let browserSchema: PreferenceInterfaceTheme | undefined;
let userSchema: PreferenceInterfaceTheme | undefined;

@Component({
    selector: 'mg-light-dark',
    templateUrl: './light-dark.component.html',
    styleUrls: ['./light-dark.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[attr.tabindex]': 'true',
        '[class.dark]': '!isLight()',
        '[class.light]': 'isLight()',
        '[class.compact]': 'compact()',
    },
})
export class MagmaLightDark {
    readonly rendererFactory = inject(RendererFactory2);

    readonly compact = input(false, { transform: booleanAttribute });

    readonly change = output<PreferenceInterfaceTheme>();

    private readonly renderer: Renderer2;

    constructor() {
        const rendererFactory = this.rendererFactory;

        // fix `NullInjectorError: No provider for Renderer2!`
        this.renderer = rendererFactory.createRenderer(null, null);

        browserSchema = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        this.changeThemeClass();

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            browserSchema = event.matches ? 'dark' : 'light';
            this.changeThemeClass();
        });
    }

    @HostListener('click')
    click() {
        this.toggleTheme();
        this.changeThemeClass();

        if (userSchema) {
            this.change.emit(userSchema);
        }
    }

    toggleTheme() {
        userSchema = this.isLight() ? 'dark' : 'light';
    }

    currentTheme(): PreferenceInterfaceTheme {
        return userSchema ?? browserSchema ?? 'light';
    }

    isLight() {
        return this.currentTheme() === 'light';
    }

    changeThemeClass() {
        this.renderer.addClass(document.body, this.isLight() ? 'light-mode' : 'dark-mode');
        this.renderer.removeClass(document.body, !this.isLight() ? 'light-mode' : 'dark-mode');
    }
}
