import { normalizeString, unescapedString } from './text';

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

describe('unescapedString', () => {
    // Classic escape sequences
    it('should transform \\n into a newline', () => {
        expect(unescapedString('Line 1\\nLine 2')).toBe('Line 1\nLine 2');
    });

    it('should transform \\t into a tab', () => {
        expect(unescapedString('Col1\\tCol2')).toBe('Col1\tCol2');
    });

    it('should transform \\r into a carriage return', () => {
        expect(unescapedString('Return\\r')).toBe('Return\r');
    });

    it('should transform \\" into a double quote', () => {
        expect(unescapedString('This is a \\"quote\\"')).toBe('This is a "quote"');
    });

    it("should transform \\' into a single quote", () => {
        expect(unescapedString("This is a \\'quote\\'")).toBe("This is a 'quote'");
    });

    it('should transform \\` into a backtick', () => {
        expect(unescapedString('Backtick: \\`')).toBe('Backtick: `');
    });

    // Unicode sequences
    it('should transform \\u00A9 into ©', () => {
        expect(unescapedString('Copyright \\u00A9')).toBe('Copyright ©');
    });

    it('should transform \\u20AC into €', () => {
        expect(unescapedString('Price: \\u20AC10')).toBe('Price: €10');
    });

    // Latin-1 sequences
    it('should transform \\xA9 into ©', () => {
        expect(unescapedString('Copyright \\xA9')).toBe('Copyright ©');
    });

    // Multiple sequences
    it('should transform multiple sequences', () => {
        expect(unescapedString('Line\\n\\t\\u00A9\\xA9')).toBe('Line\n\t©©');
    });

    // Edge cases
    it('should return the string unchanged if no sequences are found', () => {
        expect(unescapedString('No sequences here')).toBe('No sequences here');
    });

    it('should ignore invalid sequences (e.g., \\z)', () => {
        expect(unescapedString('Invalid sequence: \\z')).toBe('Invalid sequence: \\z');
    });

    it('should ignore invalid Unicode/Latin-1 sequences (e.g., \\uZZZZ)', () => {
        expect(unescapedString('Invalid Unicode sequence: \\uZZZZ')).toBe('Invalid Unicode sequence: \\uZZZZ');
    });
});
