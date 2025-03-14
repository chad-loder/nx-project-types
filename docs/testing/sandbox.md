# Testing Sandbox

The testing sandbox is a designated area for experimentation and manual testing of the nx-project-types plugin. It is intentionally excluded from version control via `.gitignore` to allow for temporary testing without affecting the main codebase.

## Directory Structure

The sandbox is located in the `tests/sandbox` directory:

```
tests/
├── sandbox/              # Sandbox for experimentation (gitignored)
│   ├── README.md         # Documentation for sandbox usage
│   └── my-test/          # Example test workspace (not committed)
```

## Purpose

The sandbox serves several important purposes:

- Provide a space for manual testing of nx-project-types functionality
- Allow for experimentation without affecting the main codebase
- Support quick testing of features during development
- Enable reproduction of issues in a controlled environment

## Using the Sandbox

### Creating a Test Workspace

To create a test workspace for experimentation:

```bash
# Navigate to the sandbox directory
cd tests/sandbox

# Create a directory for your test
mkdir my-test
cd my-test

# Create a new Nx workspace
npx create-nx-workspace test-workspace --preset=empty

# Navigate to the workspace
cd test-workspace

# Install the local nx-project-types package
npm install --save-dev ../../../dist
```

### Testing Project Type Generation

Once you have a test workspace, you can test the project type generation functionality:

```bash
# Create a new project
npx nx g @nx/js:lib my-lib

# Apply a project type to it
npx nx g nx-project-types:apply-project-type --project=my-lib --project-type=node

# Check the results
cat libs/my-lib/project.json
```

### Testing Project Type Syncing

You can also test the project type syncing functionality:

```bash
# Create multiple projects
npx nx g @nx/js:lib lib1
npx nx g @nx/js:lib lib2
npx nx g @nx/js:lib lib3

# Apply a project type to one project
npx nx g nx-project-types:apply-project-type --project=lib1 --project-type=node

# Modify the project type template
# ... make changes to templates/node/project-type.json ...

# Sync all projects with that type
npx nx g nx-project-types:sync-project-types --project-type=node
```

## Cleanup

Since the sandbox directory is not tracked in version control, you should clean up after your tests:

```bash
# Clean up a specific test
rm -rf my-test

# Or remove everything
rm -rf *
```

## Best Practices

- Use the sandbox for experimentation and troubleshooting
- Create a separate directory for each test case
- Clean up after yourself when tests are complete
- Document reproduction steps for bugs
- Use the sandbox to verify fixes before submitting pull requests
- Keep the sandbox out of version control
- Create minimal test cases that focus on specific functionality

## When to Use the Sandbox vs. Automated Tests

- **Use the sandbox** for exploratory testing, reproducing bugs, and quick experimentation
- **Use automated tests** for verifying functionality, regression testing, and ensuring code quality

## Example Workflow

1. Identify a feature to implement or a bug to fix
2. Create a test workspace in the sandbox to explore the problem
3. Develop a solution and test it in the sandbox
4. Create automated tests based on your exploration
5. Implement the solution in the main codebase
6. Verify the solution with automated tests 
