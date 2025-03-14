# Project Templates for nx-project-types

This directory contains the built-in project templates for the nx-project-types Nx plugin.

## Directory Structure

- **base/**: The base template that all other templates inherit from
  - Contains common configuration shared by all project types
  - Provides fallback values for configuration properties

- **node/**: Template for Node.js projects
  - Extends the base template
  - Contains Node.js-specific configuration and defaults

- **web/**: Template for web projects
  - Extends the base template
  - Contains web-specific configuration and defaults

- **react/**: Template for React projects
  - Extends the web template
  - Contains React-specific configuration and defaults

- **angular/**: Template for Angular projects
  - Extends the web template
  - Contains Angular-specific configuration and defaults

## Template Inheritance

Templates follow an inheritance hierarchy, where more specific templates extend more general ones:

```
base
├── node
└── web
    ├── react
    └── angular
```

## Creating a New Template

To create a new template:

1. Create a new directory in the `templates/` directory
2. Create a `project-type.json` file that specifies:
   - The template's name
   - The parent template it extends
   - Any configuration overrides

Example `project-type.json`:

```json
{
  "name": "my-template",
  "extends": "base",
  "config": {
    "build": {
      "executor": "@nx/js:tsc",
      "options": {
        "main": "src/index.ts",
        "outputPath": "dist/{projectName}"
      }
    }
  }
}
```

3. Add any template files that should be copied when applying the template
   - Files in the template directory will be copied to the target project
   - Files can use Nx template variables (e.g., `__projectName__`)

## Using Templates

Templates are used when creating new projects or applying project types to existing projects:

```bash
nx g @nx/plugin:generator-project my-app --project-type=react
```

## Best Practices

- Keep templates modular and focused on specific project types
- Use inheritance to avoid duplication between templates
- Document template-specific configuration options
- Test templates regularly to ensure they work with current Nx versions 
