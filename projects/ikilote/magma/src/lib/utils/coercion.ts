export function numberAttributeOrUndefined(value: unknown): number | undefined {
    const n = Number(value);
    return !isNaN(n) && isFinite(n) && !isNaN(parseFloat(String(value))) ? n : undefined;
}
