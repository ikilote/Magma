import { playwright } from '@vitest/browser-playwright';

import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            '@ikilote/magma': resolve(__dirname, './src/public-api.ts'),
        },
    },
    test: {
        globals: true,
        clearMocks: true,
        restoreMocks: true,
        mockReset: true,
        testTimeout: 10000,
        setupFiles: [resolve(__dirname, '../../../src/test-setup.ts')],
        include: ['**/*.spec.ts'],
        exclude: ['**/test-helpers.spec.ts', '**/test-helpers.ts'],
        coverage: {
            exclude: ['**/test-helpers.ts', '**/test-helpers.spec.ts'],
        },
        pool: 'forks',
        singleFork: true,
        isolate: true,
        browser: {
            enabled: true,
            instances: [
                {
                    browser: 'chromium',
                    provider: playwright({ headless: true }),
                },
            ],
            screenshotFailures: false,
        },
    },
});
