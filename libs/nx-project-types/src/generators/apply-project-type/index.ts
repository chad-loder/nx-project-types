/**
 * @file Generator for applying a project type to a project.
 *
 * This generator applies a project type configuration to a specific project.
 */

import {
  Tree,
  formatFiles,
  generateFiles,
  getProjects,
  joinPathFragments,
  logger,
  readJson,
  updateJson,
  updateProjectConfiguration,
  readProjectConfiguration,
} from "@nx/devkit";
import { ApplyProjectTypeGeneratorSchema } from "./schema";
import {
  getProjectType,
  getTemplateDir,
  prepareTemplateVariables,
} from "../../lib/project-type-utils";
import * as path from "path";

/**
 * Main generator function for applying a project type to a project.
 * @param tree - The Nx file tree.
 * @param options - The generator options.
 * @returns A function to run after generation (can be empty).
 * @example
 * // Will be called by Nx when running the generator
 * await applyProjectTypeGenerator(tree, { project: 'my-project', type: 'ai-safe' });
 */
export default async function applyProjectTypeGenerator(
  tree: Tree,
  options: ApplyProjectTypeGeneratorSchema,
): Promise<() => void> {
  const projectName = options.project;
  const projectType = options.type || "ai-safe";

  if (!projectName) {
    logger.error("You must specify a project name.");
    throw new Error("Missing project name");
  }

  try {
    // Read the project configuration
    const projectConfig = readProjectConfiguration(tree, projectName);

    // Update tags based on the project type
    if (!projectConfig.tags) {
      projectConfig.tags = [];
    }

    // Check if the tag for this project type already exists
    if (!projectConfig.tags.includes(projectType)) {
      projectConfig.tags.push(projectType);
      logger.info(`Adding ${projectType} tag to ${projectName}`);
    } else {
      logger.info(`Project ${projectName} already has the ${projectType} tag`);
    }

    // Update the project configuration
    updateProjectConfiguration(tree, projectName, projectConfig);

    // Add configuration based on the project type
    if (projectType === "ai-safe") {
      applyAiSafeConfig(tree, projectName, projectConfig);
    }

    // Format any modified files
    await formatFiles(tree);

    logger.info(`Successfully applied ${projectType} configuration to ${projectName}.`);
    return () => {
      logger.info(`Successfully applied project type ${projectType} to project ${projectName}`);
    };
  } catch (error) {
    logger.error(
      `Failed to apply project type to ${projectName}: ${error instanceof Error ? error.message : String(error)}`,
    );
    throw error;
  }
}

/**
 * Apply AI-safe specific configuration to a project.
 * @param tree - The Nx virtual file tree.
 * @param projectName - The name of the project.
 * @param projectConfig - The project configuration.
 * @example
 */
function applyAiSafeConfig(tree: Tree, projectName: string, projectConfig: any) {
  logger.info(`Applying AI-safe configuration to ${projectName}...`);

  // You would add specific AI-safe configuration here
  // For example, adding specific linting rules, test settings, etc.

  // Example: Update build configuration if it exists
  if (projectConfig.targets?.build) {
    if (!projectConfig.targets.build.configurations) {
      projectConfig.targets.build.configurations = {};
    }

    projectConfig.targets.build.configurations["ai-safe"] = {
      tsConfig: "tsconfig.lib.json",
    };

    updateProjectConfiguration(tree, projectName, projectConfig);
    logger.info(`Added AI-safe build configuration to ${projectName}`);
  }
}

// Handle command-line execution when run directly with ts-node
if (require.main === module) {
  // Parse command-line arguments
  const args = process.argv.slice(2);
  const options: ApplyProjectTypeGeneratorSchema = {
    project: "",
    type: "ai-safe",
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--project=")) {
      options.project = arg.substring("--project=".length);
    } else if (arg === "--project" && i + 1 < args.length) {
      options.project = args[++i];
    } else if (arg.startsWith("--type=")) {
      options.type = arg.substring("--type=".length);
    } else if (arg === "--type" && i + 1 < args.length) {
      options.type = args[++i];
    }
  }

  // Create a simple file system tree for direct execution
  const fs = require("fs");
  const simpleTree: Tree = {
    root: process.cwd(),
    read(filePath: string) {
      try {
        return fs.readFileSync(filePath, "utf-8");
      } catch (e) {
        return null;
      }
    },
    write(filePath: string, content: string) {
      fs.writeFileSync(filePath, content, "utf-8");
    },
    exists(filePath: string) {
      return fs.existsSync(filePath);
    },
    delete(filePath: string) {
      fs.unlinkSync(filePath);
    },
    isFile(filePath: string) {
      try {
        return fs.statSync(filePath).isFile();
      } catch (e) {
        return false;
      }
    },
    children(dirPath: string) {
      return fs.readdirSync(dirPath);
    },
    // Add other Tree methods as needed
  } as any;

  console.log(`Applying project type ${options.type} to project ${options.project}...`);

  // Execute the generator
  applyProjectTypeGenerator(simpleTree, options).catch(error => {
    console.error("Error:", error);
    process.exit(1);
  });
}
