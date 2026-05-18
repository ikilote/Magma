import { notANumber, randomNumber } from './number';

describe('randomNumber', () => {
    // Save the original Math.random function
    let originalMathRandom: () => number;

    beforeEach(() => {
        // Save the original Math.random
        originalMathRandom = Math.random;
    });

    afterEach(() => {
        // Restore the original Math.random
        Math.random = originalMathRandom;
    });

    // Test the default size (9 digits)
    it('should return a 9-digit string by default', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.123456789);

        const result = randomNumber();
        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
        expect(result.length).toBe(9);
        expect(result).toMatch(/^\d{9}$/);
        expect(result).toBe('123456789');
    });

    // Test with a custom size
    it('should return a string of the specified length', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.12345);

        const size = 5;
        const result = randomNumber(size);
        expect(result.length).toBe(size);
        expect(result).toMatch(new RegExp(`^\\d{${size}}$`));
        expect(result).toBe('12345');
    });

    // Test with size = 1
    it('should return a 1-digit string when size is 1', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.56);

        const result = randomNumber(1);
        expect(result.length).toBe(1);
        expect(result).toMatch(/^\d{1}$/);
        expect(result).toBe('5');
    });

    // Test with size = 0
    it('should return a 1-digit string when size is 1', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.56);

        const result = randomNumber(0);
        expect(result.length).toBe(1);
        expect(result).toMatch(/^\d{1}$/);
        expect(result).toBe('5');
    });

    // Test with a large size
    it('should return a string of the specified large length', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.1234567890123456);

        const size = 16;
        const result = randomNumber(size);
        expect(result.length).toBe(size);
        expect(result).toMatch(new RegExp(`^\\d{${size}}$`));
        expect(result).toBe('1234567890123456');
    });

    // Test with a size > 16
    it('should return a string of the specified large length', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.1234567890123456);

        const size = 50;
        const result = randomNumber(size);
        expect(result.length).toBe(16);
        expect(result).toMatch(new RegExp(`^\\d{${16}}$`));
        expect(result).toBe('1234567890123456');
    });

    // Test with Math.random returning 0
    it('should return a string padded with zeros when Math.random returns 0', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);

        const size = 5;
        const result = randomNumber(size);
        expect(result.length).toBe(size);
        expect(result).toBe('00000');
    });

    // Test with Math.random returning a value very close to 1
    it('should return a string without leading zeros when Math.random returns a value close to 1', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.9999999999);

        const size = 5;
        const result = randomNumber(size);
        expect(result.length).toBe(size);
        expect(result).toMatch(/^\d{5}$/);
        expect(result).toBe('99999');
    });

    // Test with Math.random to return a small value
    it('should pad the result with leading zeros when necessary', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.000000001);

        const size = 5;
        const result = randomNumber(size);
        expect(result.length).toBe(size);
        expect(result).toBe('00000');
    });
});

describe('notANumber', () => {
    it('should return true for null', () => {
        expect(notANumber(null)).toBe(true);
    });

    it('should return true for undefined', () => {
        expect(notANumber(undefined)).toBe(true);
    });

    it('should return true for NaN', () => {
        expect(notANumber(NaN)).toBe(true);
    });

    it('should return false for valid numbers', () => {
        expect(notANumber(0)).toBe(false);
        expect(notANumber(1)).toBe(false);
        expect(notANumber(-1)).toBe(false);
        expect(notANumber(3.14)).toBe(false);
        expect(notANumber(Infinity)).toBe(false);
        expect(notANumber(-Infinity)).toBe(false);
    });

    it('should return true for numeric strings that result in NaN', () => {
        expect(notANumber('abc')).toBe(true);
        expect(notANumber('not a number')).toBe(true);
    });

    it('should return false for numeric strings', () => {
        expect(notANumber('123')).toBe(false);
        expect(notANumber('3.14')).toBe(false);
    });

    it('should return true for objects', () => {
        expect(notANumber({})).toBe(true);
        expect(notANumber({ value: 123 })).toBe(true);
    });

    it('should return true for arrays', () => {
        expect(notANumber([])).toBe(false); // Empty array converts to 0
        expect(notANumber([1])).toBe(false); // Single element array converts to that number
        expect(notANumber([1, 2])).toBe(true); // Multi-element array converts to NaN
    });

    it('should return false for boolean values', () => {
        expect(notANumber(true)).toBe(false); // true converts to 1
        expect(notANumber(false)).toBe(false); // false converts to 0
    });

    it('should return false for empty string', () => {
        expect(notANumber('')).toBe(false); // Empty string converts to 0
    });
});
