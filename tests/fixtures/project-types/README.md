# Project Type Fixtures

This directory contains sample project type definitions used for testing the nx-project-types plugin.

## Available Project Types

- **react-app/**: A React application project type
  - Extends the web project type
  - Includes React-specific configuration

## Structure of a Project Type

Each project type fixture should include:

1. **project-type.json**: The main configuration file defining the project type
   - `name`: The name of the project type
   - `description`: A description of the project type
   - `extends` (optional): The parent project type
   - `config`: Configuration to be applied to projects
   - `files` (optional): Files to be copied when applying the project type

2. **Template files** (optional): Files that should be copied when applying the project type

## Example Usage in Tests

```typescript
import { getProjectType } from '../../src/lib/project-type-utils';

describe('Project Type Utils', () => {
  it('should get project type by name', () => {
    const projectType = getProjectType('react-app');
    
    expect(projectType).toBeDefined();
    expect(projectType?.name).toBe('react-app');
    expect(projectType?.extends).toBe('web');
  });
}); 
