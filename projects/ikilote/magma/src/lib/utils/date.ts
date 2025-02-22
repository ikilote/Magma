export function toISODate(date?: string | Date, newDate = false): string | undefined {
    if (typeof date === 'string' && date.trim()) {
        return date;
    }
    if (date instanceof Date) {
        return date.toISOString();
    }
    return newDate ? new Date().toISOString() : undefined;
}
