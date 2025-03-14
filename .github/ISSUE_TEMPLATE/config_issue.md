---
name: Configuration Issue
about: Report issues with project type configurations or inheritance
title: '[CONFIG] '
labels: configuration
assignees: ''
---

## Describe the configuration issue
A clear and concise description of what the configuration problem is.

## Current Configuration
Please provide your current project type configuration:

```json
// project-type.json
{
  "name": "example",
  "description": "Example project type",
  "tags": ["type:example"],
  "config": {
    // ...
  }
}
```

## Target Project Configuration
If applicable, provide the target project's configuration that's experiencing issues:

```json
// project.json
{
  "name": "my-project",
  "projectType": "application",
  "tags": ["type:example"],
  // ...
}
```

## Expected Behavior
A clear and concise description of what you expected to happen with this configuration.

## Actual Behavior
What actually happens with this configuration?

## Inheritance Chain
If this is an inheritance issue, describe the inheritance chain (parent types, etc.):

- Base type: `baseType`
- Extends: `intermediateType`
- Target type: `myType`

## Reproduction Steps
Steps to reproduce the behavior:
1. Define project types with '...'
2. Apply to project '....'
3. Run command '....'
4. See issue

## Environment Information
- Nx Version: [e.g. 17.2.0]
- nx-project-types Version: [e.g. 1.0.0]
- Node.js Version: [e.g. 18.12.0]

## Additional context
Add any other context about the configuration issue here. 
