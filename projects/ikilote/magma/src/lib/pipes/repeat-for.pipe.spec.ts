import { RepeatForPipe } from './repeat-for.pipe';

describe('RepeatForPipe', () => {
    let pipe: RepeatForPipe;

    beforeEach(() => {
        pipe = new RepeatForPipe();
    });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    // Test with default behavior (counter = false)
    it('should create an array of the specified length when counter is false', () => {
        const result = pipe.transform(5);
        expect(result).toBeDefined();
        expect(result.length).toBe(5);
        // @ts-ignore - Testing undefined input
        expect(result).toEqual([undefined, undefined, undefined, undefined, undefined]);
    });

    it('should create an empty array when input is 0', () => {
        const result = pipe.transform(0);
        expect(result.length).toBe(0);
        expect(result).toEqual([]);
    });

    // Test with counter = true
    it('should create an array of numbers from 1 to n when counter is true', () => {
        const result = pipe.transform(5, true);
        expect(result.length).toBe(5);
        expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should create an array with a single element [1] when input is 1 and counter is true', () => {
        const result = pipe.transform(1, true);
        expect(result.length).toBe(1);
        expect(result).toEqual([1]);
    });

    // Test edge cases
    it('should handle negative numbers by returning an empty array', () => {
        const result = pipe.transform(-5);
        expect(result.length).toBe(0);
        expect(result).toEqual([]);

        const resultWithCounter = pipe.transform(-5, true);
        expect(resultWithCounter.length).toBe(0);
        expect(resultWithCounter).toEqual([]);
    });

    it('should handle non-integer numbers by truncating them', () => {
        const result = pipe.transform(5.7);
        expect(result.length).toBe(5);

        const resultWithCounter = pipe.transform(5.7, true);
        expect(resultWithCounter.length).toBe(5);
        expect(resultWithCounter).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle very large numbers', () => {
        const largeNumber = 1000000;
        const result = pipe.transform(largeNumber);
        expect(result.length).toBe(largeNumber);

        // Don't test the full array for large numbers to avoid performance issues
        expect(result[0]).toBeUndefined();
        expect(result[largeNumber - 1]).toBeUndefined();
    });

    // Test with non-number inputs

    it('should handle string inputs that can be converted to numbers', () => {
        // @ts-ignore - Testing string input
        const result = pipe.transform('5');
        expect(result.length).toBe(5);

        // @ts-ignore - Testing string input with counter
        const resultWithCounter = pipe.transform('5', true);
        // @ts-ignore - Testing string input with counter
        expect(resultWithCounter).toEqual([1, 2, 3, 4, 5]);
    });

    it('should return an empty array for non-numeric string inputs', () => {
        // @ts-ignore - Testing invalid string input
        const result = pipe.transform('abc');

        expect(result.length).toBe(0);
        expect(result).toEqual([]);

        // @ts-ignore - Testing invalid string input with counter
        const resultWithCounter = pipe.transform('abc', true);
        expect(resultWithCounter.length).toBe(0);
        expect(resultWithCounter).toEqual([]);
    });

    it('should return an empty array for null input', () => {
        // @ts-ignore - Testing null input
        const result = pipe.transform(null);
        expect(result.length).toBe(0);
        // @ts-ignore - Testing invalid string input
        expect(result).toEqual([]);

        // @ts-ignore - Testing null input with counter
        const resultWithCounter = pipe.transform(null, true);
        expect(resultWithCounter.length).toBe(0);
        expect(resultWithCounter).toEqual([]);
    });

    it('should return an empty array for undefined input', () => {
        // @ts-ignore - Testing undefined input
        const result = pipe.transform(undefined);
        expect(result.length).toBe(0);
        // @ts-ignore - Testing invalid string input
        expect(result).toEqual([]);

        // @ts-ignore - Testing undefined input with counter
        const resultWithCounter = pipe.transform(undefined, true);
        expect(resultWithCounter.length).toBe(0);
        // @ts-ignore - Testing invalid string input
        expect(resultWithCounter).toEqual([]);
    });
});
