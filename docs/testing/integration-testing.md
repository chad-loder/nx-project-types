# Integration Testing

Integration tests verify that different parts of the plugin work together correctly. These tests are more comprehensive than unit tests but still run in a controlled environment.

## Directory Structure

Integration tests are located in the `tests/integration` directory:

```
tests/
├── integration/
│   ├── vitest.config.ts              # Vitest configuration for integration tests
│   ├── simple.spec.ts                # Example basic integration test
│   └── apply-project-type.spec.ts    # Tests for apply-project-type generator
```

## Configuration

Integration tests use Vitest as the test runner with a slightly different configuration than unit tests. The configuration is defined in `tests/integration/vitest.config.ts`:

```typescript
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
```

Note the increased timeout (30 seconds) to accommodate longer-running tests.

## Running Integration Tests

To run all integration tests:

```bash
pnpm test:integration
```

## Writing Integration Tests

Integration tests often involve testing multiple components working together. Here's an example that tests a generator:

```typescript
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';
import { describe, it, expect, beforeEach } from 'vitest';

import { applyProjectTypeGenerator } from '../../src/generators/apply-project-type';

describe('apply-project-type generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    
    // Set up test environment
    // ...
  });

  it('should apply the project type configuration to the project', async () => {
    await applyProjectTypeGenerator(tree, {
      project: 'test-app',
      projectType: 'node'
    });

    // Verify results
    const config = readProjectConfiguration(tree, 'test-app');
    expect(config.targets?.build).toBeDefined();
    // ...
  });
});
```

## Testing with Fixtures

Integration tests often use fixtures to provide test data. Here's an example:

```typescript
import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('File operations', () => {
  it('should read and write files', () => {
    // Create a temporary file
    const tempDir = path.join(__dirname, '..', 'fixtures');
    const tempFile = path.join(tempDir, 'temp-test.txt');
    
    // Write to the file
    fs.writeFileSync(tempFile, 'Hello, world!');
    
    // Read from the file
    const content = fs.readFileSync(tempFile, 'utf8');
    
    // Verify the content
    expect(content).toBe('Hello, world!');
    
    // Clean up
    fs.unlinkSync(tempFile);
  });
});
```

## Best Practices

- Test realistic workflows that involve multiple components
- Use fixtures for test data
- Clean up after tests (remove temporary files, etc.)
- Consider using mock for external dependencies when appropriate
- Keep tests focused on integration points
- Document complex test setups 
