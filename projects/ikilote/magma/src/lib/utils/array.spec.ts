import { flattenedListItems, sortWithRule } from './array';

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

describe('sortWithRule', () => {
    describe('Basic functionality', () => {
        it('should not sort if array is empty or has only one element', () => {
            const emptyArray: any[] = [];
            const singleElementArray = [{ id: 1 }];

            sortWithRule(emptyArray, { attr: 'id', type: 'number' });
            sortWithRule(singleElementArray, { attr: 'id', type: 'number' });

            expect(emptyArray).toEqual([]);
            expect(singleElementArray).toEqual([{ id: 1 }]);
        });

        it('should handle undefined input', () => {
            sortWithRule(undefined, { attr: 'id', type: 'number' });
            // No error should be thrown
            expect(true).toBe(true);
        });
    });

    describe('String sorting', () => {
        it('should sort strings in ascending order', () => {
            const array = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];

            sortWithRule(array, { attr: 'name', type: 'string' });

            expect(array.map(item => item.name)).toEqual(['Alice', 'Bob', 'Charlie']);
        });

        it('should sort strings in descending order', () => {
            const array = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];

            sortWithRule(array, { attr: 'name', type: 'string' }, false);

            expect(array.map(item => item.name)).toEqual(['Charlie', 'Bob', 'Alice']);
        });

        it('should handle undefined values by placing them at the end', () => {
            const array = [{ name: 'Charlie' }, { name: undefined }, { name: 'Alice' }];

            sortWithRule(array, { attr: 'name', type: 'string' });

            // undefined should be at the end
            expect(array[0].name).toBe('Alice');
            expect(array[1].name).toBe('Charlie');
            expect(array[2].name).toBeUndefined();
        });

        it('should handle null values by placing them at the end', () => {
            const array = [{ name: 'Charlie' }, { name: null }, { name: 'Alice' }];

            sortWithRule(array, { attr: 'name', type: 'string' });

            // null should be at the end
            expect(array[0].name).toBe('Alice');
            expect(array[1].name).toBe('Charlie');
            expect(array[2].name).toBeNull();
        });

        it('should handle numeric values by converting them to string', () => {
            const array = [{ name: 'Charlie' }, { name: 123 }, { name: 'Alice' }];

            sortWithRule(array, { attr: 'name', type: 'string' });

            // 123 converted to "123" string should sort before "Alice"
            expect(array[0].name).toBe(123);
            expect(array[1].name).toBe('Alice');
            expect(array[2].name).toBe('Charlie');
        });

        it('should handle mixed null, undefined, and strings', () => {
            const array = [
                { name: 'Charlie' },
                { name: null },
                { name: 'Alice' },
                { name: undefined },
                { name: 'Bob' },
            ];

            sortWithRule(array, { attr: 'name', type: 'string' });

            // Valid strings sorted first, then null and undefined at the end
            expect(array[0].name).toBe('Alice');
            expect(array[1].name).toBe('Bob');
            expect(array[2].name).toBe('Charlie');
            expect(array[3].name).toBeNull();
            expect(array[4].name).toBeUndefined();
        });
    });

    describe('Number sorting', () => {
        it('should sort numbers in ascending order', () => {
            const array = [{ value: 3 }, { value: 1 }, { value: 2 }];

            sortWithRule(array, { attr: 'value', type: 'number' });

            expect(array.map(item => item.value)).toEqual([1, 2, 3]);
        });

        it('should sort numbers in descending order', () => {
            const array = [{ value: 3 }, { value: 1 }, { value: 2 }];

            sortWithRule(array, { attr: 'value', type: 'number' }, false);

            expect(array.map(item => item.value)).toEqual([3, 2, 1]);
        });

        it('should handle undefined values by placing them at the end (ascending)', () => {
            const array = [{ value: 3 }, { value: undefined }, { value: 1 }];

            sortWithRule(array, { attr: 'value', type: 'number' });

            // undefined should be at the end
            expect(array[0].value).toBe(1);
            expect(array[1].value).toBe(3);
            expect(array[2].value).toBeUndefined();
        });

        it('should handle undefined values by placing them at the end (descending)', () => {
            const array = [{ value: 3 }, { value: undefined }, { value: 1 }];

            sortWithRule(array, { attr: 'value', type: 'number' }, false);

            // undefined should still be at the end in descending order
            expect(array[0].value).toBe(3);
            expect(array[1].value).toBe(1);
            expect(array[2].value).toBeUndefined();
        });

        it('should handle null values by placing them at the end', () => {
            const array = [{ value: 3 }, { value: null }, { value: 1 }];

            sortWithRule(array, { attr: 'value', type: 'number' });

            // null should be at the end
            expect(array[0].value).toBe(1);
            expect(array[1].value).toBe(3);
            expect(array[2].value).toBeNull();
        });

        it('should handle mixed undefined, null, and valid numbers', () => {
            const array = [{ value: 5 }, { value: undefined }, { value: 2 }, { value: null }, { value: 8 }];

            sortWithRule(array, { attr: 'value', type: 'number' });

            // Valid numbers sorted first, then null and undefined at the end
            expect(array[0].value).toBe(2);
            expect(array[1].value).toBe(5);
            expect(array[2].value).toBe(8);
            expect(array[3].value).toBeUndefined();
            expect(array[4].value).toBeNull();
        });

        it('should handle missing properties by placing them at the end', () => {
            const array = [{ value: 3 }, { other: 'property' }, { value: 1 }];

            sortWithRule(array, { attr: 'value', type: 'number' });

            // Missing property should be at the end
            expect(array[0].value).toBe(1);
            expect(array[1].value).toBe(3);
            expect(array[2].other).toBe('property');
        });

        it('should handle NaN values by placing them at the end', () => {
            const array = [{ value: 3 }, { value: NaN }, { value: 1 }];

            sortWithRule(array, { attr: 'value', type: 'number' });

            // NaN should be at the end
            expect(array[0].value).toBe(1);
            expect(array[1].value).toBe(3);
            expect(array[2].value).toBeNaN();
        });

        it('should handle mixed NaN, null, undefined, and valid numbers', () => {
            const array = [
                { value: 5 },
                { value: NaN },
                { value: 2 },
                { value: null },
                { value: undefined },
                { value: 8 },
            ];

            sortWithRule(array, { attr: 'value', type: 'number' });

            // Valid numbers sorted first, then invalid values at the end
            expect(array[0].value).toBe(2);
            expect(array[1].value).toBe(5);
            expect(array[2].value).toBe(8);
            expect(array[3].value).toBeNaN();
            expect(array[4].value).toBeNull();
            expect(array[5].value).toBeUndefined();
        });
    });

    describe('Date sorting', () => {
        it('should sort dates in ascending order', () => {
            const array = [{ date: '2023-01-01' }, { date: '2022-01-01' }, { date: '2024-01-01' }];

            sortWithRule(array, { attr: 'date', type: 'date' });

            expect(array.map(item => item.date)).toEqual(['2022-01-01', '2023-01-01', '2024-01-01']);
        });

        it('should sort dates in descending order', () => {
            const array = [{ date: '2023-01-01' }, { date: '2022-01-01' }, { date: '2024-01-01' }];

            sortWithRule(array, { attr: 'date', type: 'date' }, false);

            expect(array.map(item => item.date)).toEqual(['2024-01-01', '2023-01-01', '2022-01-01']);
        });

        it('should handle null dates by treating them as epoch (0)', () => {
            const array = [{ date: '2023-01-01' }, { date: null }, { date: '2022-01-01' }];

            sortWithRule(array, { attr: 'date', type: 'date' });

            // null should be treated as 0 (epoch), which is before 2022
            expect(array[0].date).toBeNull();
            expect(array[1].date).toBe('2022-01-01');
            expect(array[2].date).toBe('2023-01-01');
        });

        it('should handle undefined dates by treating them as epoch (0)', () => {
            const array = [{ date: '2023-01-01' }, { date: undefined }, { date: '2022-01-01' }];

            sortWithRule(array, { attr: 'date', type: 'date' });

            // undefined should be treated as 0 (epoch), which is before 2022
            expect(array[0].date).toBeUndefined();
            expect(array[1].date).toBe('2022-01-01');
            expect(array[2].date).toBe('2023-01-01');
        });

        it('should handle invalid date strings by treating them as epoch (0)', () => {
            const array = [{ date: '2023-01-01' }, { date: 'invalid-date' }, { date: '2022-01-01' }];

            sortWithRule(array, { attr: 'date', type: 'date' });

            // invalid date should be treated as 0 (epoch), which is before 2022
            expect(array[0].date).toBe('invalid-date');
            expect(array[1].date).toBe('2022-01-01');
            expect(array[2].date).toBe('2023-01-01');
        });

        it('should handle mixed valid and invalid dates', () => {
            const array = [
                { date: '2023-01-01' },
                { date: null },
                { date: '2022-01-01' },
                { date: 'invalid' },
                { date: undefined },
                { date: '2024-01-01' },
            ];

            sortWithRule(array, { attr: 'date', type: 'date' });

            // All invalid dates (null, undefined, 'invalid') should be at the beginning (treated as 0)
            expect(array[0].date).toBeNull();
            expect(array[1].date).toBe('invalid');
            expect(array[2].date).toBeUndefined();
            expect(array[3].date).toBe('2022-01-01');
            expect(array[4].date).toBe('2023-01-01');
            expect(array[5].date).toBe('2024-01-01');
        });

        it('should handle empty string dates by treating them as epoch (0)', () => {
            const array = [{ date: '2023-01-01' }, { date: '' }, { date: '2022-01-01' }];

            sortWithRule(array, { attr: 'date', type: 'date' });

            // empty string should be treated as 0 (epoch), which is before 2022
            expect(array[0].date).toBe('');
            expect(array[1].date).toBe('2022-01-01');
            expect(array[2].date).toBe('2023-01-01');
        });
    });

    describe('Translate sorting', () => {
        it('should sort translated values', () => {
            const translateMock = vi.fn().mockImplementation((str: string) => str);
            const array = [{ value: 'b' }, { value: 'a' }, { value: 'c' }];

            sortWithRule(array, {
                attr: 'value',
                type: 'translate',
                translateId: 'test.%value%',
                default: '',
                translate: translateMock,
            });

            expect(translateMock).toHaveBeenCalled();
            expect(array.map(item => item.value)).toEqual(['a', 'b', 'c']);
        });

        it('should sort translated values (default value)', () => {
            const translateMock = vi.fn().mockImplementation((str: string) => str);
            const array = [{ value: 'b' }, { value: 'a' }, { value: 'c' }];

            sortWithRule(array, {
                attr: 'test',
                type: 'translate',
                translateId: 'test.%value%',
                default: 'a',
                translate: translateMock,
            });

            expect(translateMock).toHaveBeenCalled();
            expect(array.map(item => item.value)).toEqual(['b', 'a', 'c']);
        });
    });

    describe('Multiple rules', () => {
        it('should sort by multiple rules', () => {
            const array = [
                { category: 'A', value: 2 },
                { category: 'A', value: 1 },
                { category: 'B', value: 2 },
                { category: 'B', value: 1 },
            ];

            sortWithRule(array, [
                { attr: 'category', type: 'string' },
                { attr: 'value', type: 'number' },
            ]);

            expect(array).toEqual([
                { category: 'A', value: 1 },
                { category: 'A', value: 2 },
                { category: 'B', value: 1 },
                { category: 'B', value: 2 },
            ]);
        });
    });

    describe('Nested properties', () => {
        it('should sort by nested properties', () => {
            const array = [{ user: { name: 'Charlie' } }, { user: { name: 'Alice' } }, { user: { name: 'Bob' } }];

            sortWithRule(array, { attr: 'user.name', type: 'string' });

            expect(array.map(item => item.user.name)).toEqual(['Alice', 'Bob', 'Charlie']);
        });
    });

    describe('String rule format', () => {
        it('should parse string rule format', () => {
            const array = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];

            sortWithRule(array, 'name:string:asc');

            expect(array.map(item => item.name)).toEqual(['Alice', 'Bob', 'Charlie']);
        });

        it('should parse multiple string rules', () => {
            const array = [
                { category: 'B', value: 2 },
                { category: 'A', value: 2 },
                { category: 'B', value: 1 },
                { category: 'A', value: 1 },
            ];

            sortWithRule(array, 'category:string:asc,value:number:asc');

            expect(array).toEqual([
                { category: 'A', value: 1 },
                { category: 'A', value: 2 },
                { category: 'B', value: 1 },
                { category: 'B', value: 2 },
            ]);
        });

        it('should parse string rule format (without type)', () => {
            const array = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];

            sortWithRule(array, 'name:asc');

            expect(array.map(item => item.name)).toEqual(['Alice', 'Bob', 'Charlie']);
        });

        it('should parse string rule format  (without order)', () => {
            const array = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];

            sortWithRule(array, 'name:string');

            expect(array.map(item => item.name)).toEqual(['Alice', 'Bob', 'Charlie']);
        });

        it('should parse string rule format with desc order', () => {
            // 'init' in the parsed rule is stored but sortWithRule uses currentRuleOrder param for direction
            // string format 'name:string:desc' parses init='desc' but still sorts asc by default
            const array = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];

            sortWithRule(array, 'name:string:desc');

            expect(array.map(item => item.name)).toEqual(['Alice', 'Bob', 'Charlie']);
        });
    });

    describe('Edge cases', () => {
        it('should handle undefined values', () => {
            const array = [{ name: undefined }, { name: 'Alice' }, { name: 'Bob' }];

            sortWithRule(array, { attr: 'name', type: 'string' });

            // Undefined values should be sorted to the end
            expect(array[0].name).toBe('Alice');
            expect(array[1].name).toBe('Bob');
            expect(array[2].name).toBeUndefined();
        });

        it('should handle missing properties', () => {
            const array = [{ name: 'Alice' }, { other: 'property' }, { name: 'Bob' }];

            sortWithRule(array, { attr: 'name', type: 'string' });

            // Items without the property should be sorted to the end
            expect(array[0].name).toBe('Alice');
            expect(array[1].name).toBe('Bob');
            expect(array[2].other).toBe('property');
        });

        it('should handle empty list rule', () => {
            const array = [{ name: 'Alice' }, { other: 'property' }, { name: 'Bob' }];

            sortWithRule(array, []);

            // no change
            expect(array[0].name).toBe('Alice');
            expect(array[1].other).toBe('property');
            expect(array[2].name).toBe('Bob');
        });

        it('should handle unknown type by using string comparison', () => {
            const array = [{ value: 'Charlie' }, { value: 'Alice' }, { value: 'Bob' }];

            sortWithRule(array, { attr: 'value', type: 'unknown' as any });

            // Should fall back to string comparison
            expect(array.map(item => item.value)).toEqual(['Alice', 'Bob', 'Charlie']);
        });

        it('should handle unknown type with numeric values', () => {
            const array = [{ value: 30 }, { value: 5 }, { value: 100 }];

            sortWithRule(array, { attr: 'value', type: 'unknown' as any });

            // Should use string comparison (lexicographic), not numeric
            expect(array.map(item => item.value)).toEqual([100, 30, 5]);
        });

        it('should handle unknown type with null/undefined values', () => {
            const array = [{ value: 'Charlie' }, { value: null }, { value: 'Alice' }, { value: undefined }];

            sortWithRule(array, { attr: 'value', type: 'unknown' as any });

            // Should convert to strings: null -> "null", undefined -> "undefined"
            expect(array[0].value).toBe('Alice');
            expect(array[1].value).toBe('Charlie');
            expect(array[2].value).toBeNull();
            expect(array[3].value).toBeUndefined();
        });
    });
});
