// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        clearMocks: true,
        restoreMocks: true,
        mockReset: true,
        testTimeout: 30000, // Augmenter le timeout à 30 secondes
    },
});
