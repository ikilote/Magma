// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        clearMocks: true,
        restoreMocks: true,
        mockReset: true,
        testTimeout: 5000,
        fileParallelism: false,
        pool: 'forks',
    },
});
