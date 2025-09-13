import { normalizeString } from './text';

describe('normalizeString', () => {
    // Basic normalization
    it('should convert string to lowercase', () => {
        expect(normalizeString('HELLO')).toBe('hello');
        expect(normalizeString('Hello')).toBe('hello');
        expect(normalizeString('hElLo')).toBe('hello');
    });

    // Accented characters
    it('should remove diacritics from accented characters', () => {
        expect(normalizeString('café')).toBe('cafe');
        expect(normalizeString('naïve')).toBe('naive');
        expect(normalizeString('hôtel')).toBe('hotel');
        expect(normalizeString('Mëtàl')).toBe('metal');
        expect(normalizeString('über')).toBe('uber');
    });

    // Combined normalization
    it('should convert to lowercase and remove diacritics', () => {
        expect(normalizeString('ÉÉéÈèÊêËë')).toBe('eeeeeeeee');
        expect(normalizeString('ÇçÀàÂâ')).toBe('ccaaaa');
        expect(normalizeString('ØøÅåÆæ')).toBe('øøaaææ');
    });

    // Empty string
    it('should handle empty string', () => {
        expect(normalizeString('')).toBe('');
    });

    // String with spaces
    it('should preserve spaces', () => {
        expect(normalizeString('hello world')).toBe('hello world');
        expect(normalizeString('  extra   spaces  ')).toBe('  extra   spaces  ');
    });

    // String with numbers and special characters
    it('should preserve numbers and special characters', () => {
        expect(normalizeString('123')).toBe('123');
        expect(normalizeString('!@#$%^&*()')).toBe('!@#$%&*()');
        expect(normalizeString('Café123!')).toBe('cafe123!');
    });

    // Complex strings with mixed characters
    it('should handle complex strings with mixed characters', () => {
        expect(normalizeString('Thïs ïs à cömplëx Strïng! 123')).toBe('this is a complex string! 123');
        expect(normalizeString('Mîxéd Cäsé Ànd Sýmböls: @#$%')).toBe('mixed case and symbols: @#$%');
    });

    // Unicode characters
    it('should handle Unicode characters', () => {
        // Characters that don't have diacritics should remain unchanged
        expect(normalizeString('日本語')).toBe('日本語');
        expect(normalizeString('中文')).toBe('中文');
        expect(normalizeString('한글')).toBe('한글');
    });

    // Combined Unicode and accented characters
    it('should handle combined Unicode and accented characters', () => {
        expect(normalizeString('Café 日本語')).toBe('cafe 日本語');
        expect(normalizeString('Hôtel 中文')).toBe('hotel 中文');
    });

    // Edge cases
    it('should handle strings with only diacritics', () => {
        expect(normalizeString('ÉèÊë')).toBe('eeee');
    });

    it('should handle strings with only special diacritic characters', () => {
        expect(normalizeString('́̀̂̃̄')).toBe(''); // These are combining diacritical marks
    });
});
