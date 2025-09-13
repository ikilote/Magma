import { flattenedListItems } from './array';

describe('flattenedListItems', () => {
    it('should return an empty array if the input is an empty string', () => {
        const result = flattenedListItems('');
        expect(result).toEqual([]);
    });

    it('should split a string into an array using the default pattern', () => {
        const result = flattenedListItems('a, b, c');
        expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should flatten and split a simple array of strings', () => {
        const result = flattenedListItems(['a, b', 'c']);
        expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should flatten and split a nested array of strings', () => {
        const result = flattenedListItems([['a, b'], ['c', ['d,e']]]);
        expect(result).toEqual(['a', 'b', 'c', 'd', 'e']);
    });

    it('should ignore non-string values in the array', () => {
        const result = flattenedListItems([123, null, 'a, b', undefined, 'c'] as any);
        expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should use a custom pattern to split strings', () => {
        const result = flattenedListItems('a; b; c', /\s*;\s*/);
        expect(result).toEqual(['a', 'b', 'c']);
    });
});
