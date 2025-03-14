'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var devkit = require('@nx/devkit');
var path = require('path');
var fs = require('fs');

function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);
var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);

/**
 * @file Register executor implementation.
 *
 * This executor registers nx-project-types with the Nx workspace by updating nx.json.
 */
/**
 * Main executor function for registering nx-project-types.
 * @param options - The executor options.
 * @param context - The executor context.
 * @returns Success status.
 * @example
 */
async function registerExecutor(options, context) {
    const { dryRun } = options;
    devkit.logger.info(`${dryRun ? "[DRY RUN] Would register" : "Registering"} nx-project-types with the Nx workspace`);
    try {
        // Get the path to the nx.json file
        const nxJsonPath = path__namespace.join(context.root, "nx.json");
        if (dryRun) {
            devkit.logger.info(`Would update ${nxJsonPath} to include nx-project-types generators`);
            return { success: true };
        }
        // Read the current nx.json
        const nxJson = JSON.parse(fs__namespace.readFileSync(nxJsonPath, "utf8"));
        // Create generators entry if it doesn't exist
        if (!nxJson.generators) {
            nxJson.generators = {};
        }
        // Add nx-project-types generators
        nxJson.generators["nx-project-types"] = {
            "apply-project-type": {
                factory: "./workspace/build-tools/nx-project-types/generators/apply-project-type",
                schema: "./workspace/build-tools/nx-project-types/generators/apply-project-type/schema.json",
            },
            "sync-project-types": {
                factory: "./workspace/build-tools/nx-project-types/generators/sync-project-types",
                schema: "./workspace/build-tools/nx-project-types/generators/sync-project-types/schema.json",
            },
        };
        // Write the updated nx.json
        fs__namespace.writeFileSync(nxJsonPath, JSON.stringify(nxJson, null, 2));
        devkit.logger.info("Successfully registered nx-project-types with the Nx workspace");
        return { success: true };
    }
    catch (error) {
        devkit.logger.error("Failed to register nx-project-types with the Nx workspace");
        devkit.logger.error(error);
        return { success: false };
    }
}

exports.default = registerExecutor;
//# sourceMappingURL=index.js.map
