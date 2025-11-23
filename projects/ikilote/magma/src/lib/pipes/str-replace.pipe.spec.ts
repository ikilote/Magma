// str-replace.pipe.spec.ts
import { StrReplacePipe } from './str-replace.pipe';

describe('StrReplacePipe', () => {
    let pipe: StrReplacePipe;

    beforeEach(() => {
        pipe = new StrReplacePipe();
    });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    // Test with string source
    it('should replace all occurrences of a string', () => {
        const result = pipe.transform('Test---Test', '-', '');
        expect(result).toBe('TestTest');
    });

    it('should replace all occurrences of a string with another string', () => {
        const result = pipe.transform('Test---Test', '-', '_');
        expect(result).toBe('Test___Test');
    });

    // Test with regex source
    it('should replace all matches of a regex pattern', () => {
        const result = pipe.transform('Test---Test', /-+/g, '-');
        expect(result).toBe('Test-Test');
    });

    it('should replace all matches of a regex pattern with a string', () => {
        const result = pipe.transform('Test---Test', /-+/g, '_');
        expect(result).toBe('Test_Test');
    });

    // Test with regex string pattern
    it('should replace all matches of a regex string pattern', () => {
        const result = pipe.transform('Test---Test', '/-+/', '-');
        expect(result).toBe('Test-Test');
    });

    it('should handle regex string patterns with flags', () => {
        const result = pipe.transform('Test---Test', '/-+/', '_');
        expect(result).toBe('Test_Test');
    });

    // Test with empty string
    it('should handle empty string input', () => {
        const result = pipe.transform('', '-', '');
        expect(result).toBe('');
    });

    // Test with null/undefined input
    it('should return null for null input', () => {
        // @ts-ignore - Testing null input
        const result = pipe.transform(null, '-', '');
        expect(result).toBeNull();
    });

    it('should return undefined for undefined input', () => {
        // @ts-ignore - Testing undefined input
        const result = pipe.transform(undefined, '-', '');
        expect(result).toBeUndefined();
    });

    // Test with non-string input
    it('should return non-string input as-is', () => {
        // @ts-ignore - Testing undefined input
        const result = pipe.transform(123, '-', '');
        // @ts-ignore - Testing undefined input
        expect(result).toBe(123);

        // @ts-ignore - Testing undefined input
        const result2 = pipe.transform(true, '-', '');
        // @ts-ignore - Testing undefined input
        expect(result2).toBe(true);

        // @ts-ignore - Testing undefined input
        const result3 = pipe.transform({}, '-', '');
        // @ts-ignore - Testing undefined input
        expect(result3).toEqual({});
    });

    // Test with special regex patterns
    it('should handle special regex patterns', () => {
        const result = pipe.transform('abc123def456', '/\\d+/g', 'NUM');
        expect(result).toBe('abcNUMdefNUM');
    });

    it('should handle global regex patterns', () => {
        const result = pipe.transform('a.b.c.d', '/\\./g', '-');
        expect(result).toBe('a-b-c-d');
    });

    // Test with complex replacements
    it('should handle complex replacements', () => {
        const result = pipe.transform('The quick brown fox', '/\\w+/g', 'WORD');
        expect(result).toBe('WORD WORD WORD WORD');
    });

    // Test with empty target
    it('should handle empty target string', () => {
        const result = pipe.transform('a-b-c-d', '-', '');
        expect(result).toBe('abcd');
    });

    // Test with target containing special characters
    it('should handle target with special characters', () => {
        const result = pipe.transform('simple text', ' ', '&nbsp;');
        expect(result).toBe('simple&nbsp;text');
    });

    // Test edge cases
    it('should handle source that is not found in the string', () => {
        const result = pipe.transform('test string', 'xyz', 'replacement');
        expect(result).toBe('test string');
    });

    it('should handle empty source', () => {
        const result = pipe.transform('test string', '', 'replacement');
        expect(result).toBe(
            'replacementtreplacementereplacementsreplacementtreplacement ' +
                'replacementsreplacementtreplacementrreplacementireplacementnreplacementgreplacement',
        );
    });
});
