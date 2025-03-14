import { execSync } from 'child_process';
import { mkdtempSync, rmSync, writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { tmpdir } from 'os';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

/**
 * This e2e test creates an isolated Nx workspace, installs the locally built plugin,
 * and tests its functionality in a real-world scenario.
 *
 * The test:
 * 1. Creates a temporary directory
 * 2. Initializes a new Nx workspace
 * 3. Installs the built nx-project-types plugin from the dist directory
 * 4. Creates a test library project
 * 5. Sets up project type templates
 * 6. Applies a project type to the test library
 * 7. Verifies the configuration was applied correctly
 */
describe('nx-project-types:apply-project-type e2e', () => {
  let tmpDir: string;
  let workspaceDir: string;

  // Get the absolute path to the built plugin
  const pluginDistPath = resolve(process.cwd(), 'dist');

  // Check if the plugin is built
  beforeAll(() => {
    // Ensure the plugin is built before running tests
    if (!existsSync(pluginDistPath) || !existsSync(join(pluginDistPath, 'package.json'))) {
      throw new Error(
        `Plugin not found at ${pluginDistPath}. Please build the plugin first with 'pnpm build:prod'.`
      );
    }

    // Read the version from the built package.json
    const packageJson = JSON.parse(readFileSync(join(pluginDistPath, 'package.json'), 'utf8'));
    console.log(`Testing nx-project-types plugin version ${packageJson.version}`);
  });

  beforeAll(() => {
    console.log('Setting up e2e test environment...');

    // Create a temporary directory with a unique name
    tmpDir = mkdtempSync(join(tmpdir(), 'nx-project-types-e2e-'));
    console.log(`Created temporary directory: ${tmpDir}`);

    workspaceDir = join(tmpDir, 'test-workspace');

    // Create a new Nx workspace
    console.log('Creating new Nx workspace...');
    execSync('npx create-nx-workspace@latest test-workspace --preset=empty --nx-cloud=false', {
      cwd: tmpDir,
      stdio: 'pipe',  // Use pipe to avoid cluttering test output
    });

    // Install the nx-project-types plugin
    console.log('Installing locally built nx-project-types plugin...');
    execSync(`npm install --save-dev ${pluginDistPath}`, {
      cwd: workspaceDir,
      stdio: 'pipe',
    });

    // Create a test project
    console.log('Creating test library project...');
    execSync('npx nx g @nx/js:lib test-lib', {
      cwd: workspaceDir,
      stdio: 'pipe',
    });

    // Set up project type templates
    setupProjectTypeTemplates();
  }, 60000); // Increase timeout for workspace creation

  afterAll(() => {
    // Clean up the temporary directory
    if (tmpDir) {
      console.log(`Cleaning up temporary directory: ${tmpDir}`);
      try {
        rmSync(tmpDir, { recursive: true, force: true });
      } catch (e) {
        console.error(`Failed to remove temporary directory: ${tmpDir}`, e);
      }
    }
  });

  // Helper function to set up project type templates
  function setupProjectTypeTemplates() {
    console.log('Setting up project type templates...');

    const templatesDir = join(workspaceDir, 'templates');
    if (!existsSync(templatesDir)) {
      mkdirSync(templatesDir);
    }

    // Create base project type
    const baseDir = join(templatesDir, 'base');
    if (!existsSync(baseDir)) {
      mkdirSync(baseDir);
    }

    writeFileSync(
      join(baseDir, 'project-type.json'),
      JSON.stringify({
        name: 'base',
        description: 'Base project type',
        config: {
          targets: {
            docs: {
              executor: '@nx/js:tsc',
              options: {
                outputPath: 'docs',
                main: 'src/index.ts',
                tsConfig: 'tsconfig.lib.json',
              }
            },
            nuke: {
              executor: 'nx-project-types:register',
              options: {
                command: 'rm -rf node_modules dist tmp'
              }
            }
          }
        }
      }, null, 2)
    );

    // Create node project type
    const nodeDir = join(templatesDir, 'node');
    if (!existsSync(nodeDir)) {
      mkdirSync(nodeDir);
    }

    writeFileSync(
      join(nodeDir, 'project-type.json'),
      JSON.stringify({
        name: 'node',
        description: 'Node.js project',
        extends: 'base',
        config: {
          targets: {
            serve: {
              executor: '@nx/js:node',
              options: {
                buildTarget: '{projectName}:build'
              }
            }
          },
          tags: ['type:node']
        }
      }, null, 2)
    );
  }

  it('should apply a project type to an existing project', () => {
    console.log('Testing apply-project-type generator...');

    // Execute the generator
    const result = execSync('npx nx g nx-project-types:apply-project-type --project=test-lib --project-type=node', {
      cwd: workspaceDir,
      encoding: 'utf8',
    });

    // Check the output
    expect(result).toContain('Successfully applied project type node to test-lib');
    console.log('Generator executed successfully');

    // Check if the project.json was updated with the new configuration
    const projectJsonPath = join(workspaceDir, 'libs/test-lib/project.json');
    const projectJson = JSON.parse(readFileSync(projectJsonPath, 'utf8'));

    // Verify targets from the base type
    expect(projectJson.targets.docs).toBeDefined();
    expect(projectJson.targets.docs.executor).toBe('@nx/js:tsc');

    // Verify the nuke target from base type
    expect(projectJson.targets.nuke).toBeDefined();
    expect(projectJson.targets.nuke.executor).toBe('nx-project-types:register');

    // Verify targets from the node type
    expect(projectJson.targets.serve).toBeDefined();
    expect(projectJson.targets.serve.executor).toBe('@nx/js:node');

    // Verify tags
    expect(projectJson.tags).toContain('type:node');

    console.log('Project configuration verified successfully');
  });

  // This test verifies that tags are properly updated
  it('should update tags in project.json', () => {
    console.log('Testing tag updates...');

    const projectJsonPath = join(workspaceDir, 'libs/test-lib/project.json');
    const projectJson = JSON.parse(readFileSync(projectJsonPath, 'utf8'));

    // Verify that the tag was applied
    expect(projectJson.tags).toEqual(expect.arrayContaining(['type:node']));
    console.log('Tags verified successfully');
  });
});
