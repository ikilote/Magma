/**
 * Date to ISO format
 * @param date date in string of Date object
 * @param newDate new date if date is empty
 * @returns return date YYYY-MM-DDTHH:mm:ssZ
 */
export function toISODate(date?: string | Date, newDate = false): string | undefined {
    if (typeof date === 'string' && date.trim()) {
        return date;
    }
    if (date instanceof Date) {
        return date.toISOString();
    }
    return newDate ? new Date().toISOString() : undefined;
}

export enum DurationTime {
    WEEK = 7 * 24 * 60 * 60 * 1000,
    DAY = 24 * 60 * 60 * 1000,
    HOUR = 60 * 60 * 1000,
    MINUTE = 60 * 1000,
    SECOND = 1000,
    MILLISECOND = 1,
}

/**
 * Add time in weeks
 * @param weeks number
 * @param duration size (default : MINUTE)
 * @param start date (default: now)
 * @returns new Date
 */
export function addDuration(
    weeks: number,
    duration: DurationTime = DurationTime.MINUTE,
    start: number | Date = Date.now(),
): Date {
    return new Date(typeof start === 'number' ? start : start.getTimezoneOffset() + weeks * duration);
}
