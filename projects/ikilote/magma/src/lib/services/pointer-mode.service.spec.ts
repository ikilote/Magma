import { describe, expect, it, beforeEach, afterEach } from 'vitest';

import { MagmaPointerModeService } from './pointer-mode.service';

describe('MagmaPointerModeService', () => {
    let service: MagmaPointerModeService;

    beforeEach(() => {
        service = new MagmaPointerModeService();
    });

    afterEach(() => {
        service.ngOnDestroy();
    });

    // ── Initial state ─────────────────────────────────────────────────────────

    it('should start in pointer mode (isKeyboard = false)', () => {
        expect(service.isKeyboard()).toBe(false);
    });

    // ── keydown → keyboard mode ───────────────────────────────────────────────

    it('should switch to keyboard mode on keydown', () => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        expect(service.isKeyboard()).toBe(true);
    });

    it('should switch to keyboard mode on any key', () => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
        expect(service.isKeyboard()).toBe(true);
    });

    it('should stay in keyboard mode on subsequent keydowns', () => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
        expect(service.isKeyboard()).toBe(true);
    });

    // ── mousemove → pointer mode ──────────────────────────────────────────────

    it('should switch back to pointer mode on mousemove', () => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        expect(service.isKeyboard()).toBe(true);

        document.dispatchEvent(new MouseEvent('mousemove'));
        expect(service.isKeyboard()).toBe(false);
    });

    it('should stay in pointer mode on subsequent mousemoves', () => {
        document.dispatchEvent(new MouseEvent('mousemove'));
        document.dispatchEvent(new MouseEvent('mousemove'));
        expect(service.isKeyboard()).toBe(false);
    });

    // ── alternating ───────────────────────────────────────────────────────────

    it('should toggle correctly across multiple switches', () => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        expect(service.isKeyboard()).toBe(true);

        document.dispatchEvent(new MouseEvent('mousemove'));
        expect(service.isKeyboard()).toBe(false);

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space' }));
        expect(service.isKeyboard()).toBe(true);

        document.dispatchEvent(new MouseEvent('mousemove'));
        expect(service.isKeyboard()).toBe(false);
    });

    // ── ngOnDestroy ───────────────────────────────────────────────────────────

    it('should stop reacting to keydown after destroy', () => {
        service.ngOnDestroy();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        expect(service.isKeyboard()).toBe(false);
    });

    it('should stop reacting to mousemove after destroy', () => {
        // Manually set to keyboard mode then destroy
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
        expect(service.isKeyboard()).toBe(true);

        service.ngOnDestroy();
        document.dispatchEvent(new MouseEvent('mousemove'));

        // Signal was not reset by mousemove after destroy
        expect(service.isKeyboard()).toBe(true);
    });

    it('should not throw when destroyed twice', () => {
        expect(() => {
            service.ngOnDestroy();
            service.ngOnDestroy();
        }).not.toThrow();
    });

    // ── capture phase ─────────────────────────────────────────────────────────

    it('should react even when events are stopped from bubbling', () => {
        // Listeners are registered in capture phase — stopPropagation on bubble
        // does not prevent capture listeners from firing.
        const stoppingEl = document.createElement('div');
        document.body.appendChild(stoppingEl);
        stoppingEl.addEventListener('keydown', e => e.stopPropagation());

        stoppingEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
        expect(service.isKeyboard()).toBe(true);

        stoppingEl.remove();
    });
});
