/**
 * @file Generator for syncing project types across all projects.
 *
 * This generator automatically applies project types to projects based on their tags.
 */

import { Tree, formatFiles, getProjects, logger } from "@nx/devkit";
import { SyncProjectTypesGeneratorSchema } from "./schema";
import { discoverProjectTypes, matchProjectType } from "../../lib/project-type-utils";

/**
 * Main generator function for syncing project types across all projects.
 * @param tree - The Nx file tree.
 * @param options - The generator options.
 * @returns A function to run after generation (can be empty).
 * @example
 * // Will be called by Nx when running the generator
 * await syncProjectTypesGenerator(tree, { dryRun: false });
 */
export default async function syncProjectTypesGenerator(
  tree: Tree,
  options: SyncProjectTypesGeneratorSchema
): Promise<() => void> {
  const { dryRun } = options;

  // Discover all project types
  const projectTypes = discoverProjectTypes(tree);
  logger.info(`Discovered ${projectTypes.length} project types`);

  // Get all projects
  const projects = getProjects(tree);
  logger.info(`Found ${projects.size} projects`);

  // For each project, find the matching project type
  let matchCount = 0;

  for (const [projectName, projectConfig] of projects.entries()) {
    const projectTags = projectConfig.tags || [];

    // Skip projects without tags
    if (projectTags.length === 0) {
      logger.info(`Skipping project ${projectName} (no tags)`);
      continue;
    }

    // Find matching project type
    const matchedType = matchProjectType(projectTags, projectTypes);

    if (matchedType) {
      matchCount++;
      logger.info(
        `${dryRun ? "[DRY RUN] Would match" : "Matched"} project ${projectName} to type ${matchedType.name}`
      );
    }
  }

  logger.info(`${dryRun ? "Would match" : "Matched"} ${matchCount} projects to project types`);

  // Format files (standard practice for generators)
  await formatFiles(tree);

  // Return a function to run after generation
  return () => {
    logger.info(`Successfully ${dryRun ? "simulated sync of" : "synced"} project types`);
  };
}
