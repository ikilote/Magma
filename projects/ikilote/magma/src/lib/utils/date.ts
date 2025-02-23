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
