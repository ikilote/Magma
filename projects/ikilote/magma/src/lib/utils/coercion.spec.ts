import { arrayAttribute, numberAttributeOrUndefined } from './coercion';

describe('numberAttributeOrUndefined', () => {
    // Test cases for valid numbers (as strings or numbers)
    it('should return a number if the input is a numeric string', () => {
        expect(numberAttributeOrUndefined('123')).toEqual(123);
        expect(numberAttributeOrUndefined('12.34')).toEqual(12.34);
        expect(numberAttributeOrUndefined('-5')).toEqual(-5);
    });

    it('should return a number if the input is already a number', () => {
        expect(numberAttributeOrUndefined(123)).toEqual(123);
        expect(numberAttributeOrUndefined(12.34)).toEqual(12.34);
        expect(numberAttributeOrUndefined(-5)).toEqual(-5);
    });

    // Test cases for invalid numbers (non-numeric strings, objects, etc.)
    it('should return undefined if the input is a non-numeric string', () => {
        expect(numberAttributeOrUndefined('abc')).toBeUndefined();
        expect(numberAttributeOrUndefined('123abc')).toBeUndefined();
        expect(numberAttributeOrUndefined('')).toBeUndefined();
    });

    it('should return undefined if the input is null or undefined', () => {
        expect(numberAttributeOrUndefined(null)).toBeUndefined();
        expect(numberAttributeOrUndefined(undefined)).toBeUndefined();
    });

    it('should return undefined if the input is an object or array', () => {
        expect(numberAttributeOrUndefined({})).toBeUndefined();
        expect(numberAttributeOrUndefined([])).toBeUndefined();
        expect(numberAttributeOrUndefined({ key: 'value' })).toBeUndefined();
    });

    it('should return undefined if the input is a boolean', () => {
        expect(numberAttributeOrUndefined(true)).toBeUndefined();
        expect(numberAttributeOrUndefined(false)).toBeUndefined();
    });

    // Edge cases
    it('should return undefined for NaN or Infinity', () => {
        expect(numberAttributeOrUndefined(NaN)).toBeUndefined();
        expect(numberAttributeOrUndefined(Infinity)).toBeUndefined();
        expect(numberAttributeOrUndefined(-Infinity)).toBeUndefined();
    });
});

describe('arrayAttribute', () => {
    it('should return the same array reference when given a valid array', () => {
        const arr = ['a', 'b', 'c'];
        expect(arrayAttribute(arr)).toBe(arr);
    });

    it('should return an empty array when given an empty array', () => {
        expect(arrayAttribute([])).toEqual([]);
    });

    it('should return an empty array when given null', () => {
        expect(arrayAttribute(null)).toEqual([]);
    });

    it('should return an empty array when given undefined', () => {
        expect(arrayAttribute(undefined)).toEqual([]);
    });

    it('should return an empty array when given a non-array value at runtime', () => {
        expect(arrayAttribute('foo' as unknown as string[])).toEqual([]);
        expect(arrayAttribute(42 as unknown as number[])).toEqual([]);
        expect(arrayAttribute({} as unknown as object[])).toEqual([]);
    });
});
