import { DurationTime, addDuration, getWeek, isISODate, toISODate } from './date';

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

describe('getWeek', () => {
    /**
     * ISO 8601 Rules Summary:
     * - Week 1 is the week with the first Thursday of the year.
     * - Weeks always start on Monday.
     * - Dec 31st can be Week 1 of the next year.
     * - Jan 1st can be Week 52/53 of the previous year.
     */

    describe('Reported Issue (2012-2013 Transition)', () => {
        it('should return Week 1 for 2012-12-31 (Monday)', () => {
            // Dec 31, 2012 is a Monday.
            // The following Thursday is Jan 3, 2013, making this Week 1 of 2013.
            const date = new Date(2012, 11, 31);
            expect(getWeek(date)).toBe(1);
        });

        it('should return Week 52 for 2012-01-01 (Sunday)', () => {
            // Jan 1, 2012 is a Sunday.
            // It belongs to the last week of 2011.
            const date = new Date(2012, 0, 1);
            expect(getWeek(date)).toBe(52);
        });
    });

    describe('Years with 53 Weeks', () => {
        it('should handle 2015 (Year ends on Thursday, has 53 weeks)', () => {
            expect(getWeek(new Date(2015, 11, 27))).toBe(52); // Sunday
            expect(getWeek(new Date(2015, 11, 28))).toBe(53); // Monday
            expect(getWeek(new Date(2015, 11, 31))).toBe(53); // Thursday
            expect(getWeek(new Date(2016, 0, 1))).toBe(53); // Friday (still ISO 2015)
            expect(getWeek(new Date(2016, 0, 3))).toBe(53); // Sunday (still ISO 2015)
            expect(getWeek(new Date(2016, 0, 4))).toBe(1); // Monday (Start of ISO 2016)
        });

        it('should handle 2020 (Leap year ending on Thursday, has 53 weeks)', () => {
            expect(getWeek(new Date(2020, 11, 28))).toBe(53);
            expect(getWeek(new Date(2020, 11, 31))).toBe(53);
            expect(getWeek(new Date(2021, 0, 3))).toBe(53);
            expect(getWeek(new Date(2021, 0, 4))).toBe(1);
        });
    });

    describe('Transitions where Jan 1st is Week 1', () => {
        it('should handle 2014-2015 transition (Jan 1st is Thursday)', () => {
            // If Jan 1st is a Thursday, that week is Week 1.
            const dec29 = new Date(2014, 11, 29); // Monday
            expect(getWeek(dec29)).toBe(1);
        });
    });

    describe('Leap Year Mid-Year Check', () => {
        it('should calculate correct week after Feb 29th', () => {
            // Feb 29, 2024 is a Thursday.
            const leapDay = new Date(2024, 1, 29);
            expect(getWeek(leapDay)).toBe(9);

            // March 1st, 2024 is a Friday.
            const dayAfter = new Date(2024, 2, 1);
            expect(getWeek(dayAfter)).toBe(9);
        });
    });

    describe('Custom Parameters (Locales)', () => {
        // 2025

        it('should support Monday as start of week (ISO Style)', () => {
            expect(getWeek(new Date(2025, 11, 28), { dowOffset: 'Monday' })).toBe(52);
            expect(getWeek(new Date(2025, 11, 29), { dowOffset: 'Monday' })).toBe(1);
            expect(getWeek(new Date(2025, 11, 31), { dowOffset: 'Monday' })).toBe(1);
            expect(getWeek(new Date(2026, 0, 1), { dowOffset: 'Monday' })).toBe(1);
            expect(getWeek(new Date(2026, 0, 4), { dowOffset: 'Monday' })).toBe(1);
            expect(getWeek(new Date(2026, 0, 5), { dowOffset: 'Monday' })).toBe(2);
        });

        it('should support Sunday as start of week (US Style)', () => {
            expect(getWeek(new Date(2025, 11, 27), { dowOffset: 'Sunday' })).toBe(52);
            expect(getWeek(new Date(2025, 11, 28), { dowOffset: 'Sunday' })).toBe(53);
            expect(getWeek(new Date(2025, 11, 31), { dowOffset: 'Sunday' })).toBe(53);
            expect(getWeek(new Date(2026, 0, 1), { dowOffset: 'Sunday' })).toBe(53);
            expect(getWeek(new Date(2026, 0, 3), { dowOffset: 'Sunday' })).toBe(53);
            expect(getWeek(new Date(2026, 0, 4), { dowOffset: 'Sunday' })).toBe(1);
        });

        it('should support Saturday as start of week', () => {
            expect(getWeek(new Date(2025, 11, 26), { dowOffset: 'Saturday' })).toBe(51);
            expect(getWeek(new Date(2025, 11, 27), { dowOffset: 'Saturday' })).toBe(52);
            expect(getWeek(new Date(2025, 11, 31), { dowOffset: 'Saturday' })).toBe(52);
            expect(getWeek(new Date(2026, 0, 1), { dowOffset: 'Saturday' })).toBe(52);
            expect(getWeek(new Date(2026, 0, 2), { dowOffset: 'Saturday' })).toBe(52);
            expect(getWeek(new Date(2026, 0, 3), { dowOffset: 'Saturday' })).toBe(1);
        });

        // 2026

        it('should support Monday as start of week (ISO Style)', () => {
            expect(getWeek(new Date(2026, 11, 27), { dowOffset: 'Monday' })).toBe(52);
            expect(getWeek(new Date(2026, 11, 28), { dowOffset: 'Monday' })).toBe(53);
            expect(getWeek(new Date(2026, 11, 31), { dowOffset: 'Monday' })).toBe(53);
            expect(getWeek(new Date(2027, 0, 1), { dowOffset: 'Monday' })).toBe(53);
            expect(getWeek(new Date(2027, 0, 3), { dowOffset: 'Monday' })).toBe(53);
            expect(getWeek(new Date(2027, 0, 4), { dowOffset: 'Monday' })).toBe(1);
        });

        it('should support Sunday as start of week (US Style)', () => {
            expect(getWeek(new Date(2026, 11, 26), { dowOffset: 'Sunday' })).toBe(51);
            expect(getWeek(new Date(2026, 11, 28), { dowOffset: 'Sunday' })).toBe(52);
            expect(getWeek(new Date(2026, 11, 31), { dowOffset: 'Sunday' })).toBe(52);
            expect(getWeek(new Date(2027, 0, 1), { dowOffset: 'Sunday' })).toBe(52);
            expect(getWeek(new Date(2027, 0, 2), { dowOffset: 'Sunday' })).toBe(52);
            expect(getWeek(new Date(2027, 0, 3), { dowOffset: 'Sunday' })).toBe(1);
        });

        it('should support Saturday as start of week', () => {
            expect(getWeek(new Date(2026, 11, 25), { dowOffset: 'Saturday' })).toBe(51);
            expect(getWeek(new Date(2026, 11, 26), { dowOffset: 'Saturday' })).toBe(52);
            expect(getWeek(new Date(2026, 11, 31), { dowOffset: 'Saturday' })).toBe(52);
            expect(getWeek(new Date(2027, 0, 1), { dowOffset: 'Saturday' })).toBe(52);
            expect(getWeek(new Date(2027, 0, 2), { dowOffset: 'Saturday' })).toBe(1);
        });
    });

    describe('Edge test', () => {
        it('should support bad dowOffset name', () => {
            expect(getWeek(new Date(2026, 11, 27), { dowOffset: 'Error' as any })).toBe(52);
        });
    });
});

