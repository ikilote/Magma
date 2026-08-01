// @ts-check

/**
 * ESLint configuration for the published library.
 *
 * Introduced on an existing codebase. Two principles:
 *
 *   1. `error` for anything that can be fixed without touching the public API.
 *      The lint target must stay at zero errors so a CI job can gate on it.
 *   2. `warn` for the documented backlog: real debt, visible on every run,
 *      countable, and impossible to grow silently. Each `warn` below states its
 *      count at the time of introduction and the condition for promotion to
 *      `error`.
 *
 * Nothing is turned `off` without a written reason.
 *
 * ---
 *
 * Selector conventions, as they exist today:
 *
 * - Components use `mg-*` element selectors, with two documented families of
 *   exception:
 *     1. Five components that predate the convention (`color-picker`,
 *        `context-menu`, `datetime-picker`, `info-message`, `info-messages`).
 *        They are public API, so renaming is a breaking change.
 *     2. The Table family, which attaches to native elements through an
 *        attribute marker (`table[mg]`, `tr[mg]`, `td[mg]`, `thead[mg]`, …) so
 *        native table semantics are preserved. The `component-selector` rule
 *        cannot express that shape.
 *   Both are exempted per-file, so the rule still guards every new component.
 *
 * - Directives mix three conventions (`mgTooltip` prefixed camelCase,
 *   `clickEnter` / `sortable` unprefixed camelCase, `sort-rule` /
 *   `stop-propagation` kebab-case). Normalising them is also a breaking change,
 *   so `directive-selector` stays off until a major version does the rename.
 */

const { defineConfig } = require('eslint/config');
const rootConfig = require('../../../eslint.config.js');

/** Components whose element selector predates the `mg-` convention. */
const LEGACY_SELECTOR_FILES = [
    '**/color-picker.component.ts',
    '**/context-menu.component.ts',
    '**/datetime-picker.component.ts',
    '**/info-message.component.ts',
    '**/info-messages.component.ts',
];

/** Components attaching to native table elements via an attribute marker. */
const NATIVE_ELEMENT_SELECTOR_FILES = [
    '**/components/table/table.component.ts',
    '**/components/table/table-row.component.ts',
    '**/components/table/table-cell.component.ts',
    '**/components/table/table-group.component.ts',
];

module.exports = defineConfig([
    ...rootConfig,
    {
        files: ['**/*.ts'],
        rules: {
            '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'mg', style: 'kebab-case' }],
            '@angular-eslint/directive-selector': 'off',

            // The codebase already marks deliberately unused bindings with a
            // leading underscore (`_indexR`, `_dragRef`, `_resize`, `_id`).
            // Honour that convention so the rule reports actual dead code only.
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],

            // Backlog · 145 occurrences at introduction, concentrated in
            // `form-builder-extended` (wraps Angular's own loosely typed
            // FormBuilder), `input-common` and `logger`. Promote to `error`
            // once cleared; `unknown` is the target for most of them.
            '@typescript-eslint/no-explicit-any': 'warn',

            // Backlog · resolved: all 22 occurrences fixed in the breaking-change
            // rename pass (next major). Rules promoted to `error`.
            '@angular-eslint/no-input-rename': 'error',
            '@angular-eslint/no-output-rename': 'error',
            '@angular-eslint/no-output-native': 'error',
            '@angular-eslint/no-output-on-prefix': 'error',

            // Backlog · 1 occurrence: `ellipsis-button`. Switching it to
            // OnPush is correct but surfaces a pre-existing instability in
            // `progress.component.spec.ts`; see AUDIT-QUALITE.md §5.3. Promote
            // to `error` once that spec is made deterministic.
            '@angular-eslint/prefer-on-push-component-change-detection': 'warn',
        },
    },
    {
        files: ['**/*.html'],
        rules: {
            // Backlog · 15 occurrences in library templates at introduction.
            // These are the accessibility gaps described in AUDIT-QUALITE.md §4
            // (click handlers on non-focusable elements, `mouseout` without
            // `blur`, empty buttons). They need a design pass on Tabs, Dialog,
            // Color picker and the text inputs, not a mechanical fix, so they
            // stay warnings until §4 is addressed. Promote to `error` then.
            '@angular-eslint/template/click-events-have-key-events': 'warn',
            '@angular-eslint/template/interactive-supports-focus': 'warn',
            '@angular-eslint/template/mouse-events-have-key-events': 'warn',
            '@angular-eslint/template/elements-content': 'warn',
        },
    },
    {
        files: [...LEGACY_SELECTOR_FILES, ...NATIVE_ELEMENT_SELECTOR_FILES],
        rules: {
            '@angular-eslint/component-selector': 'off',
        },
    },
    {
        /**
         * Specs legitimately do what the library must not:
         * - pass deliberately wrong types (`any`, `@ts-expect-error`) to assert
         *   that invalid usage is rejected or handled,
         * - declare throwaway host components with ad-hoc selectors,
         * - use empty functions and unused callback parameters as stubs.
         */
        files: ['**/*.spec.ts', '**/test-helpers.ts'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { args: 'none', caughtErrors: 'none', varsIgnorePattern: '^_' },
            ],
            '@angular-eslint/prefer-on-push-component-change-detection': 'off',
            '@angular-eslint/component-selector': 'off',
            // Test hosts declare empty lifecycle overrides to assert they are called.
            '@angular-eslint/no-empty-lifecycle-method': 'off',
        },
    },
]);
