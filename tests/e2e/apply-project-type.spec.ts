import { execSync } from 'child_process';
import { mkdtempSync, rmSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('nx-project-types:apply-project-type e2e', () => {
  let tmpDir: string;

  beforeAll(() => {
    // Create a temporary directory for testing
    tmpDir = mkdtempSync(join(tmpdir(), 'nx-project-types-e2e-'));

    // Create a new Nx workspace
    execSync('npx create-nx-workspace@latest test-workspace --preset=empty --nx-cloud=false', {
      cwd: tmpDir,
      stdio: 'inherit',
    });

    // Install the nx-project-types plugin
    // For actual e2e tests, we would use the built package
    // Here we'll use a relative path to the plugin for simplicity
    const pluginPath = join(process.cwd(), 'dist');
    execSync(`npm install --save-dev ${pluginPath}`, {
      cwd: join(tmpDir, 'test-workspace'),
      stdio: 'inherit',
    });

    // Create a test project
    execSync('npx nx g @nx/js:lib test-lib', {
      cwd: join(tmpDir, 'test-workspace'),
      stdio: 'inherit',
    });

    // Create project type templates in the workspace
    const templatesDir = join(tmpDir, 'test-workspace', 'templates');
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
  });

  afterAll(() => {
    // Clean up the temporary directory
    try {
      rmSync(tmpDir, { recursive: true, force: true });
    } catch (e) {
      console.error(`Failed to remove temporary directory: ${tmpDir}`, e);
    }
  });

  it('should apply a project type to an existing project', () => {
    // Execute the generator
    const result = execSync('npx nx g nx-project-types:apply-project-type --project=test-lib --project-type=node', {
      cwd: join(tmpDir, 'test-workspace'),
      encoding: 'utf8',
    });

    // Check the output
    expect(result).toContain('Successfully applied project type node to test-lib');

    // Check if the project.json was updated with the new configuration
    const projectJson = JSON.parse(
      execSync('cat libs/test-lib/project.json', {
        cwd: join(tmpDir, 'test-workspace'),
        encoding: 'utf8',
      })
    );

    // Verify targets from the base type
    expect(projectJson.targets.docs).toBeDefined();
    expect(projectJson.targets.docs.executor).toBe('@nx/js:tsc');

    // Verify targets from the node type
    expect(projectJson.targets.serve).toBeDefined();
    expect(projectJson.targets.serve.executor).toBe('@nx/js:node');

    // Verify tags
    expect(projectJson.tags).toContain('type:node');
  });
});
