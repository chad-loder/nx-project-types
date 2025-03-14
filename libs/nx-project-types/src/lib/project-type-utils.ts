/**
 * @file Utility functions for project type operations.
 *
 * This module provides utility functions for working with project types,
 * including discovery, template processing, and configuration merging.
 */

import { Tree, joinPathFragments, readJson } from "@nx/devkit";

/**
 * Interface for project type definition.
 */
export interface ProjectType {
  /**
   * The name of the project type.
   */
  name: string;

  /**
   * A description of the project type.
   */
  description: string;

  /**
   * The version of the project type.
   */
  version: string;

  /**
   * Tags associated with this project type.
   */
  tags: string[];

  /**
   * The test framework used by this project type.
   */
  testFramework: string;
}

/**
 * Get the path to the project type directory.
 * @param {string} type - The project type name.
 * @returns {string} The path to the project type directory.
 * @example
 * const aiSafePath = getProjectTypePath('ai-safe');
 * // returns 'workspace/config/ai-safe'
 */
export function getProjectTypePath(type: string): string {
  return joinPathFragments("workspace/config", type);
}

/**
 * Get the project type definition.
 * @param {Tree} tree - The Nx file tree.
 * @param {string} type - The project type name.
 * @returns {ProjectType | null} The project type definition or null if not found.
 * @example
 * const aiSafeType = getProjectType(tree, 'ai-safe');
 * console.log(aiSafeType.description);
 */
export function getProjectType(tree: Tree, type: string): ProjectType | null {
  const typePath = joinPathFragments(getProjectTypePath(type), "project-type.json");

  if (!tree.exists(typePath)) {
    return null;
  }

  return readJson<ProjectType>(tree, typePath);
}

/**
 * Get the template directory for a project type.
 * @param {string} type - The project type name.
 * @returns {string} The path to the template directory.
 * @example
 * const templatesPath = getTemplateDir('ai-safe');
 * // returns 'workspace/config/ai-safe/templates'
 */
export function getTemplateDir(type: string): string {
  return joinPathFragments(getProjectTypePath(type), "templates");
}

/**
 * Discover all project types in the workspace/config directory.
 * @param {Tree} tree - The Nx file tree.
 * @returns {ProjectType[]} An array of project type definitions.
 * @example
 * const allTypes = discoverProjectTypes(tree);
 * console.log(`Found ${allTypes.length} project types`);
 */
export function discoverProjectTypes(tree: Tree): ProjectType[] {
  const configDir = "workspace/config";
  const projectTypes: ProjectType[] = [];

  // List all directories in workspace/config
  const entries = tree.children(configDir);

  for (const entry of entries) {
    const typePath = joinPathFragments(configDir, entry);
    const projectTypePath = joinPathFragments(typePath, "project-type.json");

    // Check if this is a project type directory (has project-type.json)
    if (tree.exists(projectTypePath)) {
      try {
        const projectType = readJson<ProjectType>(tree, projectTypePath);
        projectTypes.push(projectType);
      } catch (error) {
        console.warn(`Error reading project type ${entry}: ${error}`);
      }
    }
  }

  return projectTypes;
}

/**
 * Match a project to a project type based on its tags.
 * @param {string[]} projectTags - The tags of the project.
 * @param {ProjectType[]} projectTypes - The available project types.
 * @returns {ProjectType | null} The matching project type or null if no match.
 * @example
 * const projectTags = ['ai-safe', 'my-project'];
 * const matchedType = matchProjectType(projectTags, allTypes);
 * console.log(`Matched type: ${matchedType?.name}`);
 */
export function matchProjectType(
  projectTags: string[],
  projectTypes: ProjectType[],
): ProjectType | null {
  // First, try to find a direct match with project type name
  for (const type of projectTypes) {
    if (projectTags.includes(type.name)) {
      return type;
    }
  }

  // Then, try to match based on project type tags
  for (const type of projectTypes) {
    for (const tag of type.tags) {
      if (projectTags.includes(tag)) {
        return type;
      }
    }
  }

  return null;
}

/**
 * Prepare variables for template processing.
 * @param {string} projectName - The name of the project.
 * @param {string} projectRoot - The root directory of the project.
 * @param {string[]} projectTags - The tags of the project.
 * @param {string} projectType - The project type name.
 * @returns {Record<string, unknown>} Variables for template processing.
 * @example
 * const variables = prepareTemplateVariables('my-project', 'libs/my-project', ['ai-safe']);
 */
export function prepareTemplateVariables(
  projectName: string,
  projectRoot: string,
  projectTags: string[],
  projectType: string,
): Record<string, unknown> {
  return {
    projectName,
    projectRoot,
    additionalTags: projectTags
      .filter(tag => tag !== projectType)
      .map(tag => `"${tag}"`)
      .join(", "),
    template: "",
    dot: ".",
  };
}
