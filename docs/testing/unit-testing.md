# Unit Testing

Unit tests focus on testing individual functions and utilities in isolation. They are fast to run and do not require external dependencies.

## Directory Structure

Unit tests are located in the `tests/unit` directory:

```
tests/
├── unit/
│   ├── vitest.config.ts    # Vitest configuration for unit tests
│   ├── simple.spec.ts      # Example basic test
│   └── project-type-utils.spec.ts  # Tests for project-type-utils
```

## Configuration

Unit tests use Vitest as the test runner. The configuration is defined in `tests/unit/vitest.config.ts`:

```typescript
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
```

## Running Unit Tests

To run all unit tests:

```bash
pnpm test:unit
```

## Writing Unit Tests

Unit tests should be written using Vitest's testing API. Here's an example:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { myFunction } from '../../src/lib/my-utils';

describe('My Utils', () => {
  beforeEach(() => {
    // Set up before each test
  });

  it('should do something', () => {
    const result = myFunction();
    expect(result).toBe(expectedValue);
  });
});
```

## Mocking

Vitest provides mocking capabilities to isolate the code under test. Here's an example:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fs from 'fs';

vi.mock('fs', () => ({
  readFileSync: vi.fn(),
}));

describe('File Utils', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (fs.readFileSync as any).mockReturnValue('mocked content');
  });

  it('should read file content', () => {
    const content = fs.readFileSync('path/to/file', 'utf8');
    expect(content).toBe('mocked content');
    expect(fs.readFileSync).toHaveBeenCalledWith('path/to/file', 'utf8');
  });
});
```

## Best Practices

- Focus on testing a single unit of functionality
- Use mocks to isolate the code under test
- Keep tests fast and simple
- Test edge cases and error conditions
- Maintain test independence (tests should not depend on each other) 
