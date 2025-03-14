import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '../../vitest.config';

export default mergeConfig(baseConfig, defineConfig({
  test: {
    name: 'unit',
    include: ['tests/unit/**/*.spec.ts'],
    coverage: {
      reportsDirectory: '../../coverage/unit',
    },
  },
}));
