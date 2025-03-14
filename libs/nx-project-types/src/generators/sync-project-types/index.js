'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var devkit = require('@nx/devkit');
var lib_projectTypeUtils = require('../../lib/project-type-utils.js');

/**
 * @file Generator for syncing project types across all projects.
 *
 * This generator automatically applies project types to projects based on their tags.
 */
/**
 * Main generator function for syncing project types across all projects.
 * @param tree - The Nx file tree.
 * @param options - The generator options.
 * @returns A function to run after generation (can be empty).
 * @example
 * // Will be called by Nx when running the generator
 * await syncProjectTypesGenerator(tree, { dryRun: false });
 */
async function syncProjectTypesGenerator(tree, options) {
    const { dryRun } = options;
    // Discover all project types
    const projectTypes = lib_projectTypeUtils.discoverProjectTypes(tree);
    devkit.logger.info(`Discovered ${projectTypes.length} project types`);
    // Get all projects
    const projects = devkit.getProjects(tree);
    devkit.logger.info(`Found ${projects.size} projects`);
    // For each project, find the matching project type
    let matchCount = 0;
    for (const [projectName, projectConfig] of projects.entries()) {
        const projectTags = projectConfig.tags || [];
        // Skip projects without tags
        if (projectTags.length === 0) {
            devkit.logger.info(`Skipping project ${projectName} (no tags)`);
            continue;
        }
        // Find matching project type
        const matchedType = lib_projectTypeUtils.matchProjectType(projectTags, projectTypes);
        if (matchedType) {
            matchCount++;
            devkit.logger.info(`${dryRun ? "[DRY RUN] Would match" : "Matched"} project ${projectName} to type ${matchedType.name}`);
        }
    }
    devkit.logger.info(`${dryRun ? "Would match" : "Matched"} ${matchCount} projects to project types`);
    // Format files (standard practice for generators)
    await devkit.formatFiles(tree);
    // Return a function to run after generation
    return () => {
        devkit.logger.info(`Successfully ${dryRun ? "simulated sync of" : "synced"} project types`);
    };
}

exports.default = syncProjectTypesGenerator;
//# sourceMappingURL=index.js.map
