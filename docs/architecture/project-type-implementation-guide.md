# Project Type Inheritance Implementation Guide

This guide provides step-by-step instructions for implementing the project type inheritance system described in the design document.

## Prerequisites

- Nx workspace
- TypeScript
- Node.js

## Step 1: Create Project Type Template Structure

### 1.1 Create Directory Structure

```bash
# Create directories for the ai-safe project type
mkdir -p workspace/config/ai-safe/templates
```

### 1.2 Create Project Type Definition

Create `workspace/config/ai-safe/project-type.json`:

```json
{
  "name": "ai-safe",
  "description": "AI operational code with strict functional programming constraints",
  "version": "1.0.0",
  "tags": ["ai-safe", "ai", "model"],
  "testFramework": "vitest"
}
```

### 1.3 Create Project Template

Create `workspace/config/ai-safe/templates/project.json.template`:

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

## Step 2: Implement Apply Generator

### 2.1 Create Generator Directory

```bash
mkdir -p workspace/build-tools/nx-build-extensions/generators/apply-project-type
```

### 2.2 Create Generator Schema

Create `workspace/build-tools/nx-build-extensions/generators/apply-project-type/schema.json`:

```json
{
  "$schema": "http://json-schema.org/schema",
  "cli": "nx",
  "$id": "ApplyProjectType",
  "title": "Apply Project Type",
  "type": "object",
  "properties": {
    "project": {
      "type": "string",
      "description": "Project name",
      "$default": {
        "$source": "argv",
        "index": 0
      }
    },
    "type": {
      "type": "string",
      "description": "Project type",
      "default": "ai-safe"
    }
  },
  "required": ["project"]
}
```

### 2.3 Create TypeScript Interface

Create `workspace/build-tools/nx-build-extensions/generators/apply-project-type/schema.ts`:

```typescript
export interface ApplyProjectTypeGeneratorSchema {
  project: string;
  type: string;
}
```

### 2.4 Implement Generator

Create `workspace/build-tools/nx-build-extensions/generators/apply-project-type/index.ts`:

```typescript
import {
  Tree,
  formatFiles,
  generateFiles,
  getProjects,
  joinPathFragments,
  readJson,
  updateJson,
} from "@nx/devkit";
import { ApplyProjectTypeGeneratorSchema } from "./schema";

export default async function applyProjectTypeGenerator(
  tree: Tree,
  options: ApplyProjectTypeGeneratorSchema
) {
  const { project, type } = options;

  // Get the project configuration
  const projects = getProjects(tree);
  const projectConfig = projects.get(project);

  if (!projectConfig) {
    throw new Error(`Project ${project} not found`);
  }

  // Get the project type template
  const templateDir = joinPathFragments("workspace/config", type, "templates");
  const projectTypePath = joinPathFragments("workspace/config", type, "project-type.json");

  if (!tree.exists(templateDir) || !tree.exists(projectTypePath)) {
    throw new Error(`Project type ${type} not found`);
  }

  // Read the project type definition
  const projectType = readJson(tree, projectTypePath);

  console.log(`Applying project type ${type} to project ${project}`);

  // Create a temporary directory for processed templates
  const tempDir = joinPathFragments("node_modules", ".tmp", project);

  // Generate the processed template
  generateFiles(tree, templateDir, tempDir, {
    projectName: project,
    projectRoot: projectConfig.root,
    additionalTags: projectConfig.tags
      ?.filter(tag => tag !== type)
      .map(tag => `"${tag}"`)
      .join(", "),
    template: "",
    dot: ".",
  });

  // Read the processed template
  const templatePath = joinPathFragments(tempDir, "project.json");
  if (tree.exists(templatePath)) {
    const template = readJson(tree, templatePath);

    // Update the project.json
    updateJson(tree, joinPathFragments(projectConfig.root, "project.json"), json => {
      // Merge the template with the existing configuration
      return {
        ...template,
        ...json,
        // Combine tags
        tags: [...new Set([...(template.tags || []), ...(json.tags || [])])],
        // Merge targets, with project-specific targets taking precedence
        targets: {
          ...(template.targets || {}),
          ...(json.targets || {}),
        },
      };
    });
  }

  await formatFiles(tree);

  return () => {
    console.log(`Successfully applied project type ${type} to project ${project}`);
  };
}
```

### 2.5 Register Generator in nx.json

Update `nx.json` to include the generator:

```json
{
  "generators": {
    "nx-build-extensions:apply-project-type": {
      "factory": "./workspace/build-tools/nx-build-extensions/generators/apply-project-type",
      "schema": "./workspace/build-tools/nx-build-extensions/generators/apply-project-type/schema.json"
    }
  }
}
```

### 2.6 Test the Generator

```bash
nx generate nx-build-extensions:apply-project-type --project=models --type=ai-safe
```

## Step 3: Implement Sync Generator

### 3.1 Create Generator Directory

```bash
mkdir -p workspace/build-tools/nx-build-extensions/generators/sync-project-types
```

### 3.2 Create Generator Schema

Create `workspace/build-tools/nx-build-extensions/generators/sync-project-types/schema.json`:

