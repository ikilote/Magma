// vitest.config.ts
export default defineConfig({
    test: {
        globals: true, // <--- INDISPENSABLE
        browser: {
            enabled: true,
            name: 'chromium',
            provider: 'playwright',
            headless: true,
        },
        setupFiles: ['./src/test-setup.ts'],
    },
});
