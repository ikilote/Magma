// @ts-check

/**
 * Shared ESLint configuration for the workspace.
 *
 * Only holds the rules that are project-agnostic: TypeScript recommended and
 * stylistic sets, the Angular TS set, and the template sets (including
 * accessibility). Selector prefix rules are project-specific and live in each
 * project's own `eslint.config.js`, because the library publishes `mg-*`
 * elements while the demo application uses `demo-*`.
 */

const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = defineConfig([
    {
        ignores: ['dist/**', 'coverage/**', '.angular/**', '**/__screenshots__/**'],
    },
    {
        files: ['**/*.ts'],
        extends: [
            eslint.configs.recommended,
            tseslint.configs.recommended,
            tseslint.configs.stylistic,
            angular.configs.tsRecommended,
        ],
        processor: angular.processInlineTemplates,
    },
    {
        files: ['**/*.html'],
        extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    },
]);
