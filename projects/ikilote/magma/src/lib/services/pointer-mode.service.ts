import { Injectable, OnDestroy, signal } from '@angular/core';

/**
 * Tracks whether the user is currently navigating by keyboard or pointer.
 *
 * - Any `keydown` event switches to keyboard mode.
 * - The first `mousemove` after that switches back to pointer mode.
 *
 * Provided at root so all menu levels share the same state.
 */
@Injectable({ providedIn: 'root' })
export class MagmaPointerModeService implements OnDestroy {
    /** True while the user is navigating by keyboard (no mouse movement since last keydown). */
    readonly isKeyboard = signal(false);

    private readonly _onKeydown = () => this.isKeyboard.set(true);
    private readonly _onMouseMove = () => this.isKeyboard.set(false);

    constructor() {
        document.addEventListener('keydown', this._onKeydown, { capture: true });
        document.addEventListener('mousemove', this._onMouseMove, { capture: true });
    }

    ngOnDestroy(): void {
        document.removeEventListener('keydown', this._onKeydown, true);
        document.removeEventListener('mousemove', this._onMouseMove, true);
    }
}
