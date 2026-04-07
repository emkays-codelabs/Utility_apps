@echo off
REM Smart Board - Verification & Link Check Script

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     🔍 Smart Board - VERIFICATION ^& LINK CHECK 🔍         ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

setlocal enabledelayedexpansion
set ERRORS=0
set WARNINGS=0

echo 📋 Checking essential files...

for %%F in (
  "package.json"
  "index.html"
  "server.cjs"
  "vite.config.ts"
  "tsconfig.json"
  "README.md"
  ".env"
  "src\App.tsx"
  "src\main.tsx"
) do (
  if exist %%F (
    echo   ✅ %%F
  ) else (
    echo   ❌ %%F (MISSING)
    set /a ERRORS=!ERRORS!+1
  )
)

echo.
echo 🔗 Checking links in README.md...

findstr "IMPLEMENTATION_GUIDE" README.md >nul 2>&1
if not errorlevel 1 (
  echo   ⚠️  WARNING: Found broken reference to IMPLEMENTATION_GUIDE.md
  set /a WARNINGS=!WARNINGS!+1
)

findstr "127.0.0.1:5173" README.md >nul 2>&1
if errorlevel 1 (
  echo   ❌ Frontend URL not found
  set /a ERRORS=!ERRORS!+1
) else (
  echo   ✅ Frontend URL documented
)

findstr "127.0.0.1:3001" README.md >nul 2>&1
if errorlevel 1 (
  echo   ❌ Backend URL not found
  set /a ERRORS=!ERRORS!+1
) else (
  echo   ✅ Backend URL documented
)

echo.
echo 📦 Checking project structure...

for %%D in (
  "src"
  "src\components"
  "src\lib"
  "src\types"
  "src\pages"
  "scripts"
) do (
  if exist %%D\ (
    echo   ✅ %%D\
  ) else (
    echo   ❌ %%D\ (MISSING)
    set /a ERRORS=!ERRORS!+1
  )
)

echo.
echo ✨ Database check...
if exist "smartboard.db" (
  echo   ✅ smartboard.db exists
) else (
  echo   ⚠️  smartboard.db not found (will be created on first run)
  set /a WARNINGS=!WARNINGS!+1
)

echo.
echo 📋 Scripts available...
if exist "scripts\build.bat" echo   ✅ build.bat
if exist "scripts\test.bat" echo   ✅ test.bat
if exist "scripts\pre-launch.bat" echo   ✅ pre-launch.bat

echo.
echo ════════════════════════════════════════════════════════════
echo SUMMARY:
echo   ⚠️  Warnings: !WARNINGS!
echo   ❌ Errors: !ERRORS!
echo ════════════════════════════════════════════════════════════

if !ERRORS! equ 0 (
  echo ✅ Project structure is valid!
  pause
  exit /b 0
) else (
  echo ❌ Fix the errors above before launching
  pause
  exit /b 1
)
