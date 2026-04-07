#!/bin/bash
# Smart Board - Test Automation Script
# Runs Vitest with coverage

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║          🧪 Smart Board - TEST AUTOMATION 🧪              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check for test files
if [ ! -f "src/components/"*.test.tsx ] && [ ! -f "src/lib/"*.test.ts ] && [ ! -f "server.test.cjs" ]; then
    echo "ℹ️  No test files found. Run tests once tests are added."
    echo ""
    echo "Test file locations:"
    echo " - src/components/*.test.tsx"
    echo " - src/lib/*.test.ts"
    echo " - server.test.cjs"
    echo ""
    exit 0
fi

# Run tests
echo "🚀 Running Vitest..."
echo ""
npm test
TEST_EXIT=$?
echo ""

if [ $TEST_EXIT -ne 0 ]; then
    echo "❌ Tests failed"
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║          ✅ ALL TESTS PASSED ✅                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
