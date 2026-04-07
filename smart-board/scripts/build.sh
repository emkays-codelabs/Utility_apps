#!/bin/bash
# Smart Board - Build Automation Script
# Runs linting, tests, and production build

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║          🏗️  Smart Board - BUILD AUTOMATION 🏗️            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Lint
echo "[1/4] 📝 Running ESLint..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Linting failed"
    exit 1
fi
echo "✅ Linting passed"
echo ""

# Step 2: Test
echo "[2/4] 🧪 Running tests..."
npm test
if [ $? -ne 0 ]; then
    echo "⚠️  Some tests failed (continuing build)"
fi
echo "✅ Tests completed"
echo ""

# Step 3: Build
echo "[3/4] 🔨 Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build successful"
echo ""

# Step 4: Report
echo "[4/4] 📊 Build report..."
if [ -d "dist" ]; then
    SIZE=$(du -sh dist 2>/dev/null | cut -f1)
    echo "Bundle size: $SIZE"
else
    echo "⚠️  dist folder not found"
fi
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║          ✅ BUILD COMPLETE ✅                             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Output: dist/"
echo ""
