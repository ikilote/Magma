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

/**
 * Add time in weeks
 * @param weeks number
 * @param start date (default now)
 * @returns new Date
 */
export function inXWeeks(weeks: number, start: number | Date = Date.now()): Date {
    return new Date(typeof start === 'number' ? start : start.getTimezoneOffset() + weeks * 7 * 24 * 60 * 60 * 1000);
}

/**
 * Add time in days
 * @param days number
 * @param start date (default now)
 * @returns new Date
 */
export function inXDays(days: number, start: number | Date = Date.now()): Date {
    return new Date(typeof start === 'number' ? start : start.getTimezoneOffset() + days * 24 * 60 * 60 * 1000);
}

/**
 * Add time in number
 * @param hours number
 * @param start date (default now)
 * @returns new Date
 */
export function inXHours(hours: number, start: number | Date = Date.now()): Date {
    return new Date(typeof start === 'number' ? start : start.getTimezoneOffset() + hours * 60 * 60 * 1000);
}

/**
 * Add time in minutes
 * @param minutes number
 * @param start date (default now)
 * @returns new Date
 */
export function inXMinutes(minutes: number, start: number | Date = Date.now()): Date {
    return new Date(typeof start === 'number' ? start : start.getTimezoneOffset() + minutes * 60 * 1000);
}

/**
 * Add time in second
 * @param seconds number
 * @param start date (default now)
 * @returns new Date
 */
export function inXSeconde(seconds: number, start: number | Date = Date.now()): Date {
    return new Date(typeof start === 'number' ? start : start.getTimezoneOffset() + seconds * 1000);
}

/**
 * Add time in milliseconds
 * @param milliseconds number
 * @param start date (default now)
 * @returns new Date
 */
export function inXMilliSeconde(milliseconds: number, start: number | Date = Date.now()): Date {
    return new Date(typeof start === 'number' ? start : start.getTimezoneOffset() + milliseconds);
}
