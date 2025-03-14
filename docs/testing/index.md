# Testing Framework

This document describes the testing framework for the nx-project-types Nx plugin.

## Overview

The nx-project-types plugin uses Vitest for testing. The testing framework is organized into three main categories:

- **Unit Tests** - Test individual functions and utilities
- **Integration Tests** - Test how different parts of the plugin work together
- **End-to-End Tests** - Test the full functionality of the plugin in a real Nx workspace

## Directory Structure

```
tests/
├── e2e/                  # End-to-end tests
│   ├── vitest.config.ts  # Vitest configuration for e2e tests
│   └── *.spec.ts         # E2E test files
├── fixtures/             # Test fixtures
│   ├── project-types/    # Sample project type definitions
│   │   └── react-app/    # React app project type fixture
│   └── README.md         # Documentation for fixtures
├── integration/          # Integration tests
│   ├── vitest.config.ts  # Vitest configuration for integration tests
│   └── *.spec.ts         # Integration test files
├── sandbox/              # For experimentation (gitignored)
│   └── README.md         # Documentation for sandbox usage
├── unit/                 # Unit tests
│   ├── vitest.config.ts  # Vitest configuration for unit tests
│   └── *.spec.ts         # Unit test files
├── setup.ts              # Global test setup
├── .gitignore            # Git ignore for tests
└── README.md             # Documentation for tests

templates/
├── base/                 # Base project type
│   └── project-type.json # Base project type definition
├── node/                 # Node.js project type
│   └── project-type.json # Node project type definition
├── web/                  # Web project type
│   └── project-type.json # Web project type definition
├── react/                # React project type
├── angular/              # Angular project type
├── .gitignore            # Git ignore for templates
└── README.md             # Documentation for templates
```

## Running Tests

All tests can be run using the npm scripts defined in `package.json`:

```bash
# Run all tests
pnpm test:all

# Run only unit tests
pnpm test:unit

# Run only integration tests
pnpm test:integration

# Run only e2e tests
pnpm test:e2e

# Run tests with the Vitest UI
pnpm test:ui

# Generate code coverage reports
pnpm test:coverage
```

## In This Section

- [Unit Testing](./unit-testing.md) - How to write and run unit tests
- [Integration Testing](./integration-testing.md) - How to write and run integration tests
- [E2E Testing](./e2e-testing.md) - How to write and run end-to-end tests
- [Fixtures](./fixtures.md) - How to use test fixtures
- [Project Templates](./project-templates.md) - How project templates are organized and tested
- [Sandbox](./sandbox.md) - How to use the sandbox for experimentation

## Best Practices

- Keep tests isolated and independent from each other
- Clean up after tests (remove temporary files, etc.)
- Use fixtures for common test data
- Write tests that are easy to understand and maintain
- Comment complex test logic for future maintenance 
