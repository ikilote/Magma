import {
    Directive,
    HostBinding,
    NgModule,
    OnChanges,
    OnDestroy,
    OnInit,
    Renderer2,
    SimpleChanges,
    inject,
    input,
} from '@angular/core';

import { MagmaClickEnterDirective } from './click-enter.directive';

import { MagmaInputCommon } from '../components/input/input-common';
import { sortWithRule } from '../utils/array';

/**
 * * MagmaSortRule : rule object
 * * MagmaSortRule[] : list of rule
 * * string :
 *    * `path.in.object` for string
 *    * `path.in.object:number` with type number (string, number, date → default string)
 *    * `path.in.object:desc` order (asc, desc → default asc)
 *    * `path.in.object:number:desc` with type and order
 *    * `path.in.object.1,path.in.object.2:desc` multiple rules with `,` separator (without space)
 */
export type MagmaSortRules = MagmaSortRule | MagmaSortRule[] | string;

export type MagmaSortRule =
    | {
          /** @see MagmaSortRules "string" */
          rules: string;
          /** order on init (only first) */
          init?: 'asc' | 'desc';
      }
    | {
          /** type translate */
          type: 'string' | 'number' | 'date';
          /** path.in.object */
          attr: string;
          /** order on init (only first) */
          init?: 'asc' | 'desc';
      }
    | {
          /** type translate */
          type: 'translate';
          /** path.in.object */
          attr: string;
          /** translate methode */
          translate: (text: string) => string;
          /** translate id */
          translateId: string;
          /** order on init (only first) */
          init?: 'asc' | 'desc';
          /** default value */
          default?: string;
      }
    | {
          /** no sort */
          type: 'none';
      }
    | undefined;

@Directive({
    selector: '[sort-rule]',
    hostDirectives: [MagmaClickEnterDirective],
})
export class MagmaSortRuleDirective implements OnInit {
    private sortable = inject(MagmaSortableDirective, { host: true });
    private click = inject(MagmaClickEnterDirective);

    sortRule = input<MagmaSortRules>(undefined, { alias: 'sort-rule' });

    constructor() {
        this.click.clickEnter.subscribe(() => {
            this.onClick();
        });
    }

    @HostBinding('class.sort-asc')
    get classSortAsc() {
        return this.sortable?.currentRuleOrder === true && this.sortable?.currentRule === this.sortRule();
    }

    @HostBinding('class.sort-desc')
    get classSortDesc() {
        return this.sortable?.currentRuleOrder === false && this.sortable?.currentRule === this.sortRule();
    }

    @HostBinding('class.sort-cell')
    get classSortCell() {
        return this.isNone();
    }

    sortOrder?: { order: boolean; rule: MagmaSortRule };

    ngOnInit(): void {
        const sortRule = this.sortRule();
        debugger;
        if (sortRule && !this.isNone() && this.isInit()) {
            this.sortable.sortWithRule(sortRule, this.isInit());
        }
    }

    onClick() {
        this.sortable.sortWithRule(this.sortRule());
    }

    private isNone() {
        const rule = this.sortRule();
        return rule && typeof rule !== 'string' && !Array.isArray(rule) && 'type' in rule
            ? rule?.type === 'none'
            : false;
    }

    private isInit() {
        const rule = this.sortRule();
        return rule && typeof rule !== 'string' && !Array.isArray(rule) && 'type' in rule && rule?.type !== 'none'
            ? rule.init
            : Array.isArray(rule) && rule[0] && 'type' in rule[0] && rule[0]?.type !== 'none'
              ? rule[0].init
              : undefined;
    }
}

@Directive({
    selector: '[sortable]',
    standalone: true,
})
export class MagmaSortableDirective implements OnInit, OnChanges, OnDestroy {
    private readonly renderer = inject(Renderer2);

    sortable = input<any[] | undefined>([]);

    sortableFilterInput = input<HTMLInputElement | MagmaInputCommon | undefined>(undefined, {
        alias: 'sortable-filter-input',
    });

    sortableFilter = input<((key: string, item: any, index: number) => boolean) | undefined>(undefined, {
        alias: 'sortable-filter',
    });

    currentRule?: MagmaSortRules;
    currentRuleOrder = false;

    private sortableComplete: any[] = [];
    private inputListener?: () => void;
    private input = '';

    ngOnInit(): void {
        const input = this.sortableFilterInput();
        if (input) {
            this.inputListener = this.renderer.listen(
                input instanceof MagmaInputCommon ? input.inputElement : input,
                'input',
                (inputEvent: InputEvent) => {
                    this.filter((inputEvent.target as HTMLInputElement).value);
                },
            );
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['sortable'] && this.sortableFilterInput() && this.sortable()) {
            this.sortableComplete.splice(0, this.sortable.length);
            this.sortableComplete.push(...(this.sortable() || []));
            this.update();
        }
    }

    update() {
        const input = this.sortableFilterInput();
        this.filter(input instanceof MagmaInputCommon ? input.getValue() : input?.value || '');
    }

    ngOnDestroy(): void {
        this.inputListener?.();
    }

    sortWithRule(rule?: MagmaSortRules, order: 'asc' | 'desc' = 'asc') {
        if (this.currentRule === rule) {
            this.currentRuleOrder = !this.currentRuleOrder;
        } else {
            this.currentRule = rule;
            this.currentRuleOrder = order === 'asc';
        }

        this.sortLines();
    }

    sortLines() {
        sortWithRule(this.sortable(), this.currentRule, this.currentRuleOrder);
    }

    private filter(input: string = '') {
        const sortable = this.sortable();
        if (this.input !== input && sortable && this.sortableComplete?.length && this.sortableFilter()) {
            sortable.splice(0, sortable.length);
            const result = !!input?.trim()
                ? this.sortableComplete.filter((item, index) => this.sortableFilter()!(input, item, index))
                : this.sortableComplete;
            sortable.push(...result);
            this.sortLines();
            this.input = input;
        }
    }
}

const MagmaSortable = [MagmaSortableDirective, MagmaSortRuleDirective];

@NgModule({
    imports: [MagmaSortable],
    exports: [MagmaSortable],
})
export class MagmaSortableModule {}
