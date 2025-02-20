import { Injectable, Renderer2, RendererFactory2, inject } from '@angular/core';

export type PreferenceInterfaceTheme = 'dark' | 'light';

@Injectable({
    providedIn: 'root',
})
export class LightDark {
    private browserLightDark: PreferenceInterfaceTheme | undefined;
    private userLightDark: PreferenceInterfaceTheme | undefined;

    readonly rendererFactory = inject(RendererFactory2);
    private readonly renderer: Renderer2;

    private first = false;

    constructor() {
        const rendererFactory = this.rendererFactory;

        // fix `NullInjectorError: No provider for Renderer2!`
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    init(value?: PreferenceInterfaceTheme) {
        if (!this.first) {
            this.first = true;

            if (value) {
                this.userLightDark = value;
            }

            this.browserLightDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            this.changeThemeClass();

            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
                this.browserLightDark = event.matches ? 'dark' : 'light';
                this.changeThemeClass();
            });
        }
    }

    set(value: PreferenceInterfaceTheme) {
        this.userLightDark = value;
        this.changeThemeClass();
    }

    currentTheme(): PreferenceInterfaceTheme {
        return this.userLightDark ?? this.browserLightDark ?? 'light';
    }

    changeThemeClass() {
        this.renderer.addClass(document.body, this.isLight() ? 'light-mode' : 'dark-mode');
        this.renderer.removeClass(document.body, !this.isLight() ? 'light-mode' : 'dark-mode');
    }

    toggleTheme() {
        this.userLightDark = this.isLight() ? 'dark' : 'light';
    }

    isLight() {
        return this.currentTheme() === 'light';
    }
}
