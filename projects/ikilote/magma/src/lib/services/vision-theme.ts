import { Renderer2, RendererFactory2, Service, inject, signal } from '@angular/core';

import { Subject } from 'rxjs';

/** Available vision accessibility theme identifiers. */
export type VisionThemeType =
    'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia' | 'high-contrast' | (string & {});

/** Metadata for each vision theme. */
export interface VisionThemeInfo {
    key: VisionThemeType;
    label: string;
    description: string;
}

/** Registry of all available vision themes. */
export const VISION_THEMES: VisionThemeInfo[] = [
    {
        key: 'none',
        label: 'Default',
        description: 'Standard color palette with no accessibility adjustments.',
    },
    {
        key: 'protanopia',
        label: 'Protanopia',
        description: 'Red-green color blindness — replaces red/green with blue/orange.',
    },
    {
        key: 'deuteranopia',
        label: 'Deuteranopia',
        description: 'Red-green color blindness (green-weak) — replaces red/green with blue/orange.',
    },
    {
        key: 'tritanopia',
        label: 'Tritanopia',
        description: 'Blue-yellow color blindness — replaces blue/yellow with red/cyan.',
    },
    {
        key: 'achromatopsia',
        label: 'Achromatopsia',
        description: 'Complete color blindness — all hues desaturated, information conveyed by lightness only.',
    },
    {
        key: 'high-contrast',
        label: 'High Contrast',
        description: 'Maximum contrast for low vision users.',
    },
];

/**
 * Service to manage vision accessibility themes.
 *
 * Works similarly to `LightDark` — toggles CSS classes on `<body>`.
 * Theme CSS files must be imported for the classes to have effect.
 *
 * Supports both single-theme mode (`set()`) and multi-theme mode (`add()`/`remove()`).
 *
 * @example
 * ```ts
 * const visionTheme = inject(VisionTheme);
 *
 * // Single mode — only one at a time
 * visionTheme.set('protanopia');
 *
 * // Multi mode — stack multiple themes
 * visionTheme.add('protanopia');
 * visionTheme.add('high-contrast');
 * // body now has: theme-protanopia theme-high-contrast
 *
 * visionTheme.remove('protanopia');
 * visionTheme.clear(); // remove all
 * ```
 */
@Service()
export class VisionTheme {
    private readonly rendererFactory = inject(RendererFactory2);
    private readonly renderer: Renderer2;

    /**
     * Reactive signal emitting the current vision theme (single mode).
     * In multi mode, this reflects the last theme added, or 'none' if empty.
     */
    readonly theme = signal<VisionThemeType>('none');

    /**
     * Reactive signal emitting all active themes (multi mode).
     * Empty array means no theme is active.
     */
    readonly activeThemes = signal<VisionThemeType[]>([]);

    /** Observable that emits after each theme change. */
    readonly themeChange$ = new Subject<VisionThemeType>();

    /** Observable that emits the full list of active themes after each change (multi mode). */
    readonly activeThemesChange$ = new Subject<VisionThemeType[]>();

    /** All available themes metadata. */
    readonly availableThemes = VISION_THEMES;

    constructor() {
        this.renderer = this.rendererFactory.createRenderer(null, null);
    }

    // ── Single mode ─────────────────────────────────────────────────────────

    /**
     * Sets a single active vision theme (exclusive).
     * Removes all previously active themes. Pass `'none'` to clear.
     */
    set(value: VisionThemeType) {
        // Remove all currently active classes
        for (const key of this.activeThemes()) {
            this.renderer.removeClass(document.body, `theme-${key}`);
        }

        // Also remove all known built-in theme classes (safety net)
        for (const t of VISION_THEMES) {
            if (t.key !== 'none') {
                this.renderer.removeClass(document.body, `theme-${t.key}`);
            }
        }

        // Apply new theme
        if (value !== 'none') {
            this.renderer.addClass(document.body, `theme-${value}`);
            this.activeThemes.set([value]);
        } else {
            this.activeThemes.set([]);
        }

        this.theme.set(value);
        this.themeChange$.next(value);
        this.activeThemesChange$.next(this.activeThemes());
    }

    /** Returns the currently active vision theme key (single mode). */
    current(): VisionThemeType {
        return this.theme();
    }

    /** Cycles to the next vision theme in the list. Wraps around. */
    next() {
        const keys = VISION_THEMES.map(t => t.key);
        const idx = keys.indexOf(this.theme());
        const nextIdx = (idx + 1) % keys.length;
        this.set(keys[nextIdx]);
    }

    /** Cycles to the previous vision theme in the list. Wraps around. */
    previous() {
        const keys = VISION_THEMES.map(t => t.key);
        const idx = keys.indexOf(this.theme());
        const prevIdx = (idx - 1 + keys.length) % keys.length;
        this.set(keys[prevIdx]);
    }

    // ── Multi mode ──────────────────────────────────────────────────────────

    /**
     * Adds a theme to the active set (stacking).
     * Does nothing if the theme is already active or if 'none' is passed.
     */
    add(value: VisionThemeType) {
        if (value === 'none' || this.isActive(value)) {
            return;
        }

        this.renderer.addClass(document.body, `theme-${value}`);
        this.activeThemes.update(list => [...list, value]);
        this.theme.set(value);
        this.themeChange$.next(value);
        this.activeThemesChange$.next(this.activeThemes());
    }

    /**
     * Removes a theme from the active set.
     * Does nothing if the theme is not currently active.
     */
    remove(value: VisionThemeType) {
        if (!this.isActive(value)) {
            return;
        }

        this.renderer.removeClass(document.body, `theme-${value}`);
        this.activeThemes.update(list => list.filter(k => k !== value));

        // Update the single-theme signal
        const remaining = this.activeThemes();
        this.theme.set(remaining.length > 0 ? remaining[remaining.length - 1] : 'none');
        this.themeChange$.next(this.theme());
        this.activeThemesChange$.next(this.activeThemes());
    }

    /**
     * Toggles a theme: adds it if inactive, removes it if active.
     */
    toggle(value: VisionThemeType) {
        if (this.isActive(value)) {
            this.remove(value);
        } else {
            this.add(value);
        }
    }

    /** Returns true if the given theme is currently active. */
    isActive(value: VisionThemeType): boolean {
        return this.activeThemes().includes(value);
    }

    /** Removes all active themes (equivalent to `set('none')`). */
    clear() {
        this.set('none');
    }
}