```json
{
  "$schema": "http://json-schema.org/schema",
  "cli": "nx",
  "$id": "SyncProjectTypes",
  "title": "Sync Project Types",
  "type": "object",
  "properties": {
    "dryRun": {
      "type": "boolean",
      "description": "Show what would be updated without making changes",
      "default": false
    }
  }
}
```

### 3.3 Create TypeScript Interface

Create `workspace/build-tools/nx-build-extensions/generators/sync-project-types/schema.ts`:

```typescript
export interface SyncProjectTypesGeneratorSchema {
  dryRun: boolean;
}
```

### 3.4 Implement Generator

Create `workspace/build-tools/nx-build-extensions/generators/sync-project-types/index.ts`:

```typescript
import { Tree, formatFiles, getProjects, joinPathFragments, readJson } from "@nx/devkit";
import { SyncProjectTypesGeneratorSchema } from "./schema";
import applyProjectTypeGenerator from "../apply-project-type";

export default async function syncProjectTypesGenerator(
  tree: Tree,
  options: SyncProjectTypesGeneratorSchema
) {
  const { dryRun = false } = options;

  // Get all projects
  const projects = getProjects(tree);

  // Get all project types
  const projectTypes = getProjectTypes(tree);

  console.log(
    `Found ${projectTypes.length} project types: ${projectTypes.map(t => t.name).join(", ")}`
  );

  // Track which projects were updated
  const updatedProjects = [];

  // Process each project
  for (const [projectName, projectConfig] of projects.entries()) {
    // Skip projects in the config directory
    if (projectConfig.root.startsWith("workspace/config/")) {
      continue;
    }

    // Find matching project type based on tags
    const projectType = findMatchingProjectType(projectConfig.tags, projectTypes);

    if (!projectType) {
      console.log(`No matching project type found for project ${projectName}`);
      continue;
    }

    console.log(`Project ${projectName} matches type ${projectType.name}`);

    if (!dryRun) {
      // Apply the project type
      await applyProjectTypeGenerator(tree, {
        project: projectName,
        type: projectType.name,
      });

      updatedProjects.push(projectName);
    }
  }

  if (dryRun) {
    console.log("Dry run completed. No changes were made.");
  } else {
    console.log(`Updated ${updatedProjects.length} projects: ${updatedProjects.join(", ")}`);
  }

  await formatFiles(tree);
}

function getProjectTypes(tree: Tree) {
  const projectTypes = [];
  const configDir = "workspace/config";

  // Get all directories under workspace/config
  const entries = tree.children(configDir);

  for (const entry of entries) {
    const dirPath = joinPathFragments(configDir, entry);

    // Skip if not a directory or is a special directory
    if (!tree.isDirectory(dirPath) || ["lint", "typescript", "test"].includes(entry)) {
      continue;
    }

    // Check if directory contains a project-type.json
    const projectTypePath = joinPathFragments(dirPath, "project-type.json");
    if (tree.exists(projectTypePath)) {
      const projectType = readJson(tree, projectTypePath);
      projectTypes.push({
        ...projectType,
        name: entry,
      });
    }
  }

  return projectTypes;
}

function findMatchingProjectType(tags, projectTypes) {
  if (!tags || tags.length === 0) {
    return null;
  }

  // Check for direct match with project type name
  for (const projectType of projectTypes) {
    if (tags.includes(projectType.name)) {
      return projectType;
    }
  }

  // Check for match with project type tags
  for (const projectType of projectTypes) {
    if (projectType.tags && projectType.tags.some(tag => tags.includes(tag))) {
      return projectType;
    }
  }

  return null;
}
```

### 3.5 Register Generator in nx.json

Update `nx.json` to include the generator:

```json
{
  "generators": {
    "nx-build-extensions:sync-project-types": {
      "factory": "./workspace/build-tools/nx-build-extensions/generators/sync-project-types",
      "schema": "./workspace/build-tools/nx-build-extensions/generators/sync-project-types/schema.json"
    }
  }
}
```

### 3.6 Test the Generator

```bash
# Test with dry run first
nx generate nx-build-extensions:sync-project-types --dryRun=true

# Then run for real
nx generate nx-build-extensions:sync-project-types
```

## Step 4: Add More Project Types

### 4.1 Create Build Tool Project Type

```bash
mkdir -p workspace/config/build-tool/templates
```

Create `workspace/config/build-tool/project-type.json`:

```json
{
  "name": "build-tool",
  "description": "Build system tools and utilities with specialized configuration",
  "version": "1.0.0",
  "tags": ["build-tool", "tool"],
  "testFramework": "jest"
}
```

Create `workspace/config/build-tool/templates/project.json.template`:

```json
{
  "name": "<%= projectName %>",
  "sourceRoot": "<%= projectRoot %>/src",
  "projectType": "library",
  "tags": ["build-tool"<% if (additionalTags) { %>, <%= additionalTags %><% } %>],
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
        "command": "eslint --config workspace/config/build-tool/eslint.config.js <%= projectRoot %>/**/*.ts"
      }
    },
    "test": {
      "executor": "nx:run-commands",
      "options": {
        "commands": ["jest --config workspace/config/build-tool/jest.config.js"],
        "passWithNoTests": true
      }
    }
  }
}
```

