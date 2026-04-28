import { ChangeDetectionStrategy, Component, OnInit, computed, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CssVarEditorLabels, DEFAULT_EDITOR_LABELS } from './css-var-editor.labels';
import { MagmaCssVarItem } from './css-var-item.component';
import { MagmaBorderEditor } from './editors/border-editor.component';
import { MagmaColorMixEditor } from './editors/color-mix-editor.component';
import { MagmaFilterEditor } from './editors/filter-editor.component';
import { MagmaGradientEditor } from './editors/gradient-editor.component';
import { MagmaShadowEditor } from './editors/shadow-editor.component';
import { MagmaTransformEditor } from './editors/transform-editor.component';
import { MagmaTypographyEditor } from './editors/typography-editor.component';

import { MagmaInputElement } from '../input/input-element.component';
import { MagmaInputText } from '../input/input-text.component';
import { MagmaInput } from '../input/input.component';

export interface CssVariable {
    name: string;
    value: string;
    originalValue: string;
}

export interface CssVariableGroup {
    label: string;
    variables: CssVariable[];
}

export type EditorTab =
    | 'variables'
    | 'shadow'
    | 'gradient'
    | 'border'
    | 'color-mix'
    | 'filter'
    | 'transform'
    | 'typography';

@Component({
    selector: 'mg-css-var-editor',
    templateUrl: './css-var-editor.component.html',
    styleUrl: './css-var-editor.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,
        MagmaCssVarItem,
        MagmaShadowEditor,
        MagmaGradientEditor,
        MagmaBorderEditor,
        MagmaColorMixEditor,
        MagmaFilterEditor,
        MagmaTransformEditor,
        MagmaTypographyEditor,
        MagmaInput,
        MagmaInputElement,
        MagmaInputText,
    ],
})
export class MagmaCssVarEditor implements OnInit {
    readonly selector = input<string>('body');
    readonly filter = input<string>('');
    readonly labels = input<CssVarEditorLabels>(DEFAULT_EDITOR_LABELS);

    readonly groups = signal<CssVariableGroup[]>([]);
    readonly search = signal<string>('');
    readonly activeTab = signal<EditorTab>('variables');

    readonly tabs: { id: EditorTab; label: string }[] = [
        { id: 'variables', label: 'Variables' },
        { id: 'shadow', label: 'Shadow' },
        { id: 'gradient', label: 'Gradient' },
        { id: 'border', label: 'Border' },
        { id: 'color-mix', label: 'Color Mix' },
        { id: 'filter', label: 'Filter' },
        { id: 'transform', label: 'Transform' },
        { id: 'typography', label: 'Typography' },
    ];

    readonly filteredGroups = computed(() => {
        const term = this.search().toLowerCase();
        if (!term) return this.groups();
        return this.groups()
            .map(group => ({
                ...group,
                variables: group.variables.filter(
                    v => v.name.toLowerCase().includes(term) || v.value.toLowerCase().includes(term),
                ),
            }))
            .filter(group => group.variables.length > 0);
    });

    ngOnInit(): void {
        this.loadVariables();
    }

    loadVariables(): void {
        const element = document.querySelector(this.selector());
        if (!element) return;

        const styles = getComputedStyle(element);
        const cssVarMap = new Map<string, CssVariable>();

        for (const sheet of Array.from(document.styleSheets)) {
            try {
                for (const rule of Array.from(sheet.cssRules)) {
                    if (rule instanceof CSSStyleRule) {
                        const ruleStyle = rule.style;
                        for (let i = 0; i < ruleStyle.length; i++) {
                            const name = ruleStyle[i];
                            if (name.startsWith('--')) {
                                const filterPrefix = this.filter();
                                if (filterPrefix && !name.startsWith(filterPrefix)) continue;
                                if (!cssVarMap.has(name)) {
                                    const computedValue = styles.getPropertyValue(name).trim();
                                    cssVarMap.set(name, {
                                        name,
                                        value: computedValue,
                                        originalValue: computedValue,
                                    });
                                }
                            }
                        }
                    }
                }
            } catch {
                // Cross-origin stylesheets will throw
            }
        }

        this.groups.set(this.groupVariables(Array.from(cssVarMap.values())));
    }

    updateVariable(variable: CssVariable, newValue: string): void {
        variable.value = newValue;
        document.documentElement.style.setProperty(variable.name, newValue);
    }

    resetVariable(variable: CssVariable): void {
        variable.value = variable.originalValue;
        document.documentElement.style.removeProperty(variable.name);
    }

    resetAll(): void {
        for (const group of this.groups()) {
            for (const v of group.variables) {
                v.value = v.originalValue;
                document.documentElement.style.removeProperty(v.name);
            }
        }
        this.groups.set([...this.groups()]);
    }

    exportVariables(): string {
        const modified = this.groups()
            .flatMap(g => g.variables)
            .filter(v => v.value !== v.originalValue);

        if (modified.length === 0) return '';

        const lines = modified.map(v => `    ${v.name}: ${v.value};`);
        return `:root {\n${lines.join('\n')}\n}`;
    }

    copyExport(): void {
        const css = this.exportVariables();
        if (css) {
            navigator.clipboard.writeText(css);
        }
    }

    private groupVariables(variables: CssVariable[]): CssVariableGroup[] {
        const groupMap = new Map<string, CssVariable[]>();

        for (const v of variables) {
            const parts = v.name.replace(/^--/, '').split('-');
            const groupKey = parts[0] || 'other';
            if (!groupMap.has(groupKey)) {
                groupMap.set(groupKey, []);
            }
            groupMap.get(groupKey)!.push(v);
        }

        return Array.from(groupMap.entries())
            .map(([label, vars]) => ({
                label,
                variables: vars.sort((a, b) => a.name.localeCompare(b.name)),
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }
}
