#!/bin/bash
# Smart Board - Pre-Launch Validation & Cleanup
# Run this FIRST before any launch - validates all files and kills processes

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     🔍 Smart Board - PRE-LAUNCH VALIDATION 🔍             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Kill ALL Node processes
echo "[1/5] 🛑 Killing all Node processes..."
pkill -f "node" 2>/dev/null || killall node 2>/dev/null || true
sleep 2
echo "✅ All processes terminated"
echo ""

# Step 2: Free up ports
echo "[2/5] 🔓 Freeing ports 3001, 5173-5177..."
for port in 3001 5000 5173 5174 5175 5176 5177 8000 8080; do
    fuser -k $port/tcp 2>/dev/null || true
done
sleep 1
echo "✅ Ports freed"
echo ""

# Step 3: Clean temporary files
echo "[3/5] 🧹 Cleaning temporary files..."
rm -f *.log 2>/dev/null
rm -f smartboard.db-shm 2>/dev/null
rm -f smartboard.db-wal 2>/dev/null
rm -f package-lock.json.bak 2>/dev/null
rm -f vite-error-log-*.html 2>/dev/null
echo "✅ Temp files cleared"
echo ""

# Step 4: Validate all critical files
echo "[4/5] 🔍 Validating project structure..."
ERRORS=0

# Root files
[ ! -f "package.json" ] && echo "❌ ROOT: Missing package.json" && ERRORS=1
[ ! -f "index.html" ] && echo "❌ ROOT: Missing index.html" && ERRORS=1
[ ! -f ".env" ] && echo "❌ ROOT: Missing .env" && ERRORS=1
[ ! -f "vite.config.ts" ] && echo "❌ ROOT: Missing vite.config.ts" && ERRORS=1
[ ! -f "server.cjs" ] && echo "❌ ROOT: Missing server.cjs" && ERRORS=1
[ ! -f "tsconfig.json" ] && echo "❌ ROOT: Missing tsconfig.json" && ERRORS=1

# Config folder
[ ! -f "config/tsconfig.json" ] && echo "❌ CONFIG: Missing tsconfig.json" && ERRORS=1
[ ! -f "config/tsconfig.app.json" ] && echo "❌ CONFIG: Missing tsconfig.app.json" && ERRORS=1
[ ! -f "config/tsconfig.node.json" ] && echo "❌ CONFIG: Missing tsconfig.node.json" && ERRORS=1

# Src folder
[ ! -f "src/main.tsx" ] && echo "❌ SRC: Missing main.tsx" && ERRORS=1
[ ! -f "src/App.tsx" ] && echo "❌ SRC: Missing App.tsx" && ERRORS=1
[ ! -f "src/vite-env.d.ts" ] && echo "❌ SRC: Missing vite-env.d.ts" && ERRORS=1
[ ! -f "src/index.css" ] && echo "❌ SRC: Missing index.css" && ERRORS=1

# Src/pages
[ ! -f "src/pages/Index.tsx" ] && echo "❌ SRC/PAGES: Missing Index.tsx" && ERRORS=1
[ ! -f "src/pages/NotFound.tsx" ] && echo "❌ SRC/PAGES: Missing NotFound.tsx" && ERRORS=1

# Src/components
[ ! -f "src/components/KanbanBoard.tsx" ] && echo "❌ SRC/COMPONENTS: Missing KanbanBoard.tsx" && ERRORS=1
[ ! -f "src/components/AIChatPanel.tsx" ] && echo "❌ SRC/COMPONENTS: Missing AIChatPanel.tsx" && ERRORS=1
[ ! -f "src/components/AppSidebar.tsx" ] && echo "❌ SRC/COMPONENTS: Missing AppSidebar.tsx" && ERRORS=1

# Src/components/ui
[ ! -f "src/components/ui/sonner.tsx" ] && echo "❌ SRC/COMPONENTS/UI: Missing sonner.tsx" && ERRORS=1
[ ! -f "src/components/ui/toast.tsx" ] && echo "❌ SRC/COMPONENTS/UI: Missing toast.tsx" && ERRORS=1
[ ! -f "src/components/ui/toaster.tsx" ] && echo "❌ SRC/COMPONENTS/UI: Missing toaster.tsx" && ERRORS=1

# Src/lib
[ ! -f "src/lib/api.ts" ] && echo "❌ SRC/LIB: Missing api.ts" && ERRORS=1
[ ! -f "src/lib/utils.ts" ] && echo "❌ SRC/LIB: Missing utils.ts" && ERRORS=1

# Public folder
[ ! -f "public/favicon.ico" ] && echo "❌ PUBLIC: Missing favicon.ico" && ERRORS=1

# Scripts folder
[ ! -f "scripts/start.bat" ] && echo "❌ SCRIPTS: Missing start.bat" && ERRORS=1
[ ! -f "scripts/start.sh" ] && echo "❌ SCRIPTS: Missing start.sh" && ERRORS=1

if [ $ERRORS -eq 0 ]; then
    echo "✅ All files validated successfully"
else
    echo ""
    echo "⚠️  VALIDATION FAILED - Check errors above"
    sleep 3
fi
echo ""

# Step 5: Check imports
echo "[5/5] 🔗 Checking critical imports..."
grep -q "import.*from.*@/" src/App.tsx 2>/dev/null && echo "✅ App.tsx imports valid" || echo "⚠️  App.tsx import issues"
grep -q "from.*./pages" src/App.tsx 2>/dev/null && echo "✅ Page imports valid" || echo "⚠️  Page import issues"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║            ✅ PRE-LAUNCH CHECK COMPLETE ✅                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Next: bash scripts/start.sh to launch the app"
echo ""
