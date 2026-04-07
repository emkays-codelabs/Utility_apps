@echo off
REM Smart Board - Build Automation Script
REM Runs linting, tests, and production build

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║          🏗️  Smart Board - BUILD AUTOMATION 🏗️            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Step 1: Lint
echo [1/4] 📝 Running ESLint...
call npm run lint
if errorlevel 1 (
    echo ❌ Linting failed
    exit /b 1
)
echo ✅ Linting passed
echo.

REM Step 2: Test
echo [2/4] 🧪 Running tests...
call npm test
if errorlevel 1 (
    echo ⚠️  Some tests failed (continuing build)
)
echo ✅ Tests completed
echo.

REM Step 3: Build
echo [3/4] 🔨 Building project...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed
    exit /b 1
)
echo ✅ Build successful
echo.

REM Step 4: Report
echo [4/4] 📊 Build report...
if exist dist (
    for /f "usebackq" %%A in (`powershell -Command "'{0:N0} KB' -f ((Get-ChildItem -Path dist -Recurse | Measure-Object -Property Length -Sum).Sum / 1024)"`) do set "size=%%A"
    echo Bundle size: !size!
) else (
    echo ⚠️  dist folder not found
)
echo.

echo ╔════════════════════════════════════════════════════════════╗
echo ║          ✅ BUILD COMPLETE ✅                             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Output: dist/
echo.
pause
