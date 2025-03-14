/**
 * @file Register executor implementation.
 *
 * This executor registers nx-project-types with the Nx workspace by updating nx.json.
 */

import { ExecutorContext, logger } from "@nx/devkit";
import { RegisterExecutorSchema } from "./schema";
import * as path from "path";
import * as fs from "fs";

/**
 * Main executor function for registering nx-project-types.
 * @param options - The executor options.
 * @param context - The executor context.
 * @returns Success status.
 * @example
 */
export default async function registerExecutor(
  options: RegisterExecutorSchema,
  context: ExecutorContext,
): Promise<{ success: boolean }> {
  const { dryRun } = options;

  logger.info(
    `${dryRun ? "[DRY RUN] Would register" : "Registering"} nx-project-types with the Nx workspace`,
  );

  try {
    // Get the path to the nx.json file
    const nxJsonPath = path.join(context.root, "nx.json");

    if (dryRun) {
      logger.info(`Would update ${nxJsonPath} to include nx-project-types generators`);
      return { success: true };
    }

    // Read the current nx.json
    const nxJson = JSON.parse(fs.readFileSync(nxJsonPath, "utf8"));

    // Create generators entry if it doesn't exist
    if (!nxJson.generators) {
      nxJson.generators = {};
    }

    // Add nx-project-types generators
    nxJson.generators["nx-project-types"] = {
      "apply-project-type": {
        factory: "./workspace/build-tools/nx-project-types/generators/apply-project-type",
        schema:
          "./workspace/build-tools/nx-project-types/generators/apply-project-type/schema.json",
      },
      "sync-project-types": {
        factory: "./workspace/build-tools/nx-project-types/generators/sync-project-types",
        schema:
          "./workspace/build-tools/nx-project-types/generators/sync-project-types/schema.json",
      },
    };

    // Write the updated nx.json
    fs.writeFileSync(nxJsonPath, JSON.stringify(nxJson, null, 2));

    logger.info("Successfully registered nx-project-types with the Nx workspace");
    return { success: true };
  } catch (error) {
    logger.error("Failed to register nx-project-types with the Nx workspace");
    logger.error(error);
    return { success: false };
  }
}
