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
