import { ConnectedPosition } from '@angular/cdk/overlay';

import { describe, expect, it } from 'vitest';

import {
    MagmaConnectedPosition,
    MagmaOverlayPosition,
    overlayPositionClasses,
    overlayPositionKey,
    toConnectedPositions,
} from './position';

// ── toConnectedPositions ──────────────────────────────────────────────────────

describe('toConnectedPositions', () => {
    it('should return an array of exactly 2 positions', () => {
        const result = toConnectedPositions('bottom-start');
        expect(result).toHaveLength(2);
    });

    // Primary position correctness for every value

    // prettier-ignore
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

// ── overlayPositionClasses ────────────────────────────────────────────────────

describe('overlayPositionClasses', () => {
    // ── Vertical axis ─────────────────────────────────────────────────────────

    it('should return pos-top when top is set', () => {
        expect(overlayPositionClasses({ top: '10px', right: '10px' })).toContain('pos-top');
    });

    it('should return pos-edge-top when top is 0', () => {
        const classes = overlayPositionClasses({ top: '0', right: '10px' });
        expect(classes).toContain('pos-top');
        expect(classes).toContain('pos-edge-top');
    });

    it('should return pos-edge-top when top is 0px', () => {
        const classes = overlayPositionClasses({ top: '0px', right: '10px' });
        expect(classes).toContain('pos-edge-top');
    });

    it('should return pos-bottom when bottom is set', () => {
        expect(overlayPositionClasses({ bottom: '10px', right: '10px' })).toContain('pos-bottom');
    });

    it('should return pos-edge-bottom when bottom is 0', () => {
        const classes = overlayPositionClasses({ bottom: '0', right: '10px' });
        expect(classes).toContain('pos-bottom');
        expect(classes).toContain('pos-edge-bottom');
    });

    it('should return pos-edge-bottom when bottom is 0px', () => {
        expect(overlayPositionClasses({ bottom: '0px', right: '10px' })).toContain('pos-edge-bottom');
    });

    it('should return pos-center-v when centerVertically is set (no top/bottom)', () => {
        expect(overlayPositionClasses({ centerVertically: '' })).toContain('pos-center-v');
    });

    it('should return pos-bottom as default when no vertical anchor is set', () => {
        expect(overlayPositionClasses({})).toContain('pos-bottom');
    });

    it('should not return pos-center-v when top is also set', () => {
        const classes = overlayPositionClasses({ top: '10px', centerVertically: '' });
        expect(classes).toContain('pos-top');
        expect(classes).not.toContain('pos-center-v');
    });

    // ── Horizontal axis ───────────────────────────────────────────────────────

    it('should return pos-left when left is set', () => {
        expect(overlayPositionClasses({ bottom: '10px', left: '10px' })).toContain('pos-left');
    });

    it('should return pos-edge-left when left is 0', () => {
        const classes = overlayPositionClasses({ bottom: '10px', left: '0' });
        expect(classes).toContain('pos-left');
        expect(classes).toContain('pos-edge-left');
    });

    it('should return pos-edge-left when left is 0px', () => {
        expect(overlayPositionClasses({ bottom: '10px', left: '0px' })).toContain('pos-edge-left');
    });

    it('should return pos-right when right is set', () => {
        expect(overlayPositionClasses({ bottom: '10px', right: '10px' })).toContain('pos-right');
    });

    it('should return pos-edge-right when right is 0', () => {
        const classes = overlayPositionClasses({ bottom: '10px', right: '0' });
        expect(classes).toContain('pos-right');
        expect(classes).toContain('pos-edge-right');
    });

    it('should return pos-edge-right when right is 0px', () => {
        expect(overlayPositionClasses({ bottom: '10px', right: '0px' })).toContain('pos-edge-right');
    });

    it('should return pos-center-h when centerHorizontally is set (no left/right)', () => {
        expect(overlayPositionClasses({ top: '10px', centerHorizontally: '' })).toContain('pos-center-h');
    });

    it('should return pos-right as default when no horizontal anchor is set', () => {
        expect(overlayPositionClasses({})).toContain('pos-right');
    });

    it('should not return pos-center-h when left is also set', () => {
        const classes = overlayPositionClasses({ bottom: '10px', left: '10px', centerHorizontally: '' });
        expect(classes).toContain('pos-left');
        expect(classes).not.toContain('pos-center-h');
    });

    // ── Combinations ─────────────────────────────────────────────────────────

    it('should return both vertical and horizontal classes', () => {
        const classes = overlayPositionClasses({ top: '10px', right: '10px' });
        expect(classes).toContain('pos-top');
        expect(classes).toContain('pos-right');
        expect(classes).toHaveLength(2);
    });

    it('should return 4 classes for top:0 + left:0 (edge on both)', () => {
        const classes = overlayPositionClasses({ top: '0', left: '0' });
        expect(classes).toEqual(expect.arrayContaining(['pos-top', 'pos-edge-top', 'pos-left', 'pos-edge-left']));
        expect(classes).toHaveLength(4);
    });

    it('should return pos-center-v and pos-center-h when both are set', () => {
        const classes = overlayPositionClasses({ centerVertically: '', centerHorizontally: '' });
        expect(classes).toContain('pos-center-v');
        expect(classes).toContain('pos-center-h');
    });

    it('should not include pos-edge-* when value is not 0 or 0px', () => {
        const classes = overlayPositionClasses({ bottom: '10px', right: '10px' });
        expect(classes.some(c => c.startsWith('pos-edge'))).toBe(false);
    });
});
