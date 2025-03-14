// Import from our nx-project-types package
const projectTypeUtils = require('nx-project-types');

// Log available exports to verify the package is working
console.log('Available exports from nx-project-types:');
console.log(Object.keys(projectTypeUtils));

// If we have specific functions from project-type-utils, try to use them
if (projectTypeUtils.generateTypeInheritanceMap) {
  console.log('\nFunction exists: generateTypeInheritanceMap');
}

if (projectTypeUtils.applyProjectType) {
  console.log('Function exists: applyProjectType');
}

if (projectTypeUtils.syncProjectTypes) {
  console.log('Function exists: syncProjectTypes');
}
