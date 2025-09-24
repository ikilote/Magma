import { objectsAreSame } from './object';

describe('objectsAreSame', () => {
    // Basic equality
    it('should return true for identical objects', () => {
        const objA = { a: 1, b: 2 };
        const objB = { a: 1, b: 2 };
        expect(objectsAreSame(objA, objB)).toBeTrue();
    });

    it('should return false for different objects', () => {
        const objA = { a: 1, b: 2 };
        const objB = { a: 1, b: 3 };
        expect(objectsAreSame(objA, objB)).toBeFalse();
    });

    // Undefined or null objects
    it('should return true if both objects are undefined', () => {
        expect(objectsAreSame(undefined, undefined)).toBeTrue();
    });

    it('should return false if one object is undefined', () => {
        const objA = { a: 1 };
        expect(objectsAreSame(objA, undefined)).toBeFalse();
        expect(objectsAreSame(undefined, objA)).toBeFalse();
    });

    it('should return false if one object is null', () => {
        const objA = { a: 1 };
        expect(objectsAreSame(objA, null as any)).toBeFalse();
        expect(objectsAreSame(null as any, objA)).toBeFalse();
    });

    // Nested objects
    it('should return true for identical nested objects', () => {
        const objA = { a: { b: 1, c: 2 } };
        const objB = { a: { b: 1, c: 2 } };
        expect(objectsAreSame(objA, objB)).toBeTrue();
    });

    it('should return false for different nested objects', () => {
        const objA = { a: { b: 1, c: 2 } };
        const objB = { a: { b: 1, c: 3 } };
        expect(objectsAreSame(objA, objB)).toBeFalse();
    });

    it('should return false for second is not a array', () => {
        expect(objectsAreSame({ a: [] }, { a: {} })).toBeFalse();
    });

    // Arrays
    it('should return true for identical arrays', () => {
        const objA = { a: [1, 2, 3] };
        const objB = { a: [1, 2, 3] };
        expect(objectsAreSame(objA, objB)).toBeTrue();
    });

    it('should return true for arrays with the same elements in different order', () => {
        const objA = { a: [1, 2, 3] };
        const objB = { a: [3, 2, 1] };
        expect(objectsAreSame(objA, objB)).toBeTrue();
    });

    it('should return false for arrays with different elements', () => {
        const objA = { a: [1, 2, 3] };
        const objB = { a: [1, 2, 4] };
        expect(objectsAreSame(objA, objB)).toBeFalse();
    });

    it('should return false for arrays with different lengths', () => {
        const objA = { a: [1, 2, 3] };
        const objB = { a: [1, 2] };
        expect(objectsAreSame(objA, objB)).toBeFalse();
    });

    // Ignored keys
    it('should ignore specified keys', () => {
        const objA = { a: 1, b: 2, ignoreMe: 3 };
        const objB = { a: 1, b: 2, ignoreMe: 4 };
        expect(objectsAreSame(objA, objB, ['ignoreMe'])).toBeTrue();
    });

    it('should ignore multiple specified keys', () => {
        const objA = { a: 1, b: 2, ignoreMe: 3, ignoreMeToo: 4 };
        const objB = { a: 1, b: 2, ignoreMe: 5, ignoreMeToo: 6 };
        expect(objectsAreSame(objA, objB, ['ignoreMe', 'ignoreMeToo'])).toBeTrue();
    });

    // Undefined values
    it('should ignore undefined values in objects', () => {
        const objA = { a: 1, b: undefined };
        const objB = { a: 1 };
        expect(objectsAreSame(objA, objB)).toBeTrue();
    });

    // Different key sets
    it('should return false if objects have different keys', () => {
        const objA = { a: 1, b: 2 };
        const objB = { a: 1, c: 2 };
        expect(objectsAreSame(objA, objB)).toBeFalse();
    });

    // Edge cases
    it('should return true for empty objects', () => {
        expect(objectsAreSame({}, {})).toBeTrue();
    });

    it('should return false for empty object and non-empty object', () => {
        expect(objectsAreSame({}, { a: 1 })).toBeFalse();
    });

    // Complex nested objects with arrays
    it('should return true for complex identical nested objects with arrays', () => {
        const objA = {
            a: { b: [1, 2, 3], c: { d: 4 } },
            e: [{ f: 5 }, { g: 6 }],
        };
        const objB = {
            a: { b: [3, 2, 1], c: { d: 4 } },
            e: [{ g: 6 }, { f: 5 }],
        };
        expect(objectsAreSame(objA, objB)).toBeTrue();
    });

    it('should return false for complex different nested objects with arrays', () => {
        const objA = {
            a: { b: [1, 2, 3], c: { d: 4 } },
            e: [{ f: 5 }, { g: 6 }],
        };
        const objB = {
            a: { b: [1, 2, 3], c: { d: 5 } }, // Different value for d
            e: [{ g: 6 }, { f: 5 }],
        };
        expect(objectsAreSame(objA, objB)).toBeFalse();
    });
});
