/**
 * @file Schema definition for the apply-project-type generator.
 *
 * This file defines the TypeScript interface for the apply-project-type generator options.
 */

/**
 * Schema for the apply-project-type generator.
 */
export interface ApplyProjectTypeGeneratorSchema {
  /**
   * The name of the project to apply the project type to.
   */
  project: string;

  /**
   * The project type to apply.
   */
  type: string;
}
