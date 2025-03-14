# Project Type Inheritance Design Document

## Overview

This document outlines the design, architecture, and implementation plan for project type inheritance in our monorepo. The goal is to create a maintainable, configuration-driven system that allows projects to inherit configurations from template project types.

## Problem Statement

Currently, our monorepo has several project types (ai-safe, build-tool, esm-node, tools) with different configurations for TypeScript, ESLint, testing, and other tools. Managing these configurations across multiple projects is challenging:

1. Configuration duplication across similar projects
2. Difficulty maintaining consistency when configurations change
3. Complex detection logic to determine project types
4. Manual updates required when adding new project types

## Design Decision

After evaluating multiple approaches, we've decided to implement project type inheritance using:

1. **Template-Based Approach**: Define template configurations in `workspace/config/<project-type>/` directories
2. **Tag-Based Type Selection**: Use project tags to identify which template to apply
3. **Nx Generators**: Leverage Nx's generator framework for template processing and configuration merging
4. **Sync Generator**: Create a sync generator that automatically applies templates based on tags

This approach was chosen over alternatives because it:

1. Uses standard Nx features (generators, tags)
2. Provides explicit configuration through templates
3. Requires minimal custom code
4. Is easy to maintain and extend
5. Follows Nx's best practices

## Architecture

### Directory Structure

```
workspace/config/
├── ai-safe/                  # AI-safe project type
│   ├── project-type.json     # Project type metadata
│   ├── templates/            # Template files
│   │   ├── project.json.template
│   │   └── tsconfig.json.template
│   ├── eslint.config.js      # Actual config files
│   ├── tsconfig.json
│   └── vitest.config.ts
├── build-tool/               # Build tool project type
│   ├── project-type.json
│   ├── templates/
│   │   ├── project.json.template
│   │   └── tsconfig.json.template
│   ├── eslint.config.js
│   ├── tsconfig.json
│   └── jest.config.js
└── ...
```

### Key Components

1. **Project Type Definition**: `project-type.json` defines metadata for each project type
2. **Template Files**: `.template` files in the `templates/` directory
3. **Apply Generator**: Applies a project type to a specific project
4. **Sync Generator**: Automatically applies project types based on tags

### Configuration Flow

1. Project defines its type via tags (e.g., `"tags": ["ai-safe"]`)
2. Sync generator identifies the matching project type
3. Template files are processed with project-specific variables
4. Configurations are merged, with project-specific overrides taking precedence
5. Updated configurations are written back to the project

## Implementation Plan

### Phase 1: Basic Implementation (Day 1)

1. **Create Project Type Template Structure**

   - Set up directory structure for one project type (ai-safe)
   - Create basic `project-type.json` and `project.json.template`

2. **Implement Apply Generator**
   - Create generator to apply a project type to a specific project
   - Implement template processing and configuration merging
   - Test on a single project

### Phase 2: Sync Generator (Day 2)

3. **Implement Sync Generator**

   - Create generator to automatically apply project types based on tags
   - Implement project type discovery and matching
   - Test with dry run option

4. **Add More Project Types**
   - Create templates for other project types (build-tool, esm-node, tools)
   - Test with different project types

### Phase 3: Integration and Enhancement (Day 3)

5. **Register as Nx Sync Generator**

   - Configure to run automatically with `nx sync`
   - Test automatic synchronization

6. **Enhance Templates**

   - Add more configuration templates (tsconfig, eslint, test)
   - Implement handling for different test frameworks

7. **Documentation and Refinement**
   - Update documentation
   - Refine based on testing feedback

## Technical Details

### Project Type Definition (`project-type.json`)

```json
{
  "name": "ai-safe",
  "description": "AI operational code with strict functional programming constraints",
  "version": "1.0.0",
  "tags": ["ai-safe", "ai", "model"],
  "testFramework": "vitest"
}
```

### Project Template (`project.json.template`)

```json
{
  "name": "<%= projectName %>",
  "sourceRoot": "<%= projectRoot %>/src",
  "projectType": "library",
  "tags": ["ai-safe"<% if (additionalTags) { %>, <%= additionalTags %><% } %>],
  "targets": {
    "build": {
      "executor": "@nrwl/js:tsc",
      "outputs": ["{options.outputPath}"],
      "options": {
        "outputPath": "dist/<%= projectRoot %>",
        "tsConfig": "<%= projectRoot %>/tsconfig.json",
        "main": "<%= projectRoot %>/src/index.ts",
        "assets": ["<%= projectRoot %>/*.md"]
      }
    },
    "lint": {
      "executor": "nx:run-commands",
      "options": {
        "command": "eslint --config workspace/config/ai-safe/eslint.config.js <%= projectRoot %>/**/*.ts"
      }
    },
    "test": {
      "executor": "nx:run-commands",
      "options": {
        "commands": ["vitest run --config workspace/config/ai-safe/vitest.config.ts"],
        "passWithNoTests": true
      }
    }
  }
}
```

### Apply Generator Implementation

The apply generator will:

1. Read the project configuration
2. Load the project type template
3. Process the template with project-specific variables
4. Merge the template with the existing configuration
5. Write the updated configuration back to the project

### Sync Generator Implementation

The sync generator will:

1. Discover all project types in the `workspace/config/` directory
2. Get all projects in the workspace
3. Match projects to project types based on tags
4. Apply the appropriate project type to each project

### Configuration Merging Logic

When merging configurations:

1. Project-specific properties override template properties
2. Tags are combined (template tags + project tags)
3. Targets are merged, with project-specific targets taking precedence
4. Dependencies are combined

## Benefits

1. **Reduced Configuration Duplication**: Templates provide a single source of truth
2. **Improved Maintainability**: Changes to a project type only need to be made in one place
3. **Self-Documentation**: Templates serve as documentation for each project type
4. **Consistency**: Ensures all projects of the same type have consistent configuration
5. **Flexibility**: Easy to add new project types or modify existing ones
6. **Standard Approach**: Uses Nx's built-in features and follows best practices

## Future Enhancements

1. **Versioned Templates**: Add version tracking for templates
2. **Migration Support**: Add support for migrating between project types
3. **UI Integration**: Add Nx Console UI support for managing project types
4. **Validation**: Add validation for project configurations against templates
5. **Dependency Management**: Automatically manage dependencies based on project type

## Conclusion

This project type inheritance approach provides a clean, maintainable solution for managing project configurations in our monorepo. By leveraging Nx's generator framework and following a template-based approach, we can ensure consistency across projects while maintaining flexibility for project-specific customizations.
