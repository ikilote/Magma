import { isEmpty } from './other';

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
