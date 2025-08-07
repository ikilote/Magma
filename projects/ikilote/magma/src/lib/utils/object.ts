export function objectsAreSame(
    objA?: Record<string, any>,
    objB?: Record<string, any>,
    ignoreKeys: string[] = [],
): boolean {
    if (objA === objB) {
        return true;
    } else if (objA === undefined || objB === undefined) {
        return false;
    }

    let areTheSame = true;

    const isObject = (a: Record<string, any>, b: Record<string, any>) =>
        typeof a === 'object' && !Array.isArray(a) && !!a && !!b;

    const compareValues = (a: Record<string, any>, b: Record<string, any>) => {
        if (Array.isArray(a)) {
            if (Array.isArray(b)) {
                const aCopy = [...a];
                const bCopy = [...b];
                if (a.length === b.length) {
                    aCopy.sort();
                    bCopy.sort();
                    aCopy.forEach((ele, idx) => compareValues(ele, bCopy[idx]));
                } else {
                    areTheSame = false;
                }
            } else {
                areTheSame = false;
            }
        } else if ((!isObject(a, b) && a !== b) || (isObject(a, b) && !objectsAreSame(a, b, ignoreKeys))) {
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

    for (let key of keysA) {
        if (!ignoreKeys.includes(key)) {
            compareValues(objA[key], objB[key]);
            if (!areTheSame) {
                return false;
            }
        }
    }

    return areTheSame;
}

export function objectNestedValue<T = any>(object: any, path: (string | number)[] | string): any {
    if (typeof path === 'string') {
        path = path !== '' ? path.split('.') : [];
    }
    return path.reduce((obj, key) => (obj ? obj[key] : undefined), object) as T;
}

export function objectAssignNested(target: any, ...sources: any[]) {
    sources.forEach(source => {
        Object.keys(source).forEach(key => {
            const sourceVal = source[key];
            const targetVal = target[key];
            target[key] =
                typeof targetVal === 'object' && typeof sourceVal === 'object'
                    ? objectAssignNested(targetVal, sourceVal)
                    : sourceVal;
        });
    });
    return target;
}
