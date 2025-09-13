export function isEmpty(value: any) {
    if (value instanceof Date) {
        return false;
    }
    if (
        value === null ||
        value === undefined ||
        ((value instanceof Set || value instanceof Map) && value.size === 0) ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'string' && value == '') ||
        (typeof value === 'object' &&
            !(value instanceof Set || value instanceof Map) &&
            Object.keys(value).length === 0)
    ) {
        return true;
    }
    return false;
}

export function regexpSlash(value: string | RegExp) {
    if (typeof value === 'string' && value.startsWith('/') && value.endsWith('/')) {
        value = new RegExp(value.replace(/^\/(.*)\/$/, '$1'), 'g');
    }
    return value;
}
