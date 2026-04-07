@echo off
REM Smart Board - Test Automation Script
REM Runs Vitest with coverage

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║          🧪 Smart Board - TEST AUTOMATION 🧪              ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check for test files
if not exist "src\components\*.test.tsx" if not exist "src\lib\*.test.ts" if not exist "server.test.cjs" (
    echo ℹ️  No test files found. Run tests once tests are added.
    echo.
    echo Test file locations:
    echo  - src\components\*.test.tsx
    echo  - src\lib\*.test.ts
    echo  - server.test.cjs
    echo.
    pause
    exit /b 0
)

REM Run tests
echo 🚀 Running Vitest...
echo.
call npm test
echo.

if errorlevel 1 (
    echo ❌ Tests failed
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║          ✅ ALL TESTS PASSED ✅                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
pause
