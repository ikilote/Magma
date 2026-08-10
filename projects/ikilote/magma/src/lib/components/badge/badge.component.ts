import { Component, Directive, input } from '@angular/core';

export type MagmaBadgeTheme = 'neutral' | 'primary' | 'success' | 'warning' | 'alert' | 'info';
export type MagmaBadgeSize = 'small' | 'large';
export type MagmaBadgeLabelLuminosity = 'light' | 'dark';

@Directive({ selector: 'mg-badge-label' })
export class MagmaBadgeLabel {}

@Component({
    selector: 'mg-badge',
    templateUrl: './badge.component.html',
    styleUrl: './badge.component.scss',
    host: {
        '[class]': "'badge-' + theme() + ' badge-' + size()+ ' badge-label-' + luminosity()",
        '[style.--badge-background]': 'color() || undefined',
    },
})
export class MagmaBadge {
    /** Color theme */
    readonly theme = input<MagmaBadgeTheme>('neutral');

    /** Size of the badge */
    readonly size = input<MagmaBadgeSize>('large');

    /** Label luminosity of the badge */
    readonly luminosity = input<MagmaBadgeLabelLuminosity>('dark');

    /** Custom color (CSS value). Overrides theme when set. */
    readonly color = input<string | undefined>();
}
