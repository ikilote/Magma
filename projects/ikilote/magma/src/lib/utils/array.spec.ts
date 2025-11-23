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
            expect(true).toBeTrue();
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
    });

    describe('Translate sorting', () => {
        it('should sort translated values', () => {
            const translateMock = jasmine.createSpy().and.callFake((str: string) => str);
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
            const translateMock = jasmine.createSpy().and.callFake((str: string) => str);
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
    });
});
