/** Enum → Value List */
export function enumToValueList(e: Record<string, string | number>) {
    return Object.entries<string | number>(e)
        .filter(([key]) => isNaN(Number(key)))
        .map<string | number>(([, v]) => v);
}

/** Enum → Key List */
export function enumToKeyList(e: Record<string, string | number>) {
    return Object.keys(e).filter(k => isNaN(Number(k)));
}

/** Enum → List `{ key, value }[]` */
export function enumToKeyValue(e: Record<string, string | number>) {
    return Object.entries<string | number>(e)
        .filter(([k]) => isNaN(Number(k))) // Remove numeric key
        .map<Record<string, string | number>>(([key, value]) => ({ key, value }));
}

/** Enum → Object */
export function enumToObject(e: Record<string, string | number>): Record<string, string | number> {
    return Object.keys(e)
        .filter(k => isNaN(Number(k))) // Remove numeric key
        .reduce((acc, k) => ({ ...acc, [k]: e[k as keyof typeof e] }), {});
}

/** Enum → Map */
export function enumToMap(e: Record<string, string | number>): Map<string, string | number> {
    return Object.keys(e)
        .filter(k => isNaN(Number(k))) // Remove numeric key
        .reduce((acc, k) => acc.set(k, e[k as keyof typeof e]), new Map());
}
