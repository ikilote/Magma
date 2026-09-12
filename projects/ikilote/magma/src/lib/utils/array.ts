import { notANumber } from './number';
import { objectNestedValue } from './object';

import { MagmaSortRule, MagmaSortRules } from '../directives/sortable.directive';

export type MagmaStringArray = string | MagmaStringArray[];

/**
 * sort an array
 * @param sortable sortable array
 * @param ruleList rules
 * @param currentRuleOrder if false reverse order (default: true)
 */
export function sortWithRule<T = unknown>(
    sortable: T[] | undefined,
    ruleList: MagmaSortRules,
    currentRuleOrder = true,
): void {
    if (Array.isArray(sortable) && sortable.length > 1) {
        const rules =
            typeof ruleList === 'string'
                ? sortWithRuleFormater(ruleList)
                : !Array.isArray(ruleList)
                  ? [ruleList]
                  : ruleList;

        sortable.sort((a: T, b: T) => {
            for (const rule of rules) {
                if (rule && 'type' in rule && rule.type !== 'none') {
                    let valA: unknown = undefined;
                    let valB: unknown = undefined;
                    for (const frag of rule.attr.split(',')) {
                        valA ??= objectNestedValue(a, frag);
                        valB ??= objectNestedValue(b, frag);
                    }

                    let test: number;
                    if (rule.type === 'string') {
                        // Handle null/undefined by placing them at the end
                        if ((valA === null || valA === undefined) && (valB === null || valB === undefined)) {
                            test = 0;
                        } else if (valA === null || valA === undefined) {
                            return 1; // Always place invalid values at the end
                        } else if (valB === null || valB === undefined) {
                            return -1; // Always place invalid values at the end
                        } else {
                            test = String(valA).localeCompare(String(valB));
                        }
                    } else if (rule.type === 'translate') {
                        test = rule
                            .translate(rule.translateId.replace('%value%', (valA as string) || rule.default || ''))
                            .localeCompare(
                                rule.translate(
                                    rule.translateId.replace('%value%', (valB as string) || rule.default || ''),
                                ),
                            );
                    } else if (rule.type === 'number') {
                        // Handle null/undefined/NaN by placing them at the end
                        if (notANumber(valA) && notANumber(valB)) {
                            test = 0;
                        } else if (notANumber(valA)) {
                            return 1; // Always place invalid values at the end
                        } else if (notANumber(valB)) {
                            return -1; // Always place invalid values at the end
                        } else {
                            test = (valA as number) - (valB as number);
                        }
                    } else if (rule.type === 'date') {
                        const dateA = valA ? new Date(valA as string | number).getTime() : 0;
                        const dateB = valB ? new Date(valB as string | number).getTime() : 0;
                        test = (isNaN(dateA) ? 0 : dateA) - (isNaN(dateB) ? 0 : dateB);
                    } else {
                        test = `${valA}`.localeCompare(`${valB}`);
                    }

                    if (test !== 0) {
                        return test * (currentRuleOrder ? 1 : -1);
                    }
                }
            }
            return 0;
        });
    }
}

/**
 * Parse a compact rule string into a `MagmaSortRule[]`.
 *
 * Format: "attr[:type][:order][,attr[:type][:order]]"
 *
 * @example
 * sortWithRuleFormater('name:string:asc,age:number:desc')
 *
 * @param rule compact rule string
 * @returns array of sort rules
 */
function sortWithRuleFormater(rule: string): MagmaSortRule[] {
    const rules: MagmaSortRule[] = [];
    const list = rule.split(',');
    list.forEach(item => {
        const [, attr, type, init] = item
            .replace('::', ':')
            .match(/([^:]*)(?::(string|number|date))?(?::(asc|desc))?/) as [
            string,
            string,
            ('string' | 'number' | 'date')?,
            ('asc' | 'desc')?,
        ];

        rules.push({
            attr,
            type: type ?? 'string',
            init: init ?? 'asc',
        });
    });
    return rules;
}

/**
 * Flatten and split a potentially nested string array into a flat `string[]`.
 *
 * Handles three input shapes:
 * - A plain `string` — split by `pattern`.
 * - A (possibly nested) array of strings — flattened then each item split by `pattern`.
 * - `null` / `undefined` — returns `[]`.
 *
 * @param values  Source value (string, nested array, or nullish).
 * @param pattern Separator pattern used to split individual strings (default: comma with optional spaces).
 * @param flat    Maximum recursion depth for Array.flat (default: 20).
 * @returns Flat array of non-empty strings.
 */
export function flattenedListItems(
    values: MagmaStringArray | null | undefined,
    pattern = /\s*,\s*/,
    flat = 20,
): string[] {
    if (values == null) {
        return [];
    }
    if (typeof values === 'string') {
        values = values.split(pattern);
    }
    return (values as unknown[])
        .flat(flat)
        .filter((value): value is string => typeof value === 'string' && Boolean(value))
        .flatMap(value => value.split(pattern));
}
