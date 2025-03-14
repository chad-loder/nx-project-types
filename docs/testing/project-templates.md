# Project Templates

Project templates define different project types that can be applied to projects in an Nx workspace. This document describes how project templates are organized and tested.

## Directory Structure

Project templates are located in the `templates` directory:

```
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

## Template Inheritance

Templates follow an inheritance hierarchy, where more specific templates extend more general ones:

```
base
├── node
└── web
    ├── react
    └── angular
```

Each template can extend a parent template by specifying the `extends` property in its `project-type.json` file.

## Template Definition

Each template includes a `project-type.json` file that defines:

- The template's name
- The parent template it extends (optional)
- Configuration overrides
- Files to be copied when applying the template

### Example: Base Template

The base template (`templates/base/project-type.json`) provides common configuration that all other templates inherit:

```json
{
  "name": "base",
  "description": "Base project type with common configuration",
  "config": {
    "targets": {
      "build": {
        "executor": "@nx/js:tsc",
        "options": {
          "outputPath": "dist/{projectName}",
          "main": "src/index.ts",
          "tsConfig": "tsconfig.lib.json",
          "assets": ["README.md"]
        },
        "configurations": {
          "production": {
            "minify": true,
            "sourceMap": false
          },
          "development": {
            "minify": false,
            "sourceMap": true
          }
        }
      },
      "lint": {
        "executor": "@nx/eslint:lint",
        "options": {
          "lintFilePatterns": ["src/**/*.ts"]
        }
      },
      "test": {
        "executor": "@nx/jest:jest",
        "options": {
          "jestConfig": "jest.config.ts",
          "passWithNoTests": true
        }
      },
      "nuke": {
        "executor": "nx-project-types:register",
        "options": {
          "command": "rm -rf node_modules dist tmp"
        }
      }
    },
    "tags": ["scope:lib"]
  },
  "files": [
    "README.md.template",
    ".eslintrc.json",
    "tsconfig.json",
    "tsconfig.lib.json",
    "jest.config.ts"
  ]
}
```

### Example: Node Template

The Node.js template (`templates/node/project-type.json`) extends the base template and adds Node.js-specific configuration:

```json
{
  "name": "node",
  "description": "Node.js project with TypeScript support",
  "extends": "base",
  "config": {
    "targets": {
      "build": {
        "options": {
          "assets": [
            "README.md",
            {
              "glob": "**/*",
              "input": "./bin",
              "output": "./bin"
            }
          ]
        }
      },
      "serve": {
        "executor": "@nx/js:node",
        "options": {
          "buildTarget": "{projectName}:build",
          "watch": true
        }
      }
    },
    "tags": ["scope:lib", "type:node"]
  },
  "files": [
    "bin/cli.js.template",
    "src/cli.ts.template",
    "nodemon.json"
  ]
}
```

## Testing Project Templates

Project templates are tested at different levels:

1. **Unit Tests**: Test the loading and parsing of project type definitions
2. **Integration Tests**: Test the application of project types to projects
3. **E2E Tests**: Test the full workflow of applying project types in a real Nx workspace

### Unit Testing Example

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getProjectType, matchProjectType } from '../../src/lib/project-type-utils';

describe('Project Type Utils', () => {
  // ...

  describe('getProjectType', () => {
    it('should get project type by name', () => {
      const projectType = getProjectType('node');
      
      expect(projectType).toBeDefined();
      expect(projectType?.name).toBe('node');
      expect(projectType?.extends).toBe('base');
    });
  });

  // ...
});
```

### Integration Testing Example

```typescript
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';
import { describe, it, expect, beforeEach } from 'vitest';

import { applyProjectTypeGenerator } from '../../src/generators/apply-project-type';

describe('apply-project-type generator', () => {
  let tree: Tree;

  beforeEach(() => {
    // Setup workspace and test project
    // ...
  });

  it('should apply the project type configuration to the project', async () => {
    await applyProjectTypeGenerator(tree, {
      project: 'test-app',
      projectType: 'node'
    });

    const config = readProjectConfiguration(tree, 'test-app');
    
    // Verify configuration was applied
    // ...
  });
});
```

## Best Practices

- Keep templates modular and focused on specific project types
- Use inheritance to avoid duplication between templates
- Document template-specific configuration options
- Test templates regularly to ensure they work with current Nx versions
- Follow a consistent naming convention for templates
- Keep template files in version control 
