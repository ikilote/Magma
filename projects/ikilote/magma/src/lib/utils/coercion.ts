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
