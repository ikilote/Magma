/**
 * Transform function for signal inputs that expect a numeric value.
 * Coerces any value to a `number`, returning `undefined` for values that are
 * not finite numbers (e.g. `NaN`, `Infinity`, non-numeric strings).
 *
 * @example
 * readonly max = input(undefined, { transform: numberAttributeOrUndefined });
 *
 * @param value Input value to coerce.
 * @returns The numeric value, or `undefined` if not a valid finite number.
 */
export function numberAttributeOrUndefined(value: unknown): number | undefined {
    const n = Number(value);
    return !isNaN(n) && isFinite(n) && !isNaN(parseFloat(String(value))) ? n : undefined;
}

/**
 * Transform function for signal inputs that expect an array.
 * Coerces `null` and `undefined` to `[]`, mirroring the pattern of Angular's
 * built-in `booleanAttribute` / `numberAttribute` transforms.
 *
 * @example
 * readonly proposals = input([], { transform: arrayAttribute<string> });
 */
export function arrayAttribute<T>(value: T[] | null | undefined): T[] {
    return Array.isArray(value) ? value : [];
}
