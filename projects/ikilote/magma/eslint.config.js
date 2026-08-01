// @ts-check

/**
 * ESLint configuration for the published library.
 *
 * Nothing is turned `off` without a written reason.
 *
 * ---
 *
 * Selector conventions:
 *
 * - Components use `mg-*` element selectors, with two documented families of
 *   exception:
 *     1. Five components that predate the convention (`color-picker`,
 *        `context-menu`, `datetime-picker`, `info-message`, `info-messages`).
 *        They are public API; renaming is a breaking change.
 *     2. The Table family attaches to native elements via an attribute marker
 *        (`table[mg]`, `tr[mg]`, …) to preserve native table semantics.
 *        The `component-selector` rule cannot express that shape.
 *   Both families are exempted per-file so the rule still guards new components.
 *
 * - `directive-selector` is off: directives mix camelCase and kebab-case
 *   conventions that predate the rule; normalising is a breaking change.
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

            // Deliberately unused bindings are marked with a leading underscore.
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

            // Remaining occurrences are concentrated in `form-builder-extended`
            // (wraps Angular's loosely typed FormBuilder) and `logger`.
            '@typescript-eslint/no-explicit-any': 'warn',

            '@angular-eslint/no-input-rename': 'error',
            '@angular-eslint/no-output-rename': 'error',
            '@angular-eslint/no-output-native': 'error',
            '@angular-eslint/no-output-on-prefix': 'error',

            // One remaining occurrence in `ellipsis-button`. Switching it to
            // OnPush surfaces a pre-existing instability in
            // `progress.component.spec.ts`; fix that spec first.
            '@angular-eslint/prefer-on-push-component-change-detection': 'warn',
        },
    },
    {
        files: ['**/*.html'],
        rules: {
            // Accessibility gaps in Tabs, Dialog, Color picker and text inputs.
            // They need a design pass rather than a mechanical fix.
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
            '@angular-eslint/no-empty-lifecycle-method': 'off',
        },
    },
]);
