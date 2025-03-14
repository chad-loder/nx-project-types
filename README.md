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

## Development and Contributing

### Branching Strategy

We use a hybrid approach combining trunk-based development with semantic versioning:

- `main`: Main development branch, always in a releasable state
- `feature/*`: Short-lived feature branches (1-2 days max)
- `bugfix/*`: Short-lived bug fix branches
- `release/*`: Short-lived release branches
- `hotfix/*`: Urgent fixes for production

### Development Workflow

1. **Start a new feature/fix**:
   ```bash
   git checkout -b feature/my-feature main
   ```

2. **Make changes and commit**:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Push and create a PR**:
   ```bash
   git push -u origin feature/my-feature
   ```

4. **After review, merge into main**

### Release Process

We use [Semantic Versioning](https://semver.org/) for versioning:

- MAJOR: Incompatible API changes
- MINOR: Backward-compatible new features
- PATCH: Backward-compatible bug fixes

Our release workflow:

```bash
# Create a release
npx nx release

# Publish to npm
npx nx release publish
```

### CI/CD Workflows

We use GitHub Actions for continuous integration and delivery:

- **CI**: Runs on PRs and pushes to main, ensuring code quality
- **Release**: Triggered by version tags or manually for formal releases
- **Pre-Release**: Creates beta/RC versions for testing
- **Nightly**: Automatic builds from main every day at midnight UTC
- **Test Publishing**: Tests the publishing process with Verdaccio

For detailed information about our CI/CD setup, see [CI/CD documentation](./docs/ci-cd.md).

### Available Builds

- **Stable releases**: Published to npm with the `latest` tag
- **Beta/RC releases**: Published with `beta` or `rc` tags
- **Nightly builds**: Automatic builds from `main` with the `nightly` tag

### Local Testing

You can test the package locally using [Verdaccio](https://verdaccio.org/):

```bash
# Install Verdaccio
npm install -g verdaccio

# Start Verdaccio
verdaccio

# In a new terminal, create a user
npm adduser --registry http://localhost:4873

# Build the package
pnpm build:prod

# Publish to local registry
cd dist && npm publish --registry http://localhost:4873

# Install from local registry
npm install nx-project-types --registry http://localhost:4873
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

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
