/**
 * @file Schema definition for the register executor.
 *
 * This file defines the TypeScript interface for the register executor options.
 */

/**
 * Schema for the register executor.
 */
export interface RegisterExecutorSchema {
  /**
   * Run in dry-run mode (no changes).
   */
  dryRun: boolean;
}
