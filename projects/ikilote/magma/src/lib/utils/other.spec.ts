import { isEmpty, regexpSlash } from './other';

describe('isEmpty', () => {
    // Null or undefined values
    it('should return true for null', () => {
        expect(isEmpty(null)).toBeTrue();
    });

    it('should return true for undefined', () => {
        expect(isEmpty(undefined)).toBeTrue();
    });

    // Strings
    it('should return true for an empty string', () => {
        expect(isEmpty('')).toBeTrue();
    });

    it('should return false for a non-empty string', () => {
        expect(isEmpty('test')).toBeFalse();
        expect(isEmpty(' ')).toBeFalse(); // A string with a space is not empty
    });

    // Arrays
    it('should return true for an empty array', () => {
        expect(isEmpty([])).toBeTrue();
    });

    it('should return false for a non-empty array', () => {
        expect(isEmpty([1, 2, 3])).toBeFalse();
        expect(isEmpty([''])).toBeFalse(); // An array with an empty string is not empty
    });

    // Objects
    it('should return true for an empty object', () => {
        expect(isEmpty({})).toBeTrue();
    });

    it('should return false for a non-empty object', () => {
        expect(isEmpty({ key: 'value' })).toBeFalse();
        expect(isEmpty({ key: '' })).toBeFalse(); // An object with a key and an empty value is not empty
    });

    // Numbers
    it('should return false for a number', () => {
        expect(isEmpty(0)).toBeFalse();
        expect(isEmpty(123)).toBeFalse();
        expect(isEmpty(-1)).toBeFalse();
    });

    // Booleans
    it('should return false for a boolean', () => {
        expect(isEmpty(true)).toBeFalse();
        expect(isEmpty(false)).toBeFalse();
    });

    // Functions
    it('should return false for a function', () => {
        expect(isEmpty(() => {})).toBeFalse();
    });

    // Dates
    it('should return false for a date', () => {
        expect(isEmpty(new Date())).toBeFalse();
    });

    // Edge cases
    it('should return false for NaN', () => {
        expect(isEmpty(NaN)).toBeFalse();
    });

    it('should return false for Infinity', () => {
        expect(isEmpty(Infinity)).toBeFalse();
        expect(isEmpty(-Infinity)).toBeFalse();
    });

    // Map and Set
    it('should return true for an empty Map', () => {
        expect(isEmpty(new Map())).toBeTrue();
    });

    it('should return false for a non-empty Map', () => {
        const map = new Map();
        map.set('key', 'value');
        expect(isEmpty(map)).toBeFalse();
    });

    it('should return true for an empty Set', () => {
        expect(isEmpty(new Set())).toBeTrue();
    });

    it('should return false for a non-empty Set', () => {
        const set = new Set();
        set.add('value');
        expect(isEmpty(set)).toBeFalse();
    });
});

describe('regexpSlash', () => {
    // String with slashes
    it('should convert a string with slashes to a RegExp', () => {
        const result = regexpSlash('/test/');
        expect(result instanceof RegExp).toBeTrue();
        expect((result as RegExp).source).toBe('test');
        expect((result as RegExp).flags).toBe('g');
    });

    it('should convert a string with slashes and regex pattern to a RegExp', () => {
        const result = regexpSlash('/te.st/');
        expect(result instanceof RegExp).toBeTrue();
        expect((result as RegExp).source).toBe('te.st');
        expect((result as RegExp).flags).toBe('g');
    });

    it('should convert a string with slashes and complex regex pattern to a RegExp', () => {
        const result = regexpSlash('/[a-z]+/i'); // Note: The 'i' flag will be replaced by 'g'
        expect(result instanceof RegExp).toBeTrue();
        expect((result as RegExp).source).toBe('[a-z]+');
        expect((result as RegExp).flags).toBe('g'); // The function always adds 'g' flag
    });

    // String without slashes
    it('should return the string as-is if it does not start and end with slashes', () => {
        const result = regexpSlash('test');
        expect(result).toBe('test');
    });

    it('should return the string as-is if it only starts with a slash', () => {
        const result = regexpSlash('/test');
        expect(result).toBe('/test');
    });

    it('should return the string as-is if it only ends with a slash', () => {
        const result = regexpSlash('test/');
        expect(result).toBe('test/');
    });

    // RegExp input
    it('should return the RegExp as-is', () => {
        const regex = /test/g;
        const result = regexpSlash(regex);
        expect(result).toBe(regex);
    });

    it('should return a RegExp with different flags as-is', () => {
        const regex = /test/gi;
        const result = regexpSlash(regex);
        expect(result).toBe(regex);
    });

    // Edge cases
    it('should handle an empty string with slashes', () => {
        const result = regexpSlash('//');
        expect(result).toBe('//');
    });

    it('should handle a string with only slashes', () => {
        const result = regexpSlash('///');
        expect(result instanceof RegExp).toBeTrue();
        expect((result as RegExp).source).toBe('\\/');
        expect((result as RegExp).flags).toBe('g');
    });

    it('should handle undefined input', () => {
        // @ts-ignore: Testing invalid input
        const result = regexpSlash(undefined);
        expect(result).toBeUndefined();
    });

    it('should handle null input', () => {
        // @ts-ignore: Testing invalid input
        const result = regexpSlash(null);
        expect(result).toBeNull();
    });

    // Complex patterns
    it('should handle complex regex patterns between slashes', () => {
        const result = regexpSlash('/^\\d{3}-\\d{2}-\\d{4}$/');
        expect(result instanceof RegExp).toBeTrue();
        expect((result as RegExp).source).toBe('^\\d{3}-\\d{2}-\\d{4}$');
        expect((result as RegExp).flags).toBe('g');
    });

    it('should handle escaped slashes in the pattern', () => {
        const result = regexpSlash('/test\\/slash/');
        expect(result instanceof RegExp).toBeTrue();
        expect((result as RegExp).source).toBe('test\\/slash');
        expect((result as RegExp).flags).toBe('g');
    });
});
