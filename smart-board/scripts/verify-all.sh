#!/bin/bash
# Smart Board - Complete Verification Wrapper
# Runs the Python verification script and displays results

cd "$(dirname "$0")/.." || exit 1

echo ""
echo "=================================================="
echo "  Smart Board - Automated Verification"
echo "=================================================="
echo ""

if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not installed."
    echo "Install Python from: https://www.python.org/downloads/"
    exit 1
fi

python3 verify.py "$@"
EXIT_CODE=$?

echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Verification completed successfully"
    echo ""
    echo "Generated files:"
    echo "  - docs/CHANGELOG.md"
    echo "  - docs/PROJECT_STRUCTURE.md"
    echo "  - docs/VERIFICATION_REPORT.json"
    echo "  - README.md (updated with verification badge)"
    echo ""
    echo "View details:"
    echo "  - cat docs/CHANGELOG.md"
    echo "  - cat docs/PROJECT_STRUCTURE.md"
    echo "  - cat docs/VERIFICATION_REPORT.json"
else
    echo "❌ Verification failed with errors"
    echo "Review output above and fix issues"
fi

exit $EXIT_CODE
