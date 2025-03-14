# nx-project-types Architecture

This document provides an overview of the nx-project-types plugin architecture, describing its components, directory structure, and how they work together.

## Directory Structure

The nx-project-types plugin follows this directory structure:

```
nx-project-types/
├── src/                  # Source code
│   ├── executors/        # Executors (for nx run/execute commands)
│   │   └── register/     # Register executor for running arbitrary commands
│   ├── generators/       # Generators (for nx generate commands)
│   │   ├── apply-project-type/   # Apply project type generator
│   │   └── sync-project-types/   # Sync project types generator
│   └── lib/              # Shared utilities and core functionality
├── templates/            # Project type templates
│   ├── base/             # Base project type (foundation for all others)
│   ├── node/             # Node.js project type
│   ├── web/              # Web project type
│   ├── react/            # React project type
│   └── angular/          # Angular project type
├── tests/                # Tests
│   ├── e2e/              # End-to-end tests
│   ├── fixtures/         # Test fixtures
│   │   └── project-types/# Sample project type definitions for testing
│   ├── integration/      # Integration tests
│   ├── sandbox/          # Manual testing sandbox (gitignored)
│   └── unit/             # Unit tests
├── docs/                 # Documentation
│   ├── architecture/     # Architecture documentation
│   └── testing/          # Testing documentation
├── package.json          # Package configuration
├── project.json          # Nx project configuration
└── rollup.config.js      # Build configuration
```

## Core Components

### 1. Project Type Templates

Project types are defined in the `templates/` directory. Each project type:
- Has a `project-type.json` file defining its configuration
- May extend other project types through inheritance
- Contains template files that are copied when applied to a project
- Defines targets, configurations, and dependencies

Example project type hierarchy:
```
base
├── node
└── web
    ├── react
    └── angular
```

### 2. Generators

Generators allow users to apply project types to their projects:

#### apply-project-type
- Applies a specific project type to a project
- Merges project type configuration with existing project configuration
- Copies template files to project directory if needed
- Located at `src/generators/apply-project-type`

#### sync-project-types
- Synchronizes all projects with their associated project types
- Updates projects when project type templates change
- Located at `src/generators/sync-project-types`

### 3. Executors

Executors provide runtime functionality:

#### register
- Provides a simple executor to run arbitrary commands
- Used for custom scripts like the "nuke" command for aggressive cleanup
- Located at `src/executors/register`

### 4. Utility Libraries

The `src/lib` directory contains utility functions for:
- Loading and parsing project type definitions
- Merging configurations
- Resolving project type inheritance
- Handling file operations
- Managing project metadata

## Data Flow

1. **Project Type Definition**: Project types are defined in template directories
2. **Registration**: The plugin is registered with the Nx workspace
3. **Application**: Project types are applied to projects using generators
4. **Synchronization**: Projects are kept in sync with their project types when templates change

## Integration with Nx

The plugin integrates with Nx through:
- `executors.json` - Defines available executors
- `generators.json` - Defines available generators
- Plugin entry points that register with the Nx CLI
- Project tags that associate projects with specific project types

## Testing Structure

Tests are organized into:
- **Unit Tests**: Test individual functions and utilities in isolation
- **Integration Tests**: Test how different parts of the plugin work together
- **E2E Tests**: Test the full functionality of the plugin in a real Nx workspace
- **Fixtures**: Provide test data for tests (including sample project types)
- **Sandbox**: A space for manual testing and experimentation (gitignored)

## Configuration Schema

Project types follow this configuration schema:

```json
{
  "name": "project-type-name",
  "description": "Description of the project type",
  "extends": "parent-project-type",
  "config": {
    "targets": {
      "build": {
        "executor": "@nx/js:tsc",
        "options": {
          // Build options
        },
        "configurations": {
          "production": {
            // Production-specific options
          },
          "development": {
            // Development-specific options
          }
        }
      },
      // Other targets like lint, test, nuke, etc.
    },
    "tags": ["scope:lib", "type:node"]
  },
  "files": [
    "README.md.template",
    "src/template-file.ts"
  ]
}
```

## Build System

The project uses:
- Rollup for bundling the plugin
- TypeScript for type checking
- Vitest for testing
- pnpm as the package manager

## Further Reading

- [Project Type Inheritance](./project-type-inheritance.md)
- [Project Type Implementation Guide](./project-type-implementation-guide.md)
- [Project Type Quickstart](./project-type-quickstart.md)
- [Testing Documentation](../testing/index.md) 
