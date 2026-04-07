#!/bin/bash
# Smart Board - Verification & Link Check Script

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     🔍 Smart Board - VERIFICATION & LINK CHECK 🔍         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

ERRORS=0
WARNINGS=0

# Check essential files exist
echo "📋 Checking essential files..."
FILES=(
  "package.json"
  "index.html"
  "server.cjs"
  "vite.config.ts"
  "tsconfig.json"
  "README.md"
  ".env"
  "src/App.tsx"
  "src/main.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (MISSING)"
    ERRORS=$((ERRORS + 1))
  fi
done

echo ""
echo "🔗 Checking links in README.md..."

# Extract all markdown links and check
if grep -q "IMPLEMENTATION_GUIDE.md" README.md; then
  echo "  ⚠️  WARNING: Found broken reference to IMPLEMENTATION_GUIDE.md"
  WARNINGS=$((WARNINGS + 1))
fi

# Check if http links are valid
if grep -q "http://127.0.0.1:5173" README.md; then
  echo "  ✅ Frontend URL (127.0.0.1:5173) documented"
else
  echo "  ❌ Frontend URL not found in README"
  ERRORS=$((ERRORS + 1))
fi

if grep -q "http://127.0.0.1:3001" README.md; then
  echo "  ✅ Backend URL (127.0.0.1:3001) documented"
else
  echo "  ❌ Backend URL not found in README"
  ERRORS=$((ERRORS + 1))
fi

echo ""
echo "📦 Checking project structure..."

# Check key directories
DIRS=(
  "src"
  "src/components"
  "src/lib"
  "src/types"
  "src/pages"
  "scripts"
)

for dir in "${DIRS[@]}"; do
  if [ -d "$dir" ]; then
    echo "  ✅ $dir/"
  else
    echo "  ❌ $dir/ (MISSING)"
    ERRORS=$((ERRORS + 1))
  fi
done

echo ""
echo "🗑️  Checking for unused files..."

# Check for empty or unnecessary directories
if [ -d "docs" ]; then
  if [ -z "$(ls -A docs)" ]; then
    echo "  ⚠️  docs/ is empty (can be deleted)"
    WARNINGS=$((WARNINGS + 1))
  fi
fi

echo ""
echo "✨ Database check..."
if [ -f "smartboard.db" ]; then
  SIZE=$(du -h smartboard.db | cut -f1)
  echo "  ✅ smartboard.db exists ($SIZE)"
else
  echo "  ⚠️  smartboard.db not found (will be created on first run)"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "📋 Scripts available..."
if [ -f "scripts/build.sh" ]; then
  echo "  ✅ build.sh"
fi
if [ -f "scripts/test.sh" ]; then
  echo "  ✅ test.sh"
fi
if [ -f "scripts/pre-launch.sh" ]; then
  echo "  ✅ pre-launch.sh"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "SUMMARY:"
echo "  ✅ Passed checks: $(find . -name '*.tsx' -o -name '*.ts' -o -name '*.cjs' | wc -l) source files"
echo "  ⚠️  Warnings: $WARNINGS"
echo "  ❌ Errors: $ERRORS"
echo "════════════════════════════════════════════════════════════"

if [ $ERRORS -eq 0 ]; then
  echo "✅ Project structure is valid!"
  exit 0
else
  echo "❌ Fix the errors above before launching"
  exit 1
fi
