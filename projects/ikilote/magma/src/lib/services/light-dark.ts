import { Renderer2, RendererFactory2, Service, inject, signal } from '@angular/core';

import { Subject } from 'rxjs';

export type PreferenceInterfaceTheme = 'dark' | 'light';

@Service()
export class LightDark {
    private browserLightDark: PreferenceInterfaceTheme | undefined;
    private userLightDark: PreferenceInterfaceTheme | undefined;

    /** Reactive signal emitting the current theme. Updates on every change
     *  (user toggle, browser preference change, or programmatic `set()`). */
    readonly theme = signal<PreferenceInterfaceTheme>('light');

    /** Observable that emits after each theme change, once the class swap on
     *  body is done and computed styles are ready to be read. */
    readonly themeChange$ = new Subject<PreferenceInterfaceTheme>();

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

            window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', event => {
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
        this.theme.set(this.currentTheme());
        this.themeChange$.next(this.currentTheme());
    }

    toggleTheme() {
        this.userLightDark = this.isLight() ? 'dark' : 'light';
    }

    isLight() {
        return this.currentTheme() === 'light';
    }
}
