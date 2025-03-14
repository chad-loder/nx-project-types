/**
 * @file Schema definition for the sync-project-types generator.
 *
 * This file defines the TypeScript interface for the sync-project-types generator options.
 */

/**
 * Schema for the sync-project-types generator.
 */
export interface SyncProjectTypesGeneratorSchema {
  /**
   * Run in dry-run mode (no changes).
   */
  dryRun: boolean;
}
