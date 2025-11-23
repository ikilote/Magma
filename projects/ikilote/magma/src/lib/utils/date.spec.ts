import { DurationTime, addDuration, toISODate } from './date';

describe('toISODate', () => {
    // Test for string input
    it('should return the string as-is if it is a non-empty string', () => {
        const testString = '2023-10-15';
        expect(toISODate(testString)).toEqual(testString);
    });

    it('should return undefined if the string is empty or whitespace', () => {
        expect(toISODate('')).toBeUndefined();
        expect(toISODate('   ')).toBeUndefined();
    });

    // Test for Date input
    it('should return the ISO string if the input is a Date object', () => {
        const testDate = new Date('2023-10-15T12:00:00Z');
        const expectedISOString = testDate.toISOString();
        expect(toISODate(testDate)).toEqual(expectedISOString);
    });

    // Test for undefined or null input
    it('should return undefined if the input is undefined or null', () => {
        expect(toISODate(undefined)).toBeUndefined();
        expect(toISODate(null!)).toBeUndefined();
    });

    // Test for newDate = true
    it('should return the current date in ISO format if newDate is true and input is invalid', () => {
        const result = toISODate(undefined, true);
        // Check if the result is a valid ISO string for the current date
        expect(result).toBeDefined();
        expect(new Date(result!).toISOString()).toEqual(result!);
    });

    it('should return the current date in ISO format if newDate is true and input is an empty string', () => {
        const result = toISODate('', true);
        // Check if the result is a valid ISO string for the current date
        expect(result).toBeDefined();
        expect(new Date(result!).toISOString()).toEqual(result!);
    });

    // Test for invalid inputs (e.g., numbers, objects)
    it('should return undefined for invalid inputs when newDate is false', () => {
        expect(toISODate(123 as any)).toBeUndefined();
        expect(toISODate({} as any)).toBeUndefined();
        expect(toISODate([] as any)).toBeUndefined();
    });

    it('should return the current date in ISO format for invalid inputs when newDate is true', () => {
        const invalidInputs = [123, {}, []];
        invalidInputs.forEach(input => {
            const result = toISODate(input as any, true);
            expect(result).toBeDefined();
            expect(new Date(result!).toISOString()).toEqual(result!);
        });
    });
});

describe('addDuration', () => {
    // Test adding time to a Date object
    it('should add milliseconds to a Date object', () => {
        const startDate = new Date('2023-01-01T00:00:00Z');
        const result = addDuration(500, DurationTime.MILLISECOND, startDate);
        const expectedDate = new Date('2023-01-01T00:00:00.500Z');
        expect(result).toEqual(expectedDate);
    });

    it('should add seconds to a Date object', () => {
        const startDate = new Date('2023-01-01T00:00:00Z');
        const result = addDuration(30, DurationTime.SECOND, startDate);
        const expectedDate = new Date('2023-01-01T00:00:30Z');
        expect(result).toEqual(expectedDate);
    });

    it('should add minutes to a Date object', () => {
        const startDate = new Date('2023-01-01T00:00:00Z');
        const result = addDuration(30, DurationTime.MINUTE, startDate);
        const expectedDate = new Date('2023-01-01T00:30:00Z');
        expect(result).toEqual(expectedDate);
    });

    it('should add hours to a Date object', () => {
        const startDate = new Date('2023-01-01T00:00:00Z');
        const result = addDuration(5, DurationTime.HOUR, startDate);
        const expectedDate = new Date('2023-01-01T05:00:00Z');
        expect(result).toEqual(expectedDate);
    });

    it('should add days to a Date object', () => {
        const startDate = new Date('2023-01-01T00:00:00Z');
        const result = addDuration(2, DurationTime.DAY, startDate);
        const expectedDate = new Date('2023-01-03T00:00:00Z');
        expect(result).toEqual(expectedDate);
    });

    it('should add weeks to a Date object', () => {
        const startDate = new Date('2023-01-01T00:00:00Z');
        const result = addDuration(1, DurationTime.WEEK, startDate);
        const expectedDate = new Date('2023-01-08T00:00:00Z');
        expect(result).toEqual(expectedDate);
    });

    // Test adding time to a timestamp
    it('should add milliseconds to a timestamp', () => {
        const startTimestamp = new Date('2023-01-01T00:00:00Z').getTime();
        const result = addDuration(500, DurationTime.MILLISECOND, startTimestamp);
        const expectedDate = new Date('2023-01-01T00:00:00.500Z');
        expect(result).toEqual(expectedDate);
    });

    it('should add seconds to a timestamp', () => {
        const startTimestamp = new Date('2023-01-01T00:00:00Z').getTime();
        const result = addDuration(30, DurationTime.SECOND, startTimestamp);
        const expectedDate = new Date('2023-01-01T00:00:30Z');
        expect(result).toEqual(expectedDate);
    });

    // Test default values
    describe('default values', () => {
        let originalDateNow: () => number;

        beforeEach(() => {
            // Save the original Date.now
            originalDateNow = Date.now.bind(Date);
        });

        afterEach(() => {
            // Restore the original Date.now
            Date.now = originalDateNow;
        });

        it('should use the current time if no start date is provided', () => {
            // Override Date.now to return a fixed timestamp
            const fixedNow = new Date('2023-01-01T00:00:00Z').getTime();
            Date.now = () => fixedNow;

            const result = addDuration(10, DurationTime.MINUTE);
            const expectedDate = new Date(fixedNow + 10 * DurationTime.MINUTE);
            expect(result).toEqual(expectedDate);
        });
    });

    it('should use MINUTE as the default duration', () => {
        const startDate = new Date('2023-01-01T00:00:00Z');
        const result = addDuration(30, undefined, startDate);
        const expectedDate = new Date('2023-01-01T00:30:00Z');
        expect(result).toEqual(expectedDate);
    });

    // Edge cases
    it('should handle negative numbers', () => {
        const startDate = new Date('2023-01-01T12:00:00Z');
        const result = addDuration(-1, DurationTime.HOUR, startDate);
        const expectedDate = new Date('2023-01-01T11:00:00Z');
        expect(result).toEqual(expectedDate);
    });

    it('should handle zero', () => {
        const startDate = new Date('2023-01-01T12:00:00Z');
        const result = addDuration(0, DurationTime.HOUR, startDate);
        expect(result).toEqual(startDate);
    });
});
