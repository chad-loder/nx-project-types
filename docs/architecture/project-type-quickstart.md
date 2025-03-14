# Project Type Inheritance Quick Start Guide

This guide provides a quick overview of how to use the project type inheritance system in the nx-project-types plugin.

## What is Project Type Inheritance?

Project type inheritance allows projects to inherit configurations from predefined templates. This ensures consistency across similar projects and reduces configuration duplication.

## Available Project Types

The following project types are available:

| Type     | Description                                        | Extends | Main Features                               |
|----------|----------------------------------------------------|---------|---------------------------------------------|
| `base`   | Base configuration for all project types           | -       | Basic build, lint, test setup               |
| `node`   | Node.js projects with TypeScript support           | base    | Node.js specific build and serve targets    |
| `web`    | Web projects with browser support                  | base    | Browser-specific build configuration        |
| `react`  | React applications and libraries                   | web     | React-specific configuration and dependencies|
| `angular`| Angular applications and libraries                 | web     | Angular-specific configuration and setup    |

## How to Use

### 1. Install the Plugin

First, install the nx-project-types plugin in your Nx workspace:

```bash
pnpm add -D nx-project-types
```

### 2. Apply a Project Type to a Project

Use the `apply-project-type` generator to apply a project type to an existing project:

```bash
nx generate nx-project-types:apply-project-type --project=my-project --project-type=node
```

This will:
- Apply the node project type configuration to your project
- Copy any template files to your project
- Add the appropriate tags to your project

### 3. Sync Project Types

If you update a project type template, you can sync all projects of that type:

```bash
nx generate nx-project-types:sync-project-types --project-type=node
```

Or sync all projects with their respective project types:

```bash
nx generate nx-project-types:sync-project-types
```

### 4. Override Specific Configurations

You can override specific configurations in your project.json file:

```json
{
  "name": "my-project",
  "targets": {
    "build": {
      "options": {
        // Project-specific overrides
        "outputPath": "custom/output/path"
      }
    }
  }
}
```

Project-specific overrides take precedence over template configurations.

## Creating a New Project with a Specific Type

To create a new project with a specific type:

```bash
# Create the project
nx generate @nx/js:library my-new-project

# Apply a project type
nx generate nx-project-types:apply-project-type --project=my-new-project --project-type=node
```

## Creating Custom Project Types

You can create custom project types by extending existing ones:

1. Create a new directory in your workspace's `templates` directory:

```bash
mkdir -p templates/my-custom-type
```

2. Create a `project-type.json` file:

```json
{
  "name": "my-custom-type",
  "description": "My custom project type",
  "extends": "node",
  "config": {
    "targets": {
      "build": {
        "options": {
          // Custom build options
        }
      },
      "custom-command": {
        "executor": "nx-project-types:register",
        "options": {
          "command": "echo 'Custom command'"
        }
      }
    },
    "tags": ["scope:custom", "type:my-custom-type"]
  },
  "files": [
    "README.md.template",
    "src/index.ts.template"
  ]
}
```

3. Create any template files referenced in the `files` array

4. Apply your custom project type to a project:

```bash
nx generate nx-project-types:apply-project-type --project=my-project --project-type=my-custom-type
```

## Troubleshooting

### Project Type Not Applied

If the project type is not being applied:

1. Check that the project type exists in the templates directory
2. Ensure the project exists in the workspace
3. Check for any error messages during the generator execution

### Configuration Conflicts

If you're experiencing configuration conflicts:

1. Check your project-specific overrides
2. Ensure they don't conflict with the template configuration
3. Remember that project-specific overrides take precedence

## The "nuke" Target

All project types include a "nuke" target for aggressive cleanup:

```bash
nx run my-project:nuke
```

This will remove temporary files, node_modules, and other build artifacts from the project.

## Further Reading

For more detailed information, see:

- [Project Type Inheritance Design Document](./project-type-inheritance.md)
- [Project Type Implementation Guide](./project-type-implementation-guide.md)
- [Architecture Overview](./index.md)
- [Testing Documentation](../testing/index.md)
