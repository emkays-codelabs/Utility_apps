@echo off
REM Smart Board - Complete Verification Wrapper
REM Runs the Python verification script and displays results

setlocal enabledelayedexpansion

echo.
echo ==================================================
echo   Smart Board - Automated Verification
echo ==================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python 3 is required but not installed.
    echo Install from: https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Change to project root
cd /d "%~dp0.." || exit /b 1

REM Run verification
python verify.py %*
set EXIT_CODE=!errorlevel!

echo.
if !EXIT_CODE! equ 0 (
    echo ✅ Verification completed successfully
    echo.
    echo Generated files:
    echo   - docs\CHANGELOG.md
    echo   - docs\PROJECT_STRUCTURE.md
    echo   - docs\VERIFICATION_REPORT.json
    echo   - README.md (updated with verification badge)
    echo.
    echo View details:
    echo   - type docs\CHANGELOG.md
    echo   - type docs\PROJECT_STRUCTURE.md
    echo   - type docs\VERIFICATION_REPORT.json
) else (
    echo ❌ Verification failed with errors
    echo Review output above and fix issues
)

pause
exit /b !EXIT_CODE!
