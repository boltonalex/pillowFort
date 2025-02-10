import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom', // ✅ Ensures document & window are available
    setupFiles: './setupTests.ts', // ✅ Runs setup before tests
  },
});