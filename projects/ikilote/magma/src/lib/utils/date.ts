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
    const dowOffset = param?.dowOffset ? (DAYS[param.dowOffset] ?? 1) : 1;
    const firstWeekContainsDay = param?.firstWeekContainsDay ? param?.firstWeekContainsDay : 4;
    const newYear = new Date(date.getFullYear(), 0, 1);
    let day = newYear.getDay() - dowOffset; // the day of week the year begins on
    day = day >= 0 ? day : day + 7;
    const dayNum =
        Math.floor(
            (date.getTime() - newYear.getTime() - (date.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) /
                86400000,
        ) + 1;
    let weekNumber = 0;
    // if the year starts before the middle of a week
    if (day < firstWeekContainsDay) {
        weekNumber = Math.floor((dayNum + day - 1) / 7) + 1;
        if (weekNumber > 52) {
            const nYear = new Date(date.getFullYear() + 1, 0, 1);
            let nDay = nYear.getDay() - dowOffset;
            nDay = nDay >= 0 ? nDay : nDay + 7;
            // if the next year starts before the middle of the week, it is week #1 of that year
            weekNumber = nDay < firstWeekContainsDay ? 1 : 53;
        }
    } else {
        weekNumber = Math.floor((dayNum + day - 1) / 7);
    }
    return weekNumber;
}
