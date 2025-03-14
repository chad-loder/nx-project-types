# End-to-End Testing

End-to-end (E2E) tests verify that the plugin works correctly in a real Nx workspace. These tests simulate actual user workflows and validate the full functionality of the plugin.

## Directory Structure

E2E tests are located in the `tests/e2e` directory:

```
tests/
├── e2e/
│   ├── vitest.config.ts              # Vitest configuration for e2e tests
│   └── apply-project-type.spec.ts    # E2E test for apply-project-type generator
```

## Configuration

E2E tests use Vitest as the test runner with a configuration that allows for longer-running tests. The configuration is defined in `tests/e2e/vitest.config.ts`:

```typescript
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
```

Note the increased timeout (120 seconds) to accommodate longer-running tests that involve creating real workspaces and running actual CLI commands.

## Running E2E Tests

To run all E2E tests:

```bash
pnpm test:e2e
```

## Writing E2E Tests

E2E tests typically involve:

1. Creating a temporary workspace
2. Installing the plugin
3. Running commands that use the plugin
4. Verifying the results

Here's an example:

```typescript
import { execSync } from 'child_process';
import { mkdtempSync, rmSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('nx-project-types:apply-project-type e2e', () => {
  let tmpDir: string;

  beforeAll(() => {
    // Create a temporary directory for testing
    tmpDir = mkdtempSync(join(tmpdir(), 'nx-project-types-e2e-'));
    
    // Create a new Nx workspace
    execSync('npx create-nx-workspace@latest test-workspace --preset=empty --nx-cloud=skip', {
      cwd: tmpDir,
      stdio: 'inherit',
    });
    
    // Install the nx-project-types plugin
    const pluginPath = join(process.cwd(), 'dist');
    execSync(`npm install --save-dev ${pluginPath}`, {
      cwd: join(tmpDir, 'test-workspace'),
      stdio: 'inherit',
    });
    
    // Create required test setup
    // ...
  });

  afterAll(() => {
    // Clean up the temporary directory
    try {
      rmSync(tmpDir, { recursive: true, force: true });
    } catch (e) {
      console.error(`Failed to remove temporary directory: ${tmpDir}`, e);
    }
  });

  it('should apply a project type to an existing project', () => {
    // Run the generator
    const result = execSync('npx nx g nx-project-types:apply-project-type --project=test-lib --project-type=node', {
      cwd: join(tmpDir, 'test-workspace'),
      encoding: 'utf8',
    });

    // Verify the output
    expect(result).toContain('Successfully applied project type node to test-lib');
    
    // Verify changes to files
    const projectJson = JSON.parse(
      execSync('cat libs/test-lib/project.json', {
        cwd: join(tmpDir, 'test-workspace'),
        encoding: 'utf8',
      })
    );
    
    // Check the changes
    expect(projectJson.targets.serve).toBeDefined();
    // ...
  });
});
```

## Best Practices

- Use temporary directories for testing
- Clean up after tests
- Test realistic user workflows
- Use reasonable timeouts for long-running operations
- Isolate tests from each other
- Verify outputs and side effects
- Document the test setup and workflow

## Troubleshooting

E2E tests can be more difficult to debug because they involve multiple processes and external dependencies. Here are some tips for troubleshooting:

- Add more detailed logging during test setup
- Run commands manually to verify they work
- Check temporary directories for unexpected files or configurations
- Increase timeouts for slow operations
- Consider adding `--verbose` flags to Nx commands for more output 
