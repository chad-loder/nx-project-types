/**
 * @file Main entry point for nx-project-types.
 *
 * This file exports all generators and utilities for the project type inheritance system.
 */

// Re-export generators
export { default as applyProjectTypeGenerator } from "./src/generators/apply-project-type";
export { default as syncProjectTypesGenerator } from "./src/generators/sync-project-types";

// Re-export executors
export { default as registerExecutor } from "./src/executors/register";

// Re-export utilities
export * from "./src/lib/project-type-utils";
