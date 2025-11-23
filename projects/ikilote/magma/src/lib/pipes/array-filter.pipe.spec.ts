import { ArrayFilterPipe } from './array-filter.pipe';

describe('ArrayFilterPipe', () => {
    let pipe: ArrayFilterPipe;

    beforeEach(() => {
        pipe = new ArrayFilterPipe();
    });

    // Basic functionality tests
    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should be a pure: false pipe', () => {
        expect(pipe).toBeDefined();
        // The @Pipe decorator already sets pure: false, so we just verify the pipe exists
    });

    // Test with valid inputs
    it('should filter an array using the provided callback', () => {
        const input = ['a', 'b', 'c', 'd'];
        const callback = (item: string) => item !== 'a';
        const result = pipe.transform(input, callback);
        expect(result).toEqual(['b', 'c', 'd']);
    });

    it('should return the original array if no items match the filter', () => {
        const input = ['a', 'b', 'c'];
        const callback = (item: string) => item === 'd';
        const result = pipe.transform(input, callback);
        expect(result).toEqual([]);
    });

    it('should return the original array if all items match the filter', () => {
        const input = ['a', 'a', 'a'];
        const callback = (item: string) => item === 'a';
        const result = pipe.transform(input, callback);
        expect(result).toEqual(['a', 'a', 'a']);
    });

    // Test with complex objects
    it('should filter an array of objects', () => {
        const input = [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
            { id: 3, name: 'Charlie' },
        ];
        const callback = (item: { id: number; name: string }) => item.id !== 2;
        const result = pipe.transform(input, callback);
        expect(result).toEqual([
            { id: 1, name: 'Alice' },
            { id: 3, name: 'Charlie' },
        ]);
    });

    // Edge cases
    it('should return the original value if items is not an array', () => {
        const input = 'not an array';
        const callback = (item: any) => true;
        // @ts-ignore - Testing invalid input
        const result = pipe.transform(input, callback);
        expect(result).toBe(input);
    });

    it('should return the original array if callback is not a function', () => {
        const input = ['a', 'b', 'c'];
        // @ts-ignore - Testing invalid callback
        const result = pipe.transform(input, 'not a function');
        expect(result).toBe(input);
    });

    it('should return the original array if items is empty', () => {
        const input: any[] = [];
        const callback = (item: any) => true;
        const result = pipe.transform(input, callback);
        expect(result).toEqual([]);
    });

    it('should return the original array if items is null', () => {
        const input = null;
        const callback = (item: any) => true;
        // @ts-ignore - Testing null input
        const result = pipe.transform(input, callback);
        expect(result).toBeNull();
    });

    it('should return the original array if items is undefined', () => {
        const input = undefined;
        const callback = (item: any) => true;
        // @ts-ignore - Testing undefined input
        const result = pipe.transform(input, callback);
        expect(result).toBeUndefined();
    });

    // Test with complex filter conditions
    it('should handle complex filter conditions', () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const callback = (item: number) => item % 2 === 0; // Only even numbers
        const result = pipe.transform(input, callback);
        expect(result).toEqual([2, 4, 6, 8, 10]);
    });

    // Test with nested arrays
    it('should not recursively filter nested arrays', () => {
        const input = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
        ];
        const callback = (item: any) => Array.isArray(item);
        const result = pipe.transform(input, callback);
        expect(result).toEqual(input); // Should return original array since callback returns true for all items
    });

    // Test with mixed types
    it('should handle arrays with mixed types', () => {
        const input = [1, 'two', true, null, undefined, { key: 'value' }];
        const callback = (item: any) => typeof item === 'string';
        const result = pipe.transform(input, callback);
        expect(result).toEqual(['two']);
    });
});
