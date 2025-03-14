# Testing Framework for nx-project-types

This directory contains the testing framework for the nx-project-types Nx plugin.

## Directory Structure

- **unit/**: Contains unit tests for individual functions and utilities
  - Focus on testing small, isolated pieces of functionality
  - Fast to run and should not require external dependencies

- **integration/**: Contains integration tests that test multiple components working together
  - Tests how different parts of the plugin interact
  - May require some external dependencies but still controlled environment

- **e2e/**: Contains end-to-end tests that verify the plugin works correctly in a real Nx workspace
  - Tests the full plugin functionality from a user's perspective
  - Simulates actual user workflows

- **fixtures/**: Contains test fixtures used by the tests
  - **project-types/**: Contains sample project type definitions for testing
  - Add other fixtures as needed (e.g., sample workspaces, configurations)

- **sandbox/**: A directory for experimentation and manual testing
  - Not included in version control (added to .gitignore)
  - Use for temporary testing and experimentation
  - Can create test Nx workspaces here to try out the plugin

## Running Tests

### Unit Tests

```bash
npm run test:unit
```

### Integration Tests

```bash
npm run test:integration
```

### E2E Tests

```bash
npm run test:e2e
```

## Creating New Tests

### Unit Tests

Create a new file in the `unit/` directory with the naming convention `*.spec.ts`.

### Integration Tests

Create a new file in the `integration/` directory with the naming convention `*.spec.ts`.

### E2E Tests

Create a new file in the `e2e/` directory with the naming convention `*.spec.ts`.

## Best Practices

- Keep tests isolated and independent from each other
- Clean up after tests (remove temporary files, etc.)
- Use fixtures for common test data
- Write tests that are easy to understand and maintain
- Comment complex test logic for future maintenance 
