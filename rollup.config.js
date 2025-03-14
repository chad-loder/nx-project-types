/**
 * Rollup configuration for nx-project-types plugin
 */

const typescript = require("rollup-plugin-typescript2");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const fs = require("fs");
const path = require("path");

// Get build mode from environment
const BUILD_MODE = process.env.BUILD_MODE || "development";
console.log(`Building nx-project-types in ${BUILD_MODE} mode`);

// Configure mode-specific settings
const modeConfig = {
  development: {
    sourceMap: true,
    preserveModules: true,
    clean: false,
    skipGenCopying: true,
    external: [/^@nx\//, /^rxjs\//],
  },
  production: {
    sourceMap: true,
    preserveModules: true,
    clean: true,
    skipGenCopying: false,
    external: [/^@nx\//, /^rxjs\//],
  },
  release: {
    sourceMap: false,
    preserveModules: false,
    clean: true,
    skipGenCopying: false,
    external: [/^@nx\//, /^rxjs\//],
  },
};

// Active configuration
const config = modeConfig[BUILD_MODE] || modeConfig.development;

// Define external modules
const external = (id) => {
  return (
    id.startsWith("@nx/") ||
    id.startsWith("rxjs/") ||
    id === "fs" ||
    id === "path" ||
    id === "child_process"
  );
};

// Copy schema files and other necessary assets
const copyAssets = () => ({
  name: "copy-assets",
  buildEnd() {
    // Ensure directories exist
    const dirs = ["dist/generators", "dist/executors"];
    dirs.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Copy schema files
    const schemaFiles = [
      {
        src: "src/generators/apply-project-type/schema.json",
        dest: "dist/generators/apply-project-type/schema.json",
      },
      {
        src: "src/generators/sync-project-types/schema.json",
        dest: "dist/generators/sync-project-types/schema.json",
      },
      {
        src: "src/executors/register/schema.json",
        dest: "dist/executors/register/schema.json",
      },
    ];

    schemaFiles.forEach(({ src, dest }) => {
      if (fs.existsSync(src)) {
        // Ensure destination directory exists
        const destDir = path.dirname(dest);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }

        fs.copyFileSync(src, dest);
        console.log(`Copied schema: ${src} -> ${dest}`);
      } else {
        console.warn(`Schema file not found: ${src}`);
      }
    });

    // Copy generators.json and executors.json to dist
    ["generators.json", "executors.json"].forEach((file) => {
      if (fs.existsSync(file)) {
        fs.copyFileSync(file, `dist/${file}`);
        console.log(`Copied ${file} to dist/${file}`);
      }
    });
  },
});

// For production and release, create a plugin to handle proper module structure
const setupGeneratorStructure = () => ({
  name: "setup-generator-structure",
  writeBundle(options, bundle) {
    if (config.skipGenCopying) {
      console.log("Skipping generator structure setup (development mode)");
      return;
    }

    console.log("Setting up proper generator and executor structure");

    // Update generators.json and executors.json with the correct paths
    if (fs.existsSync("dist/generators.json")) {
      const generatorsJson = JSON.parse(
        fs.readFileSync("dist/generators.json", "utf8")
      );

      // In production mode, point to the compiled files in dist
      Object.keys(generatorsJson.generators).forEach((genName) => {
        const factory = generatorsJson.generators[genName].factory;
        if (factory && factory.startsWith("./src/generators/")) {
          // Don't modify the schema path, only the factory path
          generatorsJson.generators[genName].factory = factory.replace(
            "./src/generators/",
            "./dist/generators/"
          );
        }
      });

      fs.writeFileSync(
        "dist/generators.json",
        JSON.stringify(generatorsJson, null, 2)
      );
      console.log("Updated generators.json with correct paths");
    }

    if (fs.existsSync("dist/executors.json")) {
      const executorsJson = JSON.parse(
        fs.readFileSync("dist/executors.json", "utf8")
      );

      // In production mode, point to the compiled files in dist
      Object.keys(executorsJson.executors).forEach((exeName) => {
        const factory = executorsJson.executors[exeName].factory;
        if (factory && factory.startsWith("./src/executors/")) {
          // Don't modify the schema path, only the factory path
          executorsJson.executors[exeName].factory = factory.replace(
            "./src/executors/",
            "./dist/executors/"
          );
        }
      });

      fs.writeFileSync(
        "dist/executors.json",
        JSON.stringify(executorsJson, null, 2)
      );
      console.log("Updated executors.json with correct paths");
    }

    // For production/release mode, copy main package.json and update paths
    if (BUILD_MODE === "production" || BUILD_MODE === "release") {
      const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

      // Update main and typings to point to dist files
      packageJson.main = "dist/index.js";
      packageJson.typings = "dist/index.d.ts";
      packageJson.generators = "./dist/generators.json";
      packageJson.executors = "./dist/executors.json";

      fs.writeFileSync(
        "dist/package.json",
        JSON.stringify(packageJson, null, 2)
      );
      console.log("Created production package.json in dist");
    }
  },
});

// In development mode, copy compiled files to match generators.json paths
const copyCompiledFiles = () => ({
  name: "copy-compiled-files",
  writeBundle(options, bundle) {
    if (!config.skipGenCopying) {
      // This is only for production mode
      return;
    }

    console.log("Copying compiled files to match generators.json paths");

    // Copy generator files
    const generatorDirs = ["apply-project-type", "sync-project-types"];
    generatorDirs.forEach((dir) => {
      const sourceDir = `dist/generators/${dir}`;
      const targetDir = `src/generators/${dir}`;

      if (fs.existsSync(`${sourceDir}/index.js`)) {
        fs.copyFileSync(`${sourceDir}/index.js`, `${targetDir}/index.js`);
        console.log(`Copied ${sourceDir}/index.js to ${targetDir}/index.js`);

        // Copy source map and declaration files
        if (fs.existsSync(`${sourceDir}/index.js.map`)) {
          fs.copyFileSync(
            `${sourceDir}/index.js.map`,
            `${targetDir}/index.js.map`
          );
        }
        if (fs.existsSync(`${sourceDir}/index.d.ts`)) {
          fs.copyFileSync(`${sourceDir}/index.d.ts`, `${targetDir}/index.d.ts`);
        }
      }
    });

    // Copy executor files
    const executorDirs = ["register"];
    executorDirs.forEach((dir) => {
      const sourceDir = `dist/executors/${dir}`;
      const targetDir = `src/executors/${dir}`;

      if (fs.existsSync(`${sourceDir}/index.js`)) {
        fs.copyFileSync(`${sourceDir}/index.js`, `${targetDir}/index.js`);
        console.log(`Copied ${sourceDir}/index.js to ${targetDir}/index.js`);

        // Copy source map and declaration files
        if (fs.existsSync(`${sourceDir}/index.js.map`)) {
          fs.copyFileSync(
            `${sourceDir}/index.js.map`,
            `${targetDir}/index.js.map`
          );
        }
        if (fs.existsSync(`${sourceDir}/index.d.ts`)) {
          fs.copyFileSync(`${sourceDir}/index.d.ts`, `${targetDir}/index.d.ts`);
        }
      }
    });
  },
});

// Main configuration
module.exports = {
  input: {
    // Main entry
    index: "index.ts",

    // Library
    "lib/project-type-utils": "src/lib/project-type-utils.ts",

    // Generators
    "generators/apply-project-type/index":
      "src/generators/apply-project-type/index.ts",
    "generators/sync-project-types/index":
      "src/generators/sync-project-types/index.ts",

    // Executors
    "executors/register/index": "src/executors/register/index.ts",
  },
  output: {
    dir: "dist",
    format: "cjs",
    sourcemap: config.sourceMap,
    exports: "named",
    preserveModules: config.preserveModules,
    preserveModulesRoot: ".",
  },
  external,
  plugins: [
    nodeResolve({
      extensions: [".ts", ".js", ".json"],
      preferBuiltins: true,
    }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          sourceMap: config.sourceMap,
        },
      },
      clean: config.clean,
    }),
    copyAssets(),
    setupGeneratorStructure(),
    copyCompiledFiles(),
  ],
};
