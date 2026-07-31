export function objectsAreSame(
    objA?: Record<string, unknown>,
    objB?: Record<string, unknown>,
    ignoreKeys: string[] = [],
): boolean {
    if (objA === objB) {
        return true;
    } else if (objA === undefined || objA === null || objB === undefined || objB === null) {
        return false;
    }

    let areTheSame = true;

    const isObject = (a: unknown, b: unknown): a is Record<string, unknown> =>
        typeof a === 'object' && !Array.isArray(a) && !!a && !!b;

    const compareValues = (a: unknown, b: unknown) => {
        if (Array.isArray(a)) {
            if (Array.isArray(b)) {
                let aCopy = [...a];
                let bCopy = [...b];
                if (a.length === b.length) {
                    aCopy = aCopy.map(a => (typeof a === 'number' ? a : `${a}`));
                    aCopy.sort();
                    bCopy = bCopy.map(a => (typeof a === 'number' ? a : `${a}`));
                    bCopy.sort();
                    aCopy.forEach((ele, idx) => compareValues(ele, bCopy[idx]));
                } else {
                    areTheSame = false;
                }
            } else {
                areTheSame = false;
            }
        } else if (
            (!isObject(a, b) && a !== b) ||
            (isObject(a, b) && !objectsAreSame(a as Record<string, unknown>, b as Record<string, unknown>, ignoreKeys))
        ) {
            areTheSame = false;
        }
    };

    const keysA = Object.entries(objA)
        .filter(entry => !ignoreKeys.includes(entry[0]) && entry[1] !== undefined)
        .map(e => e[0]);
    const keysB = Object.entries(objB)
        .filter(entry => !ignoreKeys.includes(entry[0]) && entry[1] !== undefined)
        .map(e => e[0]);

    if (keysA.length !== keysB.length) {
        return false;
    }

    for (const key of keysA) {
        compareValues(objA[key], objB[key]);
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

export function objectAssignNested(target: Record<string, unknown>, ...sources: Record<string, unknown>[]) {
    sources.forEach(source => {
        Object.keys(source).forEach(key => {
            const sourceVal = source[key];
            const targetVal = target[key];
            target[key] =
                typeof targetVal === 'object' && typeof sourceVal === 'object'
                    ? objectAssignNested(targetVal as Record<string, unknown>, sourceVal as Record<string, unknown>)
                    : sourceVal;
        });
    });
    return target;
}
