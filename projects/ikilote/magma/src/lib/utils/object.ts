/**
 * Performs a deep equality check between two objects.
 *
 * Arrays are compared by sorting their string representations before element-by-element comparison.
 * Nested plain objects are compared recursively. Keys listed in `ignoreKeys` and properties
 * with an `undefined` value are excluded from the comparison.
 *
 * @param objA       First object to compare.
 * @param objB       Second object to compare.
 * @param ignoreKeys List of property keys to exclude from the comparison.
 * @returns `true` if both objects are considered equal, `false` otherwise.
 */
export function objectsAreSame(objA?: object, objB?: object, ignoreKeys: string[] = []): boolean {
    if (objA === objB) {
        return true;
    } else if (objA == null || objB == null) {
        return false;
    }

    let areTheSame = true;

    const isPlainObject = (a: unknown): a is object => typeof a === 'object' && !Array.isArray(a) && a !== null;

    const compareValues = (a: unknown, b: unknown) => {
        if (Array.isArray(a)) {
            if (Array.isArray(b)) {
                if (a.length === b.length) {
                    const aCopy = [...a].map(v => (typeof v === 'number' ? v : `${v}`)).sort();
                    const bCopy = [...b].map(v => (typeof v === 'number' ? v : `${v}`)).sort();
                    aCopy.forEach((ele, idx) => compareValues(ele, bCopy[idx]));
                } else {
                    areTheSame = false;
                }
            } else {
                areTheSame = false;
            }
        } else if (isPlainObject(a) && isPlainObject(b)) {
            if (!objectsAreSame(a, b, ignoreKeys)) {
                areTheSame = false;
            }
        } else if (a !== b) {
            areTheSame = false;
        }
    };

    const entriesA = Object.entries(objA).filter(([k, v]) => !ignoreKeys.includes(k) && v !== undefined);
    const entriesB = Object.entries(objB).filter(([k, v]) => !ignoreKeys.includes(k) && v !== undefined);

    if (entriesA.length !== entriesB.length) {
        return false;
    }

    const objBRecord = objB as Record<string, unknown>;
    for (const [key, valA] of entriesA) {
        compareValues(valA, objBRecord[key]);
        if (!areTheSame) {
            return false;
        }
    }

    return areTheSame;
}

/**
 * Reads a nested property value from an object using a dot-separated path string
 * or an array of keys/indices.
 *
 * @example
 * objectNestedValue({ a: { b: 42 } }, 'a.b') // → 42
 * objectNestedValue({ a: [1, 2] }, ['a', 1])  // → 2
 *
 * @param object Source object.
 * @param path   Dot-separated string path or array of key segments.
 * @returns The value at the given path, or `undefined` if any segment is missing.
 */
export function objectNestedValue<T = unknown>(object: unknown, path: (string | number)[] | string): T | undefined {
    if (typeof path === 'string') {
        path = path !== '' ? path.split('.') : [];
    }
    return path.reduce((obj: unknown, key: string | number) => {
        if (obj && typeof obj === 'object') {
            return (obj as Record<string | number, unknown>)[key];
        }
        return undefined;
    }, object) as T | undefined;
}

/**
 * Recursively merges one or more source objects into `target`, performing a deep
 * assignment rather than a shallow `Object.assign`.
 *
 * Plain objects at matching keys are merged recursively; all other value types
 * (primitives, arrays, class instances) are replaced by the source value.
 *
 * @param target  The object to mutate and return.
 * @param sources One or more source objects whose properties are merged into `target`.
 * @returns The mutated `target` object.
 */
export function objectAssignNested<T extends object>(target: T, ...sources: object[]): T {
    sources.forEach(source => {
        Object.keys(source).forEach(key => {
            const sourceVal = (source as Record<string, unknown>)[key];
            const targetVal = (target as Record<string, unknown>)[key];
            (target as Record<string, unknown>)[key] =
                typeof targetVal === 'object' &&
                targetVal !== null &&
                typeof sourceVal === 'object' &&
                sourceVal !== null
                    ? objectAssignNested(targetVal as object, sourceVal as object)
                    : sourceVal;
        });
    });
    return target;
}
