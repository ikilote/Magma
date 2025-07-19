import { objectNestedValue } from './object';

import { MagmaSortRule, MagmaSortRules } from '../directives/sortable.directive';

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
                    const valA = objectNestedValue(a, rule.attr);
                    const valB = objectNestedValue(b, rule.attr);

                    let test = 0;
                    if (rule.type === 'string') {
                        test = (valA as string).localeCompare(valB as string);
                    } else if (rule.type === 'translate') {
                        test = rule
                            .translate(rule.translateId.replace('%value%', valA || rule.default))
                            .localeCompare(rule.translate(rule.translateId.replace('%value%', valB || rule.default)));
                    } else if (rule.type === 'number') {
                        test = valA - valB;
                    } else if (rule.type === 'date') {
                        test = new Date(valA).getTime() - new Date(valB).getTime();
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
