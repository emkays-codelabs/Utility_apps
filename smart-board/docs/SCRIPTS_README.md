# 🔧 Smart Board - Scripts Reference

This directory contains automation scripts for building, testing, and validating the Smart Board application.

---

## 📋 Available Scripts

### 🚀 **Launch the App (Simplified)**

**Recommended approach** - Just use npm:

```bash
npm run dev
```

This runs both backend and frontend in a single terminal using `concurrently`.

---

### 🔍 **verify.bat / verify.sh**

**Purpose**: Check project structure and all links are valid

**What it does**:
1. ✅ Validates all essential files exist
2. ✅ Checks links in README.md
3. ✅ Verifies project structure
4. ✅ Reports any broken references

**When to run**: Before launching or after making changes

**Exit codes**:
- 0 = All checks pass ✅
- 1 = Errors found ❌

**Usage**:
```bash
# Windows
scripts\verify.bat

# Mac/Linux
bash scripts/verify.sh
```

---

### 🔨 **build.bat / build.sh**

**Purpose**: Build the application for production

**What it does**:
1. Runs `npm run lint` (checks code quality)
2. Runs `npm test` (runs tests)
3. Runs `npm run build` (creates optimized production build)
4. Reports bundle size

**Output**: `dist/` folder with optimized files

**When to run**: Before deploying or when preparing for release

**Usage**:
```bash
# Windows
scripts\build.bat

# Mac/Linux
bash scripts/build.sh
```

---

### 🧪 **test.bat / test.sh**

**Purpose**: Run automated tests

**What it does**:
1. Runs `npm test` using Vitest
2. Shows test results and coverage

**When to run**: During development or before committing

**Usage**:
```bash
# Windows
scripts\test.bat

# Mac/Linux
bash scripts/test.sh
```

---

### 🛑 **pre-launch.bat / pre-launch.sh**

**Purpose**: Pre-launch validation and cleanup (optional)

**What it does**:
1. Kills any leftover Node processes
2. Cleans temporary files
3. Validates critical files exist

**When to run**: If having issues launching the app

**Usage**:
```bash
# Windows
scripts\pre-launch.bat

# Mac/Linux
bash scripts/pre-launch.sh
```

---

## 🚀 Quick Start Guide

### First Time (One-time setup):

```bash
npm install --legacy-peer-deps
```

### Every Launch:

```bash
npm run dev
```

Wait 10 seconds, then open browser to: `http://127.0.0.1:5173`

### To Stop:

Press `Ctrl+C` in the terminal

### Before Deploying:

```bash
bash scripts/build.sh    # or scripts\build.bat on Windows
```

---

## 🔍 Validation with verify

Run this to check everything is working:

```bash
bash scripts/verify.sh   # or scripts\verify.bat on Windows
```

Expected output:
```
✅ All essential files present
✅ Frontend URL documented
✅ Backend URL documented
✅ Project structure valid
✅ Database exists
```

---

## 📋 npm Scripts (in package.json)

| Script | Purpose |
|--------|---------|
| `npm run dev` | 🚀 Launch app (backend + frontend) |
| `npm run server` | Run backend only |
| `npm run dev:frontend` | Run frontend only |
| `npm run build` | Build for production |
| `npm run lint` | Check code quality |
| `npm run test` | Run tests |
| `npm test:watch` | Tests with auto-reload |

---

## 💡 Tips

1. **Use `npm run dev`** - Single command, single terminal
2. **Use `127.0.0.1`** - Not `localhost` (works better in browsers)
3. **Press Ctrl+C** - Graceful shutdown, database saves automatically
4. **Run verify before launch** - Catches issues early
5. **Data is safe** - Auto-saves to SQLite on shutdown

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| App won't start | Run: `npm install --legacy-peer-deps` |
| Port already in use | Run: `taskkill /IM node.exe /F` then `npm run dev` |
| Vite compilation error | Clear: `.vite/deps/` folder, run `npm run dev` again |
| Links don't work | Run: `bash scripts/verify.sh` to check |

---

**Happy coding!** 🎉