describe('isIsoDate validation logic', () => {
    // --- POSITIVE CASES (Valid ISO 8601) ---

    it('should return true for a simple date (YYYY-MM-DD)', () => {
        expect(isISODate('2026-01-30')).toBeTrue();
    });

    it('should return true for a date and time (YYYY-MM-DDTHH:mm:ss)', () => {
        expect(isISODate('2026-01-30T12:45:30')).toBeTrue();
    });

    it('should return true for a date and time with UTC marker (Z)', () => {
        expect(isISODate('2026-01-30T12:45:30Z')).toBeTrue();
    });

    it('should return true for a full ISO string with milliseconds', () => {
        expect(isISODate('2026-01-30T12:45:30.500Z')).toBeTrue();
    });

    it('should return true for a date with a positive timezone offset', () => {
        expect(isISODate('2026-01-30T12:45:30+01:00')).toBeTrue();
    });

    it('should return true for a date with a negative timezone offset', () => {
        expect(isISODate('2026-01-30T12:45:30-05:00')).toBeTrue();
    });

    // --- NEGATIVE CASES (Invalid Format) ---

    it('should return false for an empty string', () => {
        expect(isISODate('')).toBeFalse();
    });

    it('should return false for dates using slashes (French/US style)', () => {
        expect(isISODate('30/01/2026')).toBeFalse();
        expect(isISODate('01/30/2026')).toBeFalse();
    });

    it('should return false if the "T" separator is missing between date and time', () => {
        expect(isISODate('2026-01-30 12:45:30')).toBeFalse();
    });

    it('should return false for single-digit months or days (incorrect padding)', () => {
        expect(isISODate('2026-1-30')).toBeFalse();
        expect(isISODate('2026-01-1')).toBeFalse();
    });

    it('should return false if seconds are missing (must match HH:mm:ss)', () => {
        expect(isISODate('2026-01-30T12:45')).toBeFalse();
    });

    it('should return false if the year is not 4 digits', () => {
        expect(isISODate('26-01-30')).toBeFalse();
    });

    it('should return false for random text strings', () => {
        expect(isISODate('not-a-date')).toBeFalse();
        expect(isISODate('2026-01-30-is-today')).toBeFalse();
    });

    it('should return false for partially valid strings with trailing garbage', () => {
        expect(isISODate('2026-01-30T12:45:30Z extra')).toBeFalse();
    });

    // --- EDGE CASES (Technical boundaries) ---

    it('should return false for invalid millisecond precision (e.g. 2 digits)', () => {
        // Our regex specifically looks for (\.\d{3})?
        expect(isISODate('2026-01-30T12:45:30.50Z')).toBeFalse();
    });

    it('should return false if timezone format is incomplete', () => {
        expect(isISODate('2026-01-30T12:45:30+01')).toBeFalse();
    });
});
