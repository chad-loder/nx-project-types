#!/bin/bash
set -euo pipefail

# Check if actionlint is installed
if ! command -v actionlint &> /dev/null; then
    echo "actionlint is not installed. Please install it first:"
    echo "  brew install actionlint"
    exit 1
fi

WORKFLOWS_DIR=".github/workflows"
ERROR_COUNT=0

echo "Validating GitHub Actions workflows..."
echo ""

# Find all workflow files
for workflow in $(find "$WORKFLOWS_DIR" -name "*.yml" -o -name "*.yaml" | sort); do
    echo "Checking $workflow"

    # Run actionlint
    OUTPUT=$(actionlint "$workflow" 2>&1) || true

    if [ -n "$OUTPUT" ]; then
        echo "❌ Issues found in $workflow:"
        echo "$OUTPUT"
        echo ""
        ERROR_COUNT=$((ERROR_COUNT+1))
    else
        echo "✅ No issues found in $workflow"
    fi
    echo "-----------------------------------"
done

echo ""
if [ $ERROR_COUNT -eq 0 ]; then
    echo "🎉 All workflows are valid!"
    exit 0
else
    echo "❌ Found issues in $ERROR_COUNT workflow file(s). Please fix them."
    exit 1
fi
