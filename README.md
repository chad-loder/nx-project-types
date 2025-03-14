# nx-project-types

> Project type inheritance system for Nx workspaces

## Description

`nx-project-types` is an Nx plugin that allows you to define project types with predefined configurations, templates, and behaviors. You can apply these types to projects in your Nx workspace, ensuring consistency and making it easier to manage and scale your workspace.

## Installation

```bash
npm install --save-dev nx-project-types
# or
yarn add --dev nx-project-types
# or
pnpm add -D nx-project-types
```

## Features

- **Project Type Definitions**: Define reusable project configurations as types
- **Type Inheritance**: Apply project types to projects to inherit configuration
- **Configuration Syncing**: Automatically sync configuration when project types are updated
- **Tag-Based Matching**: Match projects to types based on their tags
- **Template Support**: Use templates for consistent project structure

## Usage

### Register the Plugin

Register the plugin in your Nx workspace by running:

```bash
nx g nx-project-types:register
```

This will add the plugin to your nx.json file.

### Apply a Project Type

Apply a project type to a specific project:

```bash
nx g nx-project-types:apply-project-type --project=myproject --type=webapi
```

### Sync Project Types

Sync project types across all projects based on their tags:

```bash
nx g nx-project-types:sync-project-types
```

## Project Type Definition

Project types are defined in the `project-type.json` files in your Nx workspace. For example:

```json
{
  "name": "webapi",
  "description": "Web API project",
  "tags": ["scope:api", "type:webapi"],
  "templateDir": "templates/webapi",
  "config": {
    "targets": {
      "build": {
        "executor": "@nrwl/js:tsc",
        "options": {
          "tsConfig": "tsconfig.lib.json"
        }
      }
    }
  }
}
```

## Development

This project is structured as a standard Nx workspace:

```
nx-project-types/
├── libs/
│   └── nx-project-types/  # Main plugin code
├── docs/                  # Documentation
├── examples/              # Example projects
├── tests/                 # Test files
└── nx.json                # Nx configuration
```

### Building

```bash
# Build the plugin
pnpm build

# Run tests
pnpm test

# Lint the code
pnpm lint
```

## Documentation

For more information, see the [documentation](./docs/README.md).

## License

UNLICENSED - Internal use only
