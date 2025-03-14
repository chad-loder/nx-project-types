const typescript = require("rollup-plugin-typescript2");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const path = require("path");
const fs = require("fs");

// Read package.json to get dependencies
const pkg = require("./package.json");
const external = [...Object.keys(pkg.dependencies || {}), "fs", "path", "process"];

// Determine build mode from environment variable
const BUILD_MODE = process.env.BUILD_MODE || "development";
console.log(`Building nx-project-types in ${BUILD_MODE} mode`);

// Configuration for different build modes
const modeConfig = {
  development: {
    preserveModules: true,
    skipGenCopying: true,
    sourceMap: true,
    clean: false,
    optimization: false,
  },
  production: {
    preserveModules: true,
    skipGenCopying: false,
    sourceMap: true,
    clean: true,
    optimization: true,
  },
  release: {
    preserveModules: true,
    skipGenCopying: false,
    sourceMap: false,
    clean: true,
    optimization: true,
  },
};

const config = modeConfig[BUILD_MODE];

// Output directory for the build
const DIST_DIR = "../../dist";

// Copy schema.json files and other assets to the dist directory
const copyAssets = () => ({
  name: "copy-assets",
  buildEnd() {
    const dirs = [`${DIST_DIR}/generators`, `${DIST_DIR}/executors`];

    // Create directories if they don't exist
    dirs.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Copy schema files
    const schemaCopies = [
      {
        src: "src/generators/apply-project-type/schema.json",
        dest: `${DIST_DIR}/generators/apply-project-type/schema.json`,
      },
      {
        src: "src/generators/sync-project-types/schema.json",
        dest: `${DIST_DIR}/generators/sync-project-types/schema.json`,
      },
      {
        src: "src/executors/register/schema.json",
        dest: `${DIST_DIR}/executors/register/schema.json`,
      },
    ];

    schemaCopies.forEach(({ src, dest }) => {
      const destDir = path.dirname(dest);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`Copied ${src} to ${dest}`);
      } else {
        console.warn(`Warning: ${src} does not exist, skipping copy`);
      }
    });

    // Copy root files
    const filesToCopy = ["generators.json", "executors.json"];
    filesToCopy.forEach((file) => {
      if (fs.existsSync(file)) {
        fs.copyFileSync(file, `${DIST_DIR}/${file}`);
        console.log(`Copied ${file} to ${DIST_DIR}/${file}`);
      } else {
        console.warn(`Warning: ${file} does not exist, skipping copy`);
      }
    });
  },
});

// Set up the generator and executor configurations
const setupGeneratorStructure = () => ({
  name: "setup-generator-structure",
  writeBundle(options, bundle) {
    if (!config.skipGenCopying) {
      // Update generators.json
      if (fs.existsSync(`${DIST_DIR}/generators.json`)) {
        const generatorsJson = JSON.parse(fs.readFileSync(`${DIST_DIR}/generators.json`, "utf8"));

        // Update generator paths
        Object.keys(generatorsJson.generators).forEach((genKey) => {
          const generator = generatorsJson.generators[genKey];

          // Check for factory property (older format)
          if (generator.factory && generator.factory.startsWith("./src/generators/")) {
            generator.factory = generator.factory.replace(
              "./src/generators/",
              "./generators/"
            );
          }

          // Check for implementation property (newer format)
          if (generator.implementation && generator.implementation.startsWith("./src/generators/")) {
            generator.implementation = generator.implementation.replace(
              "./src/generators/",
              "./generators/"
            );
          }

          // Update schema paths if needed
          if (generator.schema && generator.schema.startsWith("./src/")) {
            generator.schema = generator.schema.replace(
              "./src/",
              "./"
            );
          }
        });

        fs.writeFileSync(`${DIST_DIR}/generators.json`, JSON.stringify(generatorsJson, null, 2));
        console.log("Updated generators.json with correct paths");
      }

      // Update executors.json
      if (fs.existsSync(`${DIST_DIR}/executors.json`)) {
        const executorsJson = JSON.parse(fs.readFileSync(`${DIST_DIR}/executors.json`, "utf8"));

        // Update executor paths
        Object.keys(executorsJson.executors).forEach((execKey) => {
          const executor = executorsJson.executors[execKey];

          // Check for factory property (older format)
          if (executor.factory && executor.factory.startsWith("./src/executors/")) {
            executor.factory = executor.factory.replace(
              "./src/executors/",
              "./executors/"
            );
          }

          // Check for implementation property (newer format)
          if (executor.implementation && executor.implementation.startsWith("./src/executors/")) {
            executor.implementation = executor.implementation.replace(
              "./src/executors/",
              "./executors/"
            );
          }

          // Update schema paths if needed
          if (executor.schema && executor.schema.startsWith("./src/")) {
            executor.schema = executor.schema.replace(
              "./src/",
              "./"
            );
          }
        });

        fs.writeFileSync(`${DIST_DIR}/executors.json`, JSON.stringify(executorsJson, null, 2));
        console.log("Updated executors.json with correct paths");
      }

      // Create package.json in dist
      const packageJson = { ...pkg };
      packageJson.main = "index.js";
      packageJson.typings = "index.d.ts";
      packageJson.generators = "./generators.json";
      packageJson.executors = "./executors.json";

      fs.writeFileSync(`${DIST_DIR}/package.json`, JSON.stringify(packageJson, null, 2));
      console.log("Created package.json in dist directory");
    }
  },
});

// Copy compiled files to correct structure for nx plugin
const copyCompiledFiles = () => ({
  name: "copy-compiled-files",
  writeBundle(options, bundle) {
    // This is no longer needed as files are written directly to the right location
  },
});

// Main rollup configuration
module.exports = {
  input: {
    index: "index.ts",

    // Generators
    "generators/apply-project-type/index": "src/generators/apply-project-type/index.ts",
    "generators/sync-project-types/index": "src/generators/sync-project-types/index.ts",

    // Executors
    "executors/register/index": "src/executors/register/index.ts",
  },
  output: {
    dir: DIST_DIR,
    format: "cjs",
    sourcemap: config.sourceMap,
    exports: "named",
    preserveModules: config.preserveModules,
    preserveModulesRoot: ".",
  },
  external,
  plugins: [
    nodeResolve({
      preferBuiltins: true,
    }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          sourceMap: config.sourceMap,
          removeComments: config.optimization,
        },
        exclude: ["**/tests", "**/*.spec.ts"],
      },
    }),
    copyAssets(),
    setupGeneratorStructure(),
    copyCompiledFiles(),
  ],
};
