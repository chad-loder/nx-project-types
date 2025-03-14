# nx-project-types Documentation

This directory contains documentation for the nx-project-types plugin.

## Table of Contents

- [Project Types](./project-types.md)
- [Generators](./generators.md)
- [Executors](./executors.md)
- [API Reference](./api-reference.md)
- [Examples](./examples.md)
- [Testing](./testing/index.md)

## Overview

The nx-project-types plugin provides a way to define project types that can be applied to projects in an Nx workspace. This allows for standardization across projects, making it easier to manage and scale your workspace.

### Architecture

The plugin consists of the following components:

1. **Generators**: Apply project types and sync configuration
2. **Executors**: Register the plugin with the workspace
3. **Utilities**: Functions for working with project types
4. **Configuration**: JSON files that define project types

### Project Type Definition

A project type is defined in a `project-type.json` file in your Nx workspace configuration. The file contains:

- Name and description of the project type
- Tags that identify projects of this type
- Template directory for files to copy when applying the type
- Configuration to merge into project.json
- Executors and generators to apply

### Usage Flow

1. Define project types in your workspace configuration
2. Register the plugin with your Nx workspace
3. Apply project types to projects using the generators
4. Sync project types across all projects when needed

### Testing

The plugin uses Vitest for unit, integration, and end-to-end testing. See the [Testing](./testing/index.md) section for details on how to run tests and add new ones.

For more detailed information, see the specific documentation pages listed in the Table of Contents.
