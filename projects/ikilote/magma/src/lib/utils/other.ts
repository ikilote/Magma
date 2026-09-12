/**
 * Returns `true` when the value is considered "empty".
 *
 * The following values are treated as empty:
 * - `null` or `undefined`
 * - Empty string (`''`)
 * - Empty array (`[]`)
 * - Empty plain object (`{}`)
 * - `Set` or `Map` with `size === 0`
 *
 * `Date` instances are **never** considered empty regardless of their value.
 *
 * @param value Value to test.
 * @returns `true` if empty, `false` otherwise.
 */
export function isEmpty(value: unknown) {
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

/**
 * Normalises a value that may be either a literal `RegExp` or a regex-like
 * string enclosed in slashes (e.g. `'/pattern/gi'`).
 *
 * If `value` is a string that matches the `/expr/flags` format, it is converted
 * into an equivalent `RegExp` object. Otherwise the value is returned unchanged.
 *
 * @param value A `RegExp` or a potential regex string.
 * @returns A `RegExp` if the string was a regex literal, otherwise the original value.
 */
export function regexpSlash(value: string | RegExp) {
    if (typeof value === 'string' && value.length > 2 && value.match(/^\/.*\/[ig]*$/)) {
        value = new RegExp(value.replace(/^\/(.*)\/[ig]*$/, '$1'), 'g');
    }
    return value;
}
