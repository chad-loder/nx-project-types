# CI/CD Workflows

This document explains the Continuous Integration and Continuous Delivery/Deployment (CI/CD) workflows for the `nx-project-types` repository.

## Overview

The repository uses GitHub Actions workflows for CI/CD. The following workflows are available:

1. **CI Workflow**: Runs on pull requests to main and pushes to the main branch
2. **Release Workflow**: Triggered on version tag pushes or manually
3. **Pre-Release Workflow**: Manually triggered for creating beta/RC releases
4. **Nightly Build Workflow**: Runs automatically at midnight UTC or manually
5. **Test Publishing Workflow**: Manually triggered to test the publishing process

## CI Workflow

**File**: `.github/workflows/ci.yml`

The CI workflow is responsible for validating changes in pull requests and the main branch by running linting, building, and testing tasks.

**Trigger**:
- Pull requests targeting the main branch
- Pushes to the main branch
- Manual trigger via GitHub UI

**Key Features**:
- Uses Nx for efficient caching and parallel task execution
- Lints, builds, and tests affected projects
- Creates a PR preview build with a versioned package for testing
- Uploads build artifacts for PR builds

**Usage**:
To manually trigger the workflow, go to the Actions tab in the GitHub repository, select the "CI" workflow, and click "Run workflow".

## Release Workflow

**File**: `.github/workflows/release.yml`

The release workflow handles the official release process, publishing packages to npm and creating GitHub releases.

**Trigger**:
- Pushes of version tags matching the pattern `v*.*.*` (e.g., v1.0.0)
- Manual trigger via GitHub UI (requires version input)

**Key Features**:
- Builds and tests the entire project
- Creates a GitHub release with automatically generated release notes
- Publishes the package to npm with public access

**Usage**:
- **Automatic**: Push a version tag to trigger the workflow:
  ```
  git tag v1.0.0
  git push origin v1.0.0
  ```
- **Manual**: Go to the Actions tab, select the "Release" workflow, click "Run workflow", and enter the version number.

## Pre-Release Workflow

**File**: `.github/workflows/prerelease.yml`

The pre-release workflow creates beta, RC, or other pre-release versions of the package.

**Trigger**:
- Manual trigger only

**Key Features**:
- Creates a pre-release version with the specified tag (e.g., beta, rc)
- Builds and tests the package
- Creates a GitHub pre-release
- Publishes to npm with the specified tag

**Usage**:
Go to the Actions tab, select the "Pre-Release" workflow, click "Run workflow", and fill in:
- Version: Pre-release version number (e.g., 1.0.0)
- Tag: Tag for the npm package (e.g., beta, rc)
- Branch: Branch to build from (e.g., main, develop)

## Nightly Build Workflow

**File**: `.github/workflows/nightly.yml`

The nightly build workflow creates nightly builds for testing the latest code.

**Trigger**:
- Scheduled to run at midnight UTC
- Manual trigger via GitHub UI

**Key Features**:
- Creates a nightly version with a timestamp
- Builds and tests the package
- Creates a GitHub tag
- Publishes to npm with the "nightly" tag

**Usage**:
- **Automatic**: The workflow runs automatically at midnight UTC.
- **Manual**: Go to the Actions tab, select the "Nightly Build" workflow, and click "Run workflow".

## Test Publishing Workflow

**File**: `.github/workflows/test-publish.yml`

The test publishing workflow simulates the publishing process using a local npm registry.

**Trigger**:
- Manual trigger only

**Key Features**:
- Creates a pre-release version
- Builds the package
- Starts a local Verdaccio registry
- Publishes to the local registry and tests installation

**Usage**:
Go to the Actions tab, select the "Test Publishing" workflow, click "Run workflow", and provide a version tag if desired.

## Local Development with CI/CD

Developers can use the same commands locally as the CI/CD pipelines use:

```bash
# Install dependencies
pnpm install

# Run linting
pnpm lint
# or for affected only
pnpm affected:lint

# Build
pnpm build
# or production build
pnpm build:prod
# or for affected only
pnpm affected:build

# Test
pnpm test
# or for affected only
pnpm affected:test

# Generate Nx dependency graph
pnpm graph
```

## Setting Up Secrets

The workflows require the following secrets to be set in the GitHub repository:

- `NPM_TOKEN`: A token for publishing to npm. This should be set as a repository secret.

To add a secret:
1. Go to the repository Settings
2. Navigate to Secrets and variables > Actions
3. Click "New repository secret"
4. Enter the name and value, then click "Add secret"

## Best Practices

1. **Always create PRs for changes**: This ensures the CI workflow runs and validates your changes.
2. **Use conventional commits**: This helps with automated versioning and changelog generation.
3. **Test releases with the test-publish workflow**: Before releasing, verify that your package can be published correctly.
4. **Use the pre-release workflow for beta/RC versions**: This keeps the release process consistent.
5. **Check nightly builds for early detection of issues**: Subscribe to nightly build workflow notifications. 
