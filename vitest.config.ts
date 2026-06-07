// vitest.config.ts
import angular from '@analogjs/vite-plugin-angular';

import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [angular()],
    test: {
        globals: true,
        clearMocks: true,
        restoreMocks: true,
        mockReset: true,
        testTimeout: 5000,
        fileParallelism: false,
        pool: 'forks',
        environment: 'jsdom',
        setupFiles: ['src/test-setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['html', 'lcov', 'text'],
            reportsDirectory: './coverage',
            exclude: ['**/*.spec.ts', '**/*.config.ts', '**/test-setup.ts', '**/test.ts', 'node_modules/**', 'dist/**'],
        },
    },
});
