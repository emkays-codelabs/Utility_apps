@echo off
REM Smart Board - Pre-Launch Validation & Cleanup
REM Run this FIRST before any launch - validates all files and kills processes

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     🔍 Smart Board - PRE-LAUNCH VALIDATION 🔍             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Step 1: Kill ALL Node processes
echo [1/5] 🛑 Killing all Node processes...
powershell -Command "Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue"
timeout /t 2 /nobreak >nul
echo ✅ All processes terminated
echo.

REM Step 2: Free up ports
echo [2/5] 🔓 Freeing ports 3001, 5173-5177...
for %%P in (3001 5173 5174 5175 5176 5177) do (
    for /f "tokens=5" %%A in ('netstat -ano ^| findstr ":%%P "') do (
        taskkill /PID %%A /F >nul 2>&1
    )
)
timeout /t 1 /nobreak >nul
echo ✅ Ports freed
echo.

REM Step 3: Clean temporary files
echo [3/5] 🧹 Cleaning temporary files...
del /q *.log 2>nul
del /q smartboard.db-shm 2>nul
del /q smartboard.db-wal 2>nul
del /q package-lock.json.bak 2>nul
del /q vite-error-log-*.html 2>nul
echo ✅ Temp files cleared
echo.

REM Step 4: Validate all critical files and links
echo [4/5] 🔍 Validating project structure...
set "errors=0"

REM Check root files
if not exist "package.json" (echo ❌ ROOT: Missing package.json & set "errors=1")
if not exist "index.html" (echo ❌ ROOT: Missing index.html & set "errors=1")
if not exist ".env" (echo ❌ ROOT: Missing .env & set "errors=1")
if not exist "vite.config.ts" (echo ❌ ROOT: Missing vite.config.ts & set "errors=1")
if not exist "server.cjs" (echo ❌ ROOT: Missing server.cjs & set "errors=1")
if not exist "tsconfig.json" (echo ❌ ROOT: Missing tsconfig.json & set "errors=1")
if not exist "tailwind.config.ts" (echo ❌ ROOT: Missing tailwind.config.ts & set "errors=1")

REM Check config folder
if not exist "config\tsconfig.json" (echo ❌ CONFIG: Missing tsconfig.json & set "errors=1")
if not exist "config\tsconfig.app.json" (echo ❌ CONFIG: Missing tsconfig.app.json & set "errors=1")
if not exist "config\tsconfig.node.json" (echo ❌ CONFIG: Missing tsconfig.node.json & set "errors=1")

REM Check src folder
if not exist "src\main.tsx" (echo ❌ SRC: Missing main.tsx & set "errors=1")
if not exist "src\App.tsx" (echo ❌ SRC: Missing App.tsx & set "errors=1")
if not exist "src\vite-env.d.ts" (echo ❌ SRC: Missing vite-env.d.ts & set "errors=1")
if not exist "src\index.css" (echo ❌ SRC: Missing index.css & set "errors=1")

REM Check src/pages
if not exist "src\pages\Index.tsx" (echo ❌ SRC/PAGES: Missing Index.tsx & set "errors=1")
if not exist "src\pages\NotFound.tsx" (echo ❌ SRC/PAGES: Missing NotFound.tsx & set "errors=1")

REM Check src/components
if not exist "src\components\KanbanBoard.tsx" (echo ❌ SRC/COMPONENTS: Missing KanbanBoard.tsx & set "errors=1")
if not exist "src\components\KanbanCard.tsx" (echo ❌ SRC/COMPONENTS: Missing KanbanCard.tsx & set "errors=1")
if not exist "src\components\KanbanColumn.tsx" (echo ❌ SRC/COMPONENTS: Missing KanbanColumn.tsx & set "errors=1")
if not exist "src\components\AIChatPanel.tsx" (echo ❌ SRC/COMPONENTS: Missing AIChatPanel.tsx & set "errors=1")
if not exist "src\components\AppSidebar.tsx" (echo ❌ SRC/COMPONENTS: Missing AppSidebar.tsx & set "errors=1")
if not exist "src\components\AddTaskDialog.tsx" (echo ❌ SRC/COMPONENTS: Missing AddTaskDialog.tsx & set "errors=1")
if not exist "src\components\EditTaskDialog.tsx" (echo ❌ SRC/COMPONENTS: Missing EditTaskDialog.tsx & set "errors=1")

REM Check src/components/ui
if not exist "src\components\ui\sonner.tsx" (echo ❌ SRC/COMPONENTS/UI: Missing sonner.tsx & set "errors=1")
if not exist "src\components\ui\toast.tsx" (echo ❌ SRC/COMPONENTS/UI: Missing toast.tsx & set "errors=1")
if not exist "src\components\ui\toaster.tsx" (echo ❌ SRC/COMPONENTS/UI: Missing toaster.tsx & set "errors=1")
if not exist "src\components\ui\tooltip.tsx" (echo ❌ SRC/COMPONENTS/UI: Missing tooltip.tsx & set "errors=1")

REM Check src/lib
if not exist "src\lib\api.ts" (echo ❌ SRC/LIB: Missing api.ts & set "errors=1")
if not exist "src\lib\utils.ts" (echo ❌ SRC/LIB: Missing utils.ts & set "errors=1")

REM Check public folder
if not exist "public\favicon.ico" (echo ❌ PUBLIC: Missing favicon.ico & set "errors=1")
if not exist "public\robots.txt" (echo ❌ PUBLIC: Missing robots.txt & set "errors=1")

REM Check scripts folder
if not exist "scripts\start.bat" (echo ❌ SCRIPTS: Missing start.bat & set "errors=1")
if not exist "scripts\start.sh" (echo ❌ SCRIPTS: Missing start.sh & set "errors=1")
if not exist "scripts\stop.bat" (echo ❌ SCRIPTS: Missing stop.bat & set "errors=1")

if !errors! equ 0 (
    echo ✅ All files validated successfully
) else (
    echo.
    echo ⚠️  VALIDATION FAILED - Check errors above
    timeout /t 3 /nobreak >nul
)
echo.

REM Step 5: Check imports and links
echo [5/5] 🔗 Checking critical imports...
findstr /r "import.*from.*@/" src\App.tsx >nul 2>&1 && (
    echo ✅ App.tsx imports valid
) || (
    echo ⚠️  App.tsx import issues
)

findstr /r "from.*\./pages" src\App.tsx >nul 2>&1 && (
    echo ✅ Page imports valid
) || (
    echo ⚠️  Page import issues
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║            ✅ PRE-LAUNCH CHECK COMPLETE ✅                ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Next: Run scripts\start.bat to launch the app
echo.
pause