### 4.2 Create ESM Node Project Type

```bash
mkdir -p workspace/config/esm-node/templates
```

Create `workspace/config/esm-node/project-type.json`:

```json
{
  "name": "esm-node",
  "description": "Node.js with ESM modules support",
  "version": "1.0.0",
  "tags": ["esm-node", "esm"],
  "testFramework": "vitest"
}
```

Create `workspace/config/esm-node/templates/project.json.template`:

```json
{
  "name": "<%= projectName %>",
  "sourceRoot": "<%= projectRoot %>/src",
  "projectType": "library",
  "tags": ["esm-node"<% if (additionalTags) { %>, <%= additionalTags %><% } %>],
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
        "command": "eslint --config workspace/config/esm-node/eslint.config.js <%= projectRoot %>/**/*.ts"
      }
    },
    "test": {
      "executor": "nx:run-commands",
      "options": {
        "commands": ["vitest run --config workspace/config/esm-node/vitest.config.ts"],
        "passWithNoTests": true
      }
    }
  }
}
```

## Step 5: Register as Nx Sync Generator

Update `nx.json` to register the sync generator:

```json
{
  "sync": {
    "globalGenerators": ["nx-build-extensions:sync-project-types"]
  }
}
```

Test automatic synchronization:

```bash
nx sync
```

## Step 6: Enhance Templates

### 6.1 Add TypeScript Configuration Template

Create `workspace/config/ai-safe/templates/tsconfig.json.template`:

```json
{
  "extends": "../../../workspace/config/typescript/tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "files": [],
  "include": [],
  "references": [
    {
      "path": "./tsconfig.lib.json"
    },
    {
      "path": "./tsconfig.spec.json"
    }
  ]
}
```

### 6.2 Update Apply Generator to Handle Multiple Templates

Update `workspace/build-tools/nx-build-extensions/generators/apply-project-type/index.ts` to handle multiple template files:

```typescript
// Add to the existing function
function processTemplateFiles(
  tree: Tree,
  templateDir: string,
  projectConfig: any,
  projectType: any
) {
  // Get all template files
  const templateFiles = tree.children(templateDir).filter(file => file.endsWith(".template"));

  for (const templateFile of templateFiles) {
    const outputFileName = templateFile.replace(".template", "");
    const outputPath = joinPathFragments(projectConfig.root, outputFileName);

    // Process the template
    const tempDir = joinPathFragments("node_modules", ".tmp", projectConfig.name);

    // Generate the processed template file
    generateFiles(tree, templateDir, tempDir, {
      projectName: projectConfig.name,
      projectRoot: projectConfig.root,
      additionalTags: projectConfig.tags
        ?.filter(tag => tag !== projectType.name)
        .map(tag => `"${tag}"`)
        .join(", "),
      template: "",
      dot: ".",
    });

    // Read the processed template
    const processedTemplatePath = joinPathFragments(tempDir, templateFile);

    if (tree.exists(processedTemplatePath)) {
      // For JSON files, merge with existing
      if (outputFileName.endsWith(".json")) {
        updateJson(tree, outputPath, json => {
          const template = readJson(tree, processedTemplatePath);
          return mergeConfigurations(template, json);
        });
      } else {
        // For other files, just copy
        const content = tree.read(processedTemplatePath, "utf-8");
        tree.write(outputPath, content);
      }
    }
  }
}

function mergeConfigurations(template, json) {
  // Implement smart merging logic
  return {
    ...template,
    ...json,
    // Combine tags
    tags: [...new Set([...(template.tags || []), ...(json.tags || [])])],
    // Merge targets, with project-specific targets taking precedence
    targets: {
      ...(template.targets || {}),
      ...(json.targets || {}),
    },
  };
}
```

## Step 7: Documentation and Refinement

### 7.1 Update README

Create or update `workspace/config/README.md`:

````markdown
# Project Type Templates

This directory contains templates for different project types in the monorepo.

## Available Project Types

- **ai-safe**: AI operational code with strict functional programming constraints
- **build-tool**: Build system tools and utilities with specialized configuration
- **esm-node**: Node.js with ESM modules support

## How to Use

Projects can inherit from these templates by adding the appropriate tag to their `project.json` file:

```json
{
  "name": "my-project",
  "tags": ["ai-safe"]
}
```
````

The sync generator will automatically apply the template configuration to the project.

## Adding a New Project Type

1. Create a new directory under `workspace/config/`
2. Create a `project-type.json` file with metadata
3. Create template files in the `templates/` directory
4. Run `nx sync` to apply the new project type to matching projects

```

### 7.2 Refine Based on Testing Feedback

After testing, refine the implementation as needed:

- Improve error handling
- Add more detailed logging
- Enhance template processing
- Add support for more configuration files

## Conclusion

This implementation guide provides a step-by-step approach to implementing the project type inheritance system. By following these steps, you can create a maintainable, configuration-driven system that allows projects to inherit configurations from template project types.

The implementation leverages Nx's generator framework and follows a template-based approach, ensuring consistency across projects while maintaining flexibility for project-specific customizations.
```
