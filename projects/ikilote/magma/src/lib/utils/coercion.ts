export function numberAttributeOrUndefined(value: unknown): number | undefined {
    return !isNaN(Number(value)) && isFinite(Number(value)) && !isNaN(parseFloat(value as any))
        ? Number(value)
        : undefined;
}
