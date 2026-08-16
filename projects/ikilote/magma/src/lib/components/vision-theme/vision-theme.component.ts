import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
    Component,
    ElementRef,
    booleanAttribute,
    computed,
    inject,
    input,
    output,
    signal,
    viewChild,
} from '@angular/core';

import { MagmaLimitFocusDirective } from '../../directives/limit-focus.directive';
import { VISION_THEMES, VisionTheme, VisionThemeInfo, VisionThemeType } from '../../services/vision-theme';

/**
 * Vision accessibility theme switcher component.
 *
 * Provides a button that opens a dropdown to pick a vision theme.
 * Supports single-select (radio) and multi-select (checkbox) modes.
 *
 * @example
 * ```html
 * <!-- Single select (default) -->
 * <mg-vision-theme />
 *
 * <!-- Multi select: allows stacking themes -->
 * <mg-vision-theme multiple compact />
 *
 * <!-- Custom themes + i18n -->
 * <mg-vision-theme [themes]="translatedThemes" ariaLabel="Thème visuel" />
 * ```
 */
@Component({
    selector: 'mg-vision-theme',
    templateUrl: './vision-theme.component.html',
    styleUrl: './vision-theme.component.scss',
    imports: [CdkOverlayOrigin, CdkConnectedOverlay, MagmaLimitFocusDirective],
    host: {
        '[class.compact]': 'compact()',
        '[class.has-theme]': 'visionThemeService.activeThemes().length > 0',
    },
})
export class MagmaVisionTheme {
    protected readonly visionThemeService = inject(VisionTheme);
    protected readonly button = viewChild.required<ElementRef<HTMLButtonElement>>('button');

    /** When true, shows only the icon. When false, also shows the current theme label. */
    readonly compact = input(false, { transform: booleanAttribute });

    /**
     * When true, allows selecting multiple themes simultaneously (checkbox mode).
     * When false, only one theme can be active at a time (radio mode, default).
     */
    readonly multiple = input(false, { transform: booleanAttribute });

    /**
     * Custom list of themes to display in the dropdown.
     * Each item must have a `key` (used as CSS class `theme-{key}`), a `label`, and a `description`.
     * Defaults to the built-in vision themes (none, protanopia, tritanopia, high-contrast).
     */
    readonly themes = input<VisionThemeInfo[]>(VISION_THEMES);

    /** Aria label for the trigger button. Override for i18n. */
    readonly ariaLabel = input<string>('Vision accessibility theme');

    /** Aria label for the dropdown list. Override for i18n. */
    readonly listAriaLabel = input<string>('Vision themes');

    /** Aria label for the dropdown list. Override for i18n. */
    readonly clearAllLabel = input<string>('Clear all');

    /** Emits the new theme key whenever the user switches theme (single mode). */
    readonly themeChange = output<VisionThemeType>();

    /** Emits all active theme keys when selection changes (multi mode). */
    readonly themesChange = output<VisionThemeType[]>();

    /** Dropdown open state. */
    protected readonly isOpen = signal(false);

    /** Resolved list of themes (from input or default). */
    protected readonly resolvedThemes = computed(() => this.themes());

    /**
     * Themes to display in multi mode (excludes 'none' since it means "clear all").
     */
    protected readonly selectableThemes = computed(() =>
        this.multiple() ? this.resolvedThemes().filter(t => t.key !== 'none') : this.resolvedThemes(),
    );

    /** Returns the human-readable label of the current theme(s). */
    currentLabel(): string {
        if (this.multiple()) {
            const active = this.visionThemeService.activeThemes();
            return active.length === 0
                ? (this.resolvedThemes().find(t => t.key === 'none')?.label ?? 'Default')
                : active.map(key => this.resolvedThemes().find(t => t.key === key)?.label ?? key).join(', ');
        }
        const current = this.visionThemeService.theme();
        const info = this.resolvedThemes().find(t => t.key === current);
        return info?.label ?? current;
    }

    /** Opens the dropdown. */
    open() {
        this.isOpen.set(true);
    }

    /** Closes the dropdown and refocuses the trigger button. */
    close() {
        this.isOpen.set(false);
        setTimeout(() => {
            this.button().nativeElement.focus();
        });
    }

    /** Handles item click depending on single/multi mode. */
    selectTheme(theme: VisionThemeType) {
        if (this.multiple()) {
            if (theme === 'none') {
                // "Clear all" in multi mode
                this.visionThemeService.clear();
                this.themesChange.emit([]);
                this.close();
            } else {
                // Toggle the theme (don't close the dropdown)
                this.visionThemeService.toggle(theme);
                this.themesChange.emit(this.visionThemeService.activeThemes());
            }
        } else {
            // In single mode, set exclusively and close
            this.visionThemeService.set(theme);
            this.themeChange.emit(theme);
            this.close();
        }
    }

    /** Whether a specific theme is currently active (for both modes). */
    isActive(key: VisionThemeType): boolean {
        return key === 'none'
            ? this.visionThemeService.activeThemes().length === 0
            : this.visionThemeService.isActive(key);
    }
}
