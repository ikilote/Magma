export function numberAttributeOrUndefined(value: unknown): number | undefined {
    return !isNaN(parseFloat(value as any)) && !isNaN(Number(value)) ? Number(value) : undefined;
}
