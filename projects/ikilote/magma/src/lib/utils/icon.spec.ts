import { describe, expect, it } from 'vitest';

import { isIconUrl } from './icon';

describe('isIconUrl', () => {
    // ── Returns true ──────────────────────────────────────────────────────────

    describe('returns true', () => {
        describe('absolute URLs (http / https)', () => {
            it('http://', () => expect(isIconUrl('http://example.com/icon.png')).toBe(true));
            it('https://', () => expect(isIconUrl('https://example.com/icon.svg')).toBe(true));
            it('HTTP:// uppercase', () => expect(isIconUrl('HTTP://example.com/icon.png')).toBe(true));
        });

        describe('any path containing a slash', () => {
            it('root-relative /path/to/icon.png', () => expect(isIconUrl('/path/to/icon.png')).toBe(true));
            it('protocol-relative //cdn.example.com/icon.svg', () => expect(isIconUrl('//cdn.example.com/icon.svg')).toBe(true));
            it('relative path with directory assets/icon.png', () => expect(isIconUrl('assets/icon.png')).toBe(true));
            it('./relative/icon.svg', () => expect(isIconUrl('./relative/icon.svg')).toBe(true));
            it('../up/icon.png', () => expect(isIconUrl('../up/icon.png')).toBe(true));
        });

        describe('image file extensions (no slash)', () => {
            it('.png', () => expect(isIconUrl('icon.png')).toBe(true));
            it('.jpg', () => expect(isIconUrl('icon.jpg')).toBe(true));
            it('.jpeg', () => expect(isIconUrl('icon.jpeg')).toBe(true));
            it('.gif', () => expect(isIconUrl('icon.gif')).toBe(true));
            it('.svg', () => expect(isIconUrl('icon.svg')).toBe(true));
            it('.webp', () => expect(isIconUrl('icon.webp')).toBe(true));
            it('.avif', () => expect(isIconUrl('icon.avif')).toBe(true));
            it('.ico', () => expect(isIconUrl('icon.ico')).toBe(true));
            it('uppercase .PNG', () => expect(isIconUrl('icon.PNG')).toBe(true));
            it('uppercase .SVG', () => expect(isIconUrl('icon.SVG')).toBe(true));
            it('with query string icon.png?v=1', () => expect(isIconUrl('icon.png?v=1')).toBe(true));
            it('with query string icon.svg?color=red', () => expect(isIconUrl('icon.svg?color=red')).toBe(true));
        });
    });

    // ── Returns false ─────────────────────────────────────────────────────────

    describe('returns false', () => {
        describe('plain text / emoji / ligature (no slash, no image extension)', () => {
            it('emoji 📄', () => expect(isIconUrl('📄')).toBe(false));
            it('single character ★', () => expect(isIconUrl('★')).toBe(false));
            it('ligature name "home"', () => expect(isIconUrl('home')).toBe(false));
            it('ligature name "close"', () => expect(isIconUrl('close')).toBe(false));
            it('CSS class "fa fa-home"', () => expect(isIconUrl('fa fa-home')).toBe(false));
            it('empty string', () => expect(isIconUrl('')).toBe(false));
        });

        describe('file names with non-image extensions', () => {
            it('icon.ts', () => expect(isIconUrl('icon.ts')).toBe(false));
            it('icon.html', () => expect(isIconUrl('icon.html')).toBe(false));
            it('icon.pdf', () => expect(isIconUrl('icon.pdf')).toBe(false));
        });
    });
});
