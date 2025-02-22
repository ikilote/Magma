export function jsonCopy<T>(o: T): T {
    return JSON.parse(JSON.stringify(o));
}
