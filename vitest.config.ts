// vitest.config.ts
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true, // <--- INDISPENSABLE
        browser: {
            enabled: true,
            provider: playwright(),
            instances: [
                {
                    browser: 'chromium',
                    headless: true,
                },
            ],
        },
        setupFiles: ['./src/test-setup.ts'],
    },
});
