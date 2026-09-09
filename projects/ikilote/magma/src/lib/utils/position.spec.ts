import { ConnectedPosition } from '@angular/cdk/overlay';
import { describe, expect, it } from 'vitest';

import { MagmaConnectedPosition, MagmaOverlayPosition, overlayPositionKey, toConnectedPositions } from './position';

// ── toConnectedPositions ──────────────────────────────────────────────────────

describe('toConnectedPositions', () => {
    it('should return an array of exactly 2 positions', () => {
        const result = toConnectedPositions('bottom-start');
        expect(result).toHaveLength(2);
    });

    // Primary position correctness for every value

    const cases: Array<[MagmaConnectedPosition, ConnectedPosition, ConnectedPosition]> = [
        [
            'top',
            { originX: 'center', originY: 'top',    overlayX: 'center', overlayY: 'bottom' },
            { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top'    },
        ],
        [
            'top-start',
            { originX: 'start', originY: 'top',    overlayX: 'start', overlayY: 'bottom' },
            { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top'    },
        ],
        [
            'top-end',
            { originX: 'end', originY: 'top',    overlayX: 'end', overlayY: 'bottom' },
            { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top'    },
        ],
        [
            'bottom',
            { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' },
            { originX: 'center', originY: 'top',    overlayX: 'center', overlayY: 'bottom' },
        ],
        [
            'bottom-start',
            { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
            { originX: 'start', originY: 'top',    overlayX: 'start', overlayY: 'bottom' },
        ],
        [
            'bottom-end',
            { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
            { originX: 'end', originY: 'top',    overlayX: 'end', overlayY: 'bottom' },
        ],
        [
            'left',
            { originX: 'start', originY: 'center', overlayX: 'end',   overlayY: 'center' },
            { originX: 'end',   originY: 'center', overlayX: 'start', overlayY: 'center' },
        ],
        [
            'left-start',
            { originX: 'start', originY: 'top',    overlayX: 'end',   overlayY: 'top'    },
            { originX: 'end',   originY: 'top',    overlayX: 'start', overlayY: 'top'    },
        ],
        [
            'left-end',
            { originX: 'start', originY: 'bottom', overlayX: 'end',   overlayY: 'bottom' },
            { originX: 'end',   originY: 'bottom', overlayX: 'start', overlayY: 'bottom' },
        ],
        [
            'right',
            { originX: 'end',   originY: 'center', overlayX: 'start', overlayY: 'center' },
            { originX: 'start', originY: 'center', overlayX: 'end',   overlayY: 'center' },
        ],
        [
            'right-start',
            { originX: 'end',   originY: 'top',    overlayX: 'start', overlayY: 'top'    },
            { originX: 'start', originY: 'top',    overlayX: 'end',   overlayY: 'top'    },
        ],
        [
            'right-end',
            { originX: 'end',   originY: 'bottom', overlayX: 'start', overlayY: 'bottom' },
            { originX: 'start', originY: 'bottom', overlayX: 'end',   overlayY: 'bottom' },
        ],
    ];

    it.each(cases)('%s — primary position', (pos, primary) => {
        expect(toConnectedPositions(pos)[0]).toEqual(primary);
    });

    it.each(cases)('%s — fallback is opposite axis', (pos, _primary, fallback) => {
        expect(toConnectedPositions(pos)[1]).toEqual(fallback);
    });

    describe('fallback symmetry', () => {
        it('top ↔ bottom', () => {
            expect(toConnectedPositions('top')[1]).toEqual(toConnectedPositions('bottom')[0]);
            expect(toConnectedPositions('bottom')[1]).toEqual(toConnectedPositions('top')[0]);
        });

        it('top-start ↔ bottom-start', () => {
            expect(toConnectedPositions('top-start')[1]).toEqual(toConnectedPositions('bottom-start')[0]);
        });

        it('top-end ↔ bottom-end', () => {
            expect(toConnectedPositions('top-end')[1]).toEqual(toConnectedPositions('bottom-end')[0]);
        });

        it('left ↔ right', () => {
            expect(toConnectedPositions('left')[1]).toEqual(toConnectedPositions('right')[0]);
            expect(toConnectedPositions('right')[1]).toEqual(toConnectedPositions('left')[0]);
        });

        it('left-start ↔ right-start', () => {
            expect(toConnectedPositions('left-start')[1]).toEqual(toConnectedPositions('right-start')[0]);
        });

        it('left-end ↔ right-end', () => {
            expect(toConnectedPositions('left-end')[1]).toEqual(toConnectedPositions('right-end')[0]);
        });
    });
});

// ── overlayPositionKey ────────────────────────────────────────────────────────

describe('overlayPositionKey', () => {
    it('should produce identical keys for equal positions', () => {
        const pos: MagmaOverlayPosition = { bottom: '10px', right: '10px' };
        expect(overlayPositionKey(pos)).toBe(overlayPositionKey(pos));
    });

    it('should produce the same key regardless of property insertion order', () => {
        const a: MagmaOverlayPosition = { bottom: '10px', right: '10px' };
        const b: MagmaOverlayPosition = { right: '10px', bottom: '10px' };
        expect(overlayPositionKey(a)).toBe(overlayPositionKey(b));
    });

    it('should produce different keys for different positions', () => {
        const a: MagmaOverlayPosition = { bottom: '10px', right: '10px' };
        const b: MagmaOverlayPosition = { top: '10px', right: '10px' };
        expect(overlayPositionKey(a)).not.toBe(overlayPositionKey(b));
    });

    it('should ignore undefined properties', () => {
        const a: MagmaOverlayPosition = { bottom: '10px' };
        const b: MagmaOverlayPosition = { bottom: '10px', top: undefined };
        expect(overlayPositionKey(a)).toBe(overlayPositionKey(b));
    });

    it('should produce a stable JSON string', () => {
        const pos: MagmaOverlayPosition = { bottom: '10px', right: '10px' };
        expect(overlayPositionKey(pos)).toBe('{"bottom":"10px","right":"10px"}');
    });

    it('should handle an empty position object', () => {
        expect(overlayPositionKey({})).toBe('{}');
    });

    it('should handle all fields set', () => {
        const pos: MagmaOverlayPosition = {
            top: '0px',
            bottom: '0px',
            left: '0px',
            right: '0px',
            centerHorizontally: '',
            centerVertically: '',
        };
        // Key must be deterministic regardless of call order
        expect(overlayPositionKey(pos)).toBe(overlayPositionKey({ ...pos }));
    });

    it('should differentiate by value, not just by key', () => {
        const a: MagmaOverlayPosition = { bottom: '10px' };
        const b: MagmaOverlayPosition = { bottom: '20px' };
        expect(overlayPositionKey(a)).not.toBe(overlayPositionKey(b));
    });

    it('should handle centerHorizontally with empty string value', () => {
        const pos: MagmaOverlayPosition = { top: '10px', centerHorizontally: '' };
        expect(overlayPositionKey(pos)).toBe('{"centerHorizontally":"","top":"10px"}');
    });
});
