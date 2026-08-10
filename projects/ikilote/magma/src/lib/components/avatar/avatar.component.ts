import { Component, effect, input, signal } from '@angular/core';

export type MagmaAvatarSize = 'small' | 'medium' | 'large' | 'extra';

@Component({
    selector: 'mg-avatar',
    templateUrl: './avatar.component.html',
    styleUrl: './avatar.component.scss',
    host: {
        '[class]': "'avatar-' + size()",
        '[style.--color]': 'colorCode()',
    },
})
export class MagmaAvatar {
    /** Image URL for the avatar */
    readonly src = input<string | undefined>();

    /** Fallback initials (1-2 chars) displayed when no image is available */
    readonly initials = input<string>('');

    /** Size of the avatar */
    readonly size = input<MagmaAvatarSize>('medium');

    /** Alt text for the image */
    readonly alt = input<string>('');

    /** Internal signal to track image load failure */
    readonly imageFailed = signal(false);

    protected colorCode = signal(0);

    /** Called when the image fails to load */
    onImageError(): void {
        this.imageFailed.set(true);
    }

    constructor() {
        effect(() => {
            this.colorCode.set(
                (this.initials() || this.alt())
                    .split('')
                    .map(e => e.charCodeAt(0))
                    .reduce((e, f) => e * 7 + f, 0) % 360,
            );
        });
    }
}
