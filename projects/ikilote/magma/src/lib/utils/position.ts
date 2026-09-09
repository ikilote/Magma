import { ConnectedPosition } from '@angular/cdk/overlay';

/**
 * Position of a connected overlay relative to its anchor element.
 * Maps to CDK `ConnectedPosition[]` with automatic fallbacks.
 */
export type MagmaConnectedPosition =
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end';

/**
 * Position for a global overlay (not connected to an anchor element).
 * Mirrors the CDK `GlobalPositionStrategy` API.
 *
 * @example
 * { bottom: '10px', right: '10px' }
 * { top: '10px', centerHorizontally: '' }
 */
export interface MagmaOverlayPosition {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    centerHorizontally?: string;
    centerVertically?: string;
}

/** Primary CDK position for each `MagmaConnectedPosition` value. */
const POSITION_MAP: Record<MagmaConnectedPosition, ConnectedPosition> = {
    'top':          { originX: 'center', originY: 'top',    overlayX: 'center', overlayY: 'bottom' },
    'top-start':    { originX: 'start',  originY: 'top',    overlayX: 'start',  overlayY: 'bottom' },
    'top-end':      { originX: 'end',    originY: 'top',    overlayX: 'end',    overlayY: 'bottom' },
    'bottom':       { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top'    },
    'bottom-start': { originX: 'start',  originY: 'bottom', overlayX: 'start',  overlayY: 'top'    },
    'bottom-end':   { originX: 'end',    originY: 'bottom', overlayX: 'end',    overlayY: 'top'    },
    'left':         { originX: 'start',  originY: 'center', overlayX: 'end',    overlayY: 'center' },
    'left-start':   { originX: 'start',  originY: 'top',    overlayX: 'end',    overlayY: 'top'    },
    'left-end':     { originX: 'start',  originY: 'bottom', overlayX: 'end',    overlayY: 'bottom' },
    'right':        { originX: 'end',    originY: 'center', overlayX: 'start',  overlayY: 'center' },
    'right-start':  { originX: 'end',    originY: 'top',    overlayX: 'start',  overlayY: 'top'    },
    'right-end':    { originX: 'end',    originY: 'bottom', overlayX: 'start',  overlayY: 'bottom' },
};

/** Opposite axis fallbacks — if primary doesn't fit, try the other side. */
const FALLBACK_MAP: Record<MagmaConnectedPosition, MagmaConnectedPosition> = {
    'top':          'bottom',
    'top-start':    'bottom-start',
    'top-end':      'bottom-end',
    'bottom':       'top',
    'bottom-start': 'top-start',
    'bottom-end':   'top-end',
    'left':         'right',
    'left-start':   'right-start',
    'left-end':     'right-end',
    'right':        'left',
    'right-start':  'left-start',
    'right-end':    'left-end',
};

/**
 * Convert a `MagmaConnectedPosition` to CDK `ConnectedPosition[]`.
 * The returned array contains the primary position followed by its opposite-axis fallback.
 */
export function toConnectedPositions(position: MagmaConnectedPosition): ConnectedPosition[] {
    return [POSITION_MAP[position], POSITION_MAP[FALLBACK_MAP[position]]];
}

/**
 * Produce a stable string key for a `MagmaOverlayPosition`.
 * Two positions that resolve to the same key will share the same overlay.
 */
export function overlayPositionKey(pos: MagmaOverlayPosition): string {
    return JSON.stringify(
        Object.fromEntries(
            Object.entries(pos)
                .filter(([, v]) => v !== undefined)
                .sort(([a], [b]) => a.localeCompare(b)),
        ),
    );
}
