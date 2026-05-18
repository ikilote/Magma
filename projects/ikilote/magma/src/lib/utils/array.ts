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
export function sortWithRule<T = any>(
    sortable: any[] | undefined,
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
                    let valA: any = undefined;
                    let valB: any = undefined;
                    for (const frag of rule.attr.split(',')) {
                        valA ??= objectNestedValue(a, frag);
                        valB ??= objectNestedValue(b, frag);
                    }

                    let test = 0;
                    if (rule.type === 'string') {
                        // Handle null/undefined by placing them at the end
                        if ((valA === null || valA === undefined) && (valB === null || valB === undefined)) {
                            test = 0;
                        } else if (valA === null || valA === undefined) {
                            return 1; // Always place invalid values at the end
                        } else if (valB === null || valB === undefined) {
                            return -1; // Always place invalid values at the end
                        } else {
                            test = valA.toString().localeCompare(valB.toString());
                        }
                    } else if (rule.type === 'translate') {
                        test = rule
                            .translate(rule.translateId.replace('%value%', valA || rule.default))
                            .localeCompare(rule.translate(rule.translateId.replace('%value%', valB || rule.default)));
                    } else if (rule.type === 'number') {
                        // Handle null/undefined/NaN by placing them at the end
                        if (notANumber(valA) && notANumber(valB)) {
                            test = 0;
                        } else if (notANumber(valA)) {
                            return 1; // Always place invalid values at the end
                        } else if (notANumber(valB)) {
                            return -1; // Always place invalid values at the end
                        } else {
                            test = valA - valB;
                        }
                    } else if (rule.type === 'date') {
                        const dateA = valA ? new Date(valA).getTime() : 0;
                        const dateB = valB ? new Date(valB).getTime() : 0;
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

function sortWithRuleFormater(rule: string): MagmaSortRule[] {
    const rules: MagmaSortRule[] = [];
    const list = rule.split(',');
    list.forEach(item => {
        const [, attr, type, init] = item
            .replace('::', ':')
            .match(/([^:]*)(?:\:(string|number|date))?(?:\:(asc|desc))?/) as [
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

export function flattenedListItems(values: MagmaStringArray, pattern = /\s*,\s*/): string[] {
    if (typeof values === 'string') {
        values = values.split(pattern);
    }
    const list: any[] = [];
    values?.flat(20).forEach((value: any) => {
        if (typeof value === 'string' && value) {
            list.push(...value.split(pattern));
        }
    });
    return list;
}
