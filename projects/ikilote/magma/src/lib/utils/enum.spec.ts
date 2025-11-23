// enumUtils.spec.ts
import { enumToKeyList, enumToKeyValue, enumToMap, enumToObject, enumToValueList } from './enum';

// Replace with the correct path

// Define a test enum
enum TestEnum {
    KEY1 = 'value1',
    KEY2 = 2,
    KEY3 = 'value3',
    //  42 = 'numericKey', // This should be filtered out
}

// Define a numeric enum for additional testing
enum NumericEnum {
    KEY1 = 1,
    KEY2 = 2,
    KEY3 = 3,
}

describe('enumToValueList', () => {
    it('should return an array of enum values', () => {
        const result = enumToValueList(TestEnum);
        expect(result).toEqual(['value1', 2, 'value3']);
    });

    it('should filter out numeric keys', () => {
        const result = enumToValueList(TestEnum);
        expect(result).not.toContain('numericKey');
    });

    it('should handle numeric enums', () => {
        const result = enumToValueList(NumericEnum);
        expect(result).toEqual([1, 2, 3]);
    });

    it('should return an empty array for an empty object', () => {
        const result = enumToValueList({});
        expect(result).toEqual([]);
    });
});

describe('enumToKeyList', () => {
    it('should return an array of enum keys', () => {
        const result = enumToKeyList(TestEnum);
        expect(result).toEqual(['KEY1', 'KEY2', 'KEY3']);
    });

    it('should filter out numeric keys', () => {
        const result = enumToKeyList(TestEnum);
        expect(result).not.toContain('42');
    });

    it('should handle numeric enums', () => {
        const result = enumToKeyList(NumericEnum);
        expect(result).toEqual(['KEY1', 'KEY2', 'KEY3']);
    });

    it('should return an empty array for an empty object', () => {
        const result = enumToKeyList({});
        expect(result).toEqual([]);
    });
});

describe('enumToKeyValue', () => {
    it('should return an array of { key, value } objects', () => {
        const result = enumToKeyValue(TestEnum);
        expect(result).toEqual([
            { key: 'KEY1', value: 'value1' },
            { key: 'KEY2', value: 2 },
            { key: 'KEY3', value: 'value3' },
        ]);
    });

    it('should filter out numeric keys', () => {
        const result = enumToKeyValue(TestEnum);
        expect(result).not.toContain(jasmine.objectContaining({ key: '42' }));
    });

    it('should handle numeric enums', () => {
        const result = enumToKeyValue(NumericEnum);
        expect(result).toEqual([
            { key: 'KEY1', value: 1 },
            { key: 'KEY2', value: 2 },
            { key: 'KEY3', value: 3 },
        ]);
    });

    it('should return an empty array for an empty object', () => {
        const result = enumToKeyValue({});
        expect(result).toEqual([]);
    });
});

describe('enumToObject', () => {
    it('should return an object with enum keys and values', () => {
        const result = enumToObject(TestEnum);
        expect(result).toEqual({
            KEY1: 'value1',
            KEY2: 2,
            KEY3: 'value3',
        });
    });

    // it('should filter out numeric keys', () => {
    //     const result = enumToObject(TestEnum);
    //     expect(result).not.toHaveProperty('42');
    // });

    it('should handle numeric enums', () => {
        const result = enumToObject(NumericEnum);
        expect(result).toEqual({
            KEY1: 1,
            KEY2: 2,
            KEY3: 3,
        });
    });

    it('should return an empty object for an empty object', () => {
        const result = enumToObject({});
        expect(result).toEqual({});
    });
});

describe('enumToMap', () => {
    it('should return a Map with enum keys and values', () => {
        const result = enumToMap(TestEnum);
        expect(result.size).toBe(3);
        expect(result.get('KEY1')).toBe('value1');
        expect(result.get('KEY2')).toBe(2);
        expect(result.get('KEY3')).toBe('value3');
    });

    it('should filter out numeric keys', () => {
        const result = enumToMap(TestEnum);
        expect(result.has('42')).toBeFalse();
    });

    it('should handle numeric enums', () => {
        const result = enumToMap(NumericEnum);
        expect(result.size).toBe(3);
        expect(result.get('KEY1')).toBe(1);
        expect(result.get('KEY2')).toBe(2);
        expect(result.get('KEY3')).toBe(3);
    });

    it('should return an empty Map for an empty object', () => {
        const result = enumToMap({});
        expect(result.size).toBe(0);
    });
});
