# Test Fixtures

Test fixtures provide consistent test data that can be used across multiple tests. This helps ensure tests are reliable and makes them easier to maintain.

## Directory Structure

Fixtures are located in the `tests/fixtures` directory:

```
tests/
├── fixtures/
│   ├── project-types/               # Sample project type definitions
│   │   ├── react-app/               # React app project type fixture
│   │   │   ├── project-type.json    # Project type definition
│   │   │   └── README.md            # Documentation for the fixture
│   │   └── README.md                # Documentation for project types
│   └── README.md                    # Documentation for fixtures
```

## Using Fixtures in Tests

Fixtures can be used in tests by importing them directly or by reading them from the file system:

```typescript
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Project Type Utils', () => {
  it('should load project type from fixture', () => {
    const fixtureDir = join(__dirname, '..', 'fixtures', 'project-types', 'react-app');
    const projectTypeJson = JSON.parse(
      readFileSync(join(fixtureDir, 'project-type.json'), 'utf8')
    );
    
    expect(projectTypeJson.name).toBe('react-app');
    expect(projectTypeJson.extends).toBe('web');
  });
});
```

## Project Type Fixtures

The project type fixtures in `tests/fixtures/project-types` are used to test the project type inheritance system. Each project type fixture includes:

1. **project-type.json**: The main configuration file defining the project type
   - `name`: The name of the project type
   - `description`: A description of the project type
   - `extends` (optional): The parent project type
   - `config`: Configuration to be applied to projects
   - `files` (optional): Files to be copied when applying the project type

2. **Template files** (optional): Files that should be copied when applying the project type

### Example: React App Project Type

The `react-app` project type in `tests/fixtures/project-types/react-app` is an example of a project type fixture:

```json
{
  "name": "react-app",
  "description": "React application with TypeScript and Webpack configuration",
  "extends": "web",
  "config": {
    "root": "{projectRoot}",
    "sourceRoot": "{projectRoot}/src",
    "projectType": "application",
    "targets": {
      "build": {
        "executor": "@nx/webpack:webpack",
        "outputs": ["{options.outputPath}"],
        "defaultConfiguration": "production",
        "options": {
          "outputPath": "dist/{projectRoot}",
          "index": "{projectRoot}/src/index.html",
          "main": "{projectRoot}/src/main.tsx",
          // ...
        }
      },
      // ...
    },
    "tags": ["scope:app", "type:react", "platform:web"]
  },
  "files": [
    "src/index.html",
    "src/main.tsx",
    "src/app/app.tsx",
    // ...
  ]
}
```

## Creating New Fixtures

When adding a new fixture:

1. Create a new directory with a descriptive name
2. Add a README.md explaining the fixture's purpose
3. Add the necessary files for the fixture
4. Reference the fixture in your tests

## Best Practices

- Keep fixtures minimal (include only what's needed for tests)
- Document fixtures to explain their purpose and structure
- Treat fixtures as immutable during tests
- Keep fixtures isolated from each other
- Organize fixtures by type (e.g., project-types, templates)
- Version fixtures along with tests 
