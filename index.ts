/**
 * @file Main entry point for nx-project-types.
 *
 * This file exports all generators and utilities for the project type inheritance system.
 */

// Re-export generators
export { default as applyProjectTypeGenerator } from "./libs/nx-project-types/src/generators/apply-project-type";
export { default as syncProjectTypesGenerator } from "./libs/nx-project-types/src/generators/sync-project-types";

// Re-export executors
export { default as registerExecutor } from "./libs/nx-project-types/src/executors/register";

// Re-export utilities
export * from "./libs/nx-project-types/src/lib/project-type-utils";
