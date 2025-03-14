import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '../../vitest.config';

export default mergeConfig(baseConfig, defineConfig({
  test: {
    name: 'integration',
    include: ['tests/integration/**/*.spec.ts'],
    coverage: {
      reportsDirectory: '../../coverage/integration',
    },
    // Integration tests might take longer to run
    testTimeout: 30000,
  },
}));
