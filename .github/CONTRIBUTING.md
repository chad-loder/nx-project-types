# Contributing to nx-project-types

Thank you for your interest in contributing to nx-project-types! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our code of conduct: be respectful, considerate, and collaborative.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm 10 or higher
- Git

### Setting Up the Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone git@github.com:YOUR_USERNAME/nx-project-types.git
   cd nx-project-types
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Build the project:
   ```bash
   pnpm build
   ```

## Development Workflow

### Branching Strategy

We use a hybrid approach combining trunk-based development with semantic versioning:

- `main`: Main development branch, always in a releasable state
- `feature/*`: Short-lived feature branches (1-2 days max)
- `bugfix/*`: Short-lived bug fix branches
- `release/*`: Short-lived release branches
- `hotfix/*`: Urgent fixes for production

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/my-feature main
   ```
2. Make your changes and write tests
3. Run tests:
   ```bash
   pnpm test:unit
   ```
4. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat: add new feature"
   ```
5. Push to your fork:
   ```bash
   git push -u origin feature/my-feature
   ```
6. Create a Pull Request from your branch to the main repo's `main` branch

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

Example:
```
feat(executor): add support for custom project types
```

### Testing

- Write unit tests for all new features and bug fixes
- Run existing tests before submitting a PR:
  ```bash
  pnpm test:unit
  ```
- For more extensive testing, use:
  ```bash
  pnpm test:all
  ```

### Local Testing with Verdaccio

To test your changes locally with Verdaccio:

```bash
./scripts/test-publish.sh beta.1
```

This will:
1. Start Verdaccio if it's not running
2. Build the project
3. Publish it to your local registry
4. Install it in a test project to verify it works

## Release Process

Releases are managed using the Nx release tooling:

1. Ensure all tests pass and the build is successful
2. Create a release:
   ```bash
   npx nx release
   ```
3. The release will be automatically published to npm via GitHub Actions

## Documentation

Please update documentation when you make changes to code:

- Update code comments and JSDoc
- Update relevant documentation in the `docs/` directory
- Update examples if necessary

## Need Help?

If you have any questions or need help with the contribution process, please open an issue or reach out to the maintainers.

Thank you for contributing to nx-project-types! 
