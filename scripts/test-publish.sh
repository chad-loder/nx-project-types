#!/bin/bash
set -e

# Check if version tag is provided
if [ "$1" == "" ]; then
  echo "Usage: ./scripts/test-publish.sh <version-tag>"
  echo "Example: ./scripts/test-publish.sh beta.1"
  exit 1
fi

VERSION_TAG=$1
PACKAGE_VERSION=$(node -p "require('./package.json').version")
PRERELEASE_VERSION="${PACKAGE_VERSION}-${VERSION_TAG}"

echo "🔍 Testing version ${PRERELEASE_VERSION}"

# Check if Verdaccio is already running
if nc -z localhost 4873 >/dev/null 2>&1; then
  echo "✅ Verdaccio is already running on port 4873"
else
  echo "🚀 Starting Verdaccio"
  # Install Verdaccio if not already installed
  if ! command -v verdaccio >/dev/null 2>&1; then
    echo "📦 Installing Verdaccio"
    npm install -g verdaccio
  fi

  # Start Verdaccio in the background
  mkdir -p ~/.config/verdaccio
  cat > ~/.config/verdaccio/config.yaml << EOF
storage: ./storage
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
packages:
  'nx-project-types':
    access: \$all
    publish: \$authenticated
  '@*/*':
    access: \$all
    publish: \$authenticated
    proxy: npmjs
  '**':
    access: \$all
    publish: \$authenticated
    proxy: npmjs
EOF

  nohup verdaccio > verdaccio.log 2>&1 &
  VERDACCIO_PID=$!
  echo "📝 Verdaccio started with PID ${VERDACCIO_PID}"
  echo "📝 Log file at ./verdaccio.log"

  # Wait for Verdaccio to start
  echo "⏳ Waiting for Verdaccio to start..."
  sleep 5
fi

# Set the version
echo "📝 Setting version to ${PRERELEASE_VERSION}"
npm version "${PRERELEASE_VERSION}" --no-git-tag-version

# Build the package
echo "🏗️ Building package"
pnpm build:prod

# Create user if needed and login
if ! curl -s http://localhost:4873/-/user/org.couchdb.user:test | grep -q "test"; then
  echo "👤 Creating test user"
  npx npm-auth-to-token -u test -p test -e test@test.com -r http://localhost:4873
fi

# Publish the package
echo "📦 Publishing package to local registry"
cd dist && npm publish --registry http://localhost:4873

# Test installation
echo "🧪 Testing installation"
mkdir -p test-install
cd ../test-install
echo '{"name":"test-install","version":"1.0.0","private":true}' > package.json
npm install nx-project-types@${PRERELEASE_VERSION} --registry http://localhost:4873

# Verify installation
if [ -d "node_modules/nx-project-types" ]; then
  echo "✅ Package installed successfully!"
  ls -la node_modules/nx-project-types
else
  echo "❌ Failed to install package"
  exit 1
fi

# Reset version
cd ..
git checkout -- package.json

echo "✨ Test publishing completed successfully!"
echo ""
echo "To use the package in another project:"
echo "npm install nx-project-types@${PRERELEASE_VERSION} --registry http://localhost:4873"
