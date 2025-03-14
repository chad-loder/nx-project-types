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
    testTimeout: 120000,
  },
}));
