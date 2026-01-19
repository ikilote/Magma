export type WeekDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
const DAYS: Record<WeekDay, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
};

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
 * @param number number
 * @param duration size (default : MINUTE)
 * @param start date (default: now)
 * @returns new Date
 */
export function addDuration(
    number: number,
    duration: DurationTime = DurationTime.MINUTE,
    start: number | Date = Date.now(),
): Date {
    return new Date((typeof start === 'number' ? start : start.getTime()) + number * duration);
}

/**
 * Returns the week number for this date.
 * @param int dowOffset the day of week the week"starts" on for your locale - it can be from 0 to 6.
 * If dowOffset is 1 (Monday). Default is Monday (ISO 8601).
 * @return int the week returned is the ISO 8601 week number
 * @author getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com
 */
export function getWeek(
    date: Date,
    param?: { dowOffset?: 'Monday' | 'Sunday' | 'Saturday'; firstWeekContainsDay?: 1 | 4 },
) {
    const DAYS = { Sunday: 0, Monday: 1, Saturday: 6 };
    // Default to Monday (1) as per ISO 8601
    const dowOffset = param?.dowOffset ? (DAYS[param.dowOffset] ?? 1) : 1;

    // Create a copy so we don't mutate the original date object
    const target = new Date(date.valueOf());

    // 1. Adjust the date to the Thursday of the current week
    // (In ISO 8601, the week number is determined by the Thursday)
    const dayNr = (date.getDay() - dowOffset + 7) % 7;
    target.setDate(target.getDate() - dayNr + 3);

    // 2. Find the first Thursday of the year
    const firstThursday = new Date(target.getFullYear(), 0, 4);
    const firstThursdayDayNr = (firstThursday.getDay() - dowOffset + 7) % 7;
    firstThursday.setDate(firstThursday.getDate() - firstThursdayDayNr + 3);

    // 3. Calculate the number of weeks between the target Thursday and the first Thursday
    const diffInMs = target.getTime() - firstThursday.getTime();

    // 604800000 = 7 days * 24h * 60m * 60s * 1000ms
    const weekNumber = 1 + Math.round(diffInMs / 604800000);

    return weekNumber;
}
