import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '../../vitest.config';

export default mergeConfig(baseConfig, defineConfig({
  test: {
    name: 'e2e',
    include: ['tests/e2e/**/*.spec.ts'],
    coverage: {
      reportsDirectory: '../../coverage/e2e',
    },
    // E2E tests can take a long time to run
    testTimeout: 180000, // 3 minutes max timeout
    hookTimeout: 60000,  // 1 minute for hooks
    setupFiles: ['../setup.ts'],
    // Ensure we have enough memory for Nx processes
    pool: 'forks', // Use forks for more memory isolation
    isolate: true, // Isolate tests to avoid interference
  },
}));
