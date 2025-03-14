# Test Fixtures

This directory contains test fixtures used by the tests for nx-project-types.

## Directory Structure

- **project-types/**: Contains sample project type definitions for testing
  - These are used to test the project type inheritance system
  - Each subdirectory represents a different project type

## Usage

Fixtures are used in tests to provide consistent test data. They should be:

1. **Immutable** - Don't modify fixtures during tests
2. **Isolated** - Each fixture should be independent
3. **Minimal** - Include only what's needed for the test
4. **Documented** - Include a README in each fixture directory

## Adding New Fixtures

When adding a new fixture:

1. Create a new directory with a descriptive name
2. Add a README.md explaining the fixture's purpose
3. Add the necessary files for the fixture
4. Reference the fixture in your tests

## Example

```typescript
// In a test file
import { readFileSync } from 'fs';
import { join } from 'path';

const fixtureDir = join(__dirname, '../fixtures/project-types/react-app');
const projectTypeJson = JSON.parse(
  readFileSync(join(fixtureDir, 'project-type.json'), 'utf8')
);

// Use the fixture in your test
expect(projectTypeJson.name).toBe('react-app');
``` 
