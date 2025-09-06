export function isEmpty(value: any) {
    if (
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'string' && value == '') ||
        (typeof value === 'object' && Object.keys(value).length === 0)
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
