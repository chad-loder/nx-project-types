import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';
import { describe, it, expect, beforeEach } from 'vitest';

import { applyProjectTypeGenerator } from '../../src/generators/apply-project-type';

describe('apply-project-type generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();

    // Create a test project
    tree.write(
      'test-app/project.json',
      JSON.stringify({
        name: 'test-app',
        root: 'test-app',
        projectType: 'application',
        targets: {
          test: {
            executor: '@nx/jest:jest',
            options: {
              jestConfig: 'test-app/jest.config.ts',
              passWithNoTests: true
            }
          }
        }
      })
    );

    // Mock the project type templates
    tree.write(
      'templates/base/project-type.json',
      JSON.stringify({
        name: 'base',
        description: 'Base project type',
        config: {
          targets: {
            build: {
              executor: '@nx/js:tsc',
              options: {
                outputPath: 'dist/{projectName}',
                main: 'src/index.ts',
                tsConfig: 'tsconfig.lib.json',
                assets: ['README.md']
              }
            },
            lint: {
              executor: '@nx/eslint:lint',
              options: {
                lintFilePatterns: ['src/**/*.ts']
              }
            }
          }
        }
      })
    );

    tree.write(
      'templates/node/project-type.json',
      JSON.stringify({
        name: 'node',
        description: 'Node.js project type',
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
      })
    );
  });

  it('should apply the project type configuration to the project', async () => {
    await applyProjectTypeGenerator(tree, {
      project: 'test-app',
      projectType: 'node'
    });

    const config = readProjectConfiguration(tree, 'test-app');

    // Check that targets from the base type were applied
    expect(config.targets?.build).toBeDefined();
    expect(config.targets?.build.executor).toBe('@nx/js:tsc');
    expect(config.targets?.lint).toBeDefined();

    // Check that targets from the node type were applied
    expect(config.targets?.serve).toBeDefined();
    expect(config.targets?.serve.executor).toBe('@nx/js:node');

    // Check that original targets were preserved
    expect(config.targets?.test).toBeDefined();
    expect(config.targets?.test.executor).toBe('@nx/jest:jest');

    // Check that tags were applied
    expect(config.tags).toContain('type:node');

    // Check that projectType was updated
    expect(config.projectType).toBe('node');
  });

  it('should throw an error if project does not exist', async () => {
    await expect(
      applyProjectTypeGenerator(tree, {
        project: 'non-existent',
        projectType: 'node'
      })
    ).rejects.toThrow('Cannot find project');
  });

  it('should throw an error if project type does not exist', async () => {
    await expect(
      applyProjectTypeGenerator(tree, {
        project: 'test-app',
        projectType: 'non-existent'
      })
    ).rejects.toThrow('Project type non-existent not found');
  });
});
