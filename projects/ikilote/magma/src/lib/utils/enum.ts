/** Enum → Value List */
export function enumToValueList(e: any) {
    return Object.entries<string | number>(e)
        .filter(([key]) => isNaN(Number(key)))
        .map<string | number>(([k, v]) => v);
}

/** Enum → Key List */
export function enumToKeyList(e: any) {
    return Object.keys(e).filter(k => isNaN(Number(k)));
}

/** Enum → List `{ key, value }[]` */
export function enumToKeyValue(e: any) {
    return Object.entries<string | number>(e)
        .filter(([k]) => isNaN(Number(k))) // Remove numeric key
        .map<Record<string, string | number>>(([key, value]) => ({ key, value }));
}

/** Enum → Object */
export function enumToObject(e: any): Record<string, string | number> {
    return Object.keys(e)
        .filter(k => isNaN(Number(k))) // Remove numeric key
        .reduce((acc, k) => ({ ...acc, [k]: e[k as keyof typeof e] }), {});
}

/** Enum → Map */
export function enumToMap(e: any): Map<string, string | number> {
    return Object.keys(e)
        .filter(k => isNaN(Number(k))) // Remove numeric key
        .reduce((acc, k) => acc.set(k, e[k as keyof typeof e]), new Map());
}
