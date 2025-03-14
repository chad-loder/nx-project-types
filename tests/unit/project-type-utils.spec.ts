import * as path from 'path';
import * as fs from 'fs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  discoverProjectTypes,
  getProjectType,
  getProjectTypePath,
  matchProjectType,
} from '../../src/lib/project-type-utils';

// Mock the filesystem for testing
vi.mock('fs', () => ({
  existsSync: vi.fn(),
  readdirSync: vi.fn(),
  readFileSync: vi.fn(),
  statSync: vi.fn(),
}));

// Mock the nx Tree for testing
const mockTree = {
  exists: vi.fn(),
  read: vi.fn(),
  write: vi.fn(),
  listChanges: vi.fn(),
};

describe('Project Type Utils', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Setup mock filesystem
    (fs.existsSync as any).mockImplementation((filePath) => {
      if (filePath.includes('templates/base') ||
          filePath.includes('templates/node') ||
          filePath.includes('templates/web')) {
        return true;
      }
      return false;
    });

    (fs.readdirSync as any).mockReturnValue(['base', 'node', 'web']);

    (fs.statSync as any).mockImplementation((filePath) => ({
      isDirectory: () => true,
    }));

    (fs.readFileSync as any).mockImplementation((filePath) => {
      if (filePath.includes('base/project-type.json')) {
        return JSON.stringify({
          name: 'base',
          description: 'Base project type',
          config: { targets: { build: { executor: 'nx:build' } } },
        });
      }
      if (filePath.includes('node/project-type.json')) {
        return JSON.stringify({
          name: 'node',
          extends: 'base',
          description: 'Node project type',
          config: { targets: { serve: { executor: 'nx:serve' } } },
        });
      }
      if (filePath.includes('web/project-type.json')) {
        return JSON.stringify({
          name: 'web',
          extends: 'base',
          description: 'Web project type',
          config: { targets: { build: { executor: 'nx:webpack' } } },
        });
      }
      return '';
    });
  });

  describe('discoverProjectTypes', () => {
    it('should discover all project types in templates directory', () => {
      const projectTypes = discoverProjectTypes();

      expect(projectTypes).toHaveLength(3);
      expect(projectTypes.map(pt => pt.name)).toContain('base');
      expect(projectTypes.map(pt => pt.name)).toContain('node');
      expect(projectTypes.map(pt => pt.name)).toContain('web');
    });
  });

  describe('getProjectType', () => {
    it('should get project type by name', () => {
      const projectType = getProjectType('node');

      expect(projectType).toBeDefined();
      expect(projectType?.name).toBe('node');
      expect(projectType?.extends).toBe('base');
    });

    it('should return undefined for non-existent project type', () => {
      const projectType = getProjectType('non-existent');

      expect(projectType).toBeUndefined();
    });
  });

  describe('getProjectTypePath', () => {
    it('should get path to project type directory', () => {
      const typePath = getProjectTypePath('node');

      expect(typePath).toContain('templates/node');
    });
  });

  describe('matchProjectType', () => {
    it('should match project with exact project type', () => {
      mockTree.read.mockReturnValue(
        JSON.stringify({
          name: 'test-project',
          projectType: 'node',
        })
      );

      const result = matchProjectType(mockTree as any, 'path/to/project.json', 'node');

      expect(result).toBe(true);
    });

    it('should not match project with different project type', () => {
      mockTree.read.mockReturnValue(
        JSON.stringify({
          name: 'test-project',
          projectType: 'web',
        })
      );

      const result = matchProjectType(mockTree as any, 'path/to/project.json', 'node');

      expect(result).toBe(false);
    });
  });
});
