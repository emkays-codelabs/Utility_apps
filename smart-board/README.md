# 🚀 Smart Board - AI-Powered Task Management

A modern, full-stack task management application with AI assistance, built with React, Express, Vite, and SQLite.

---

## ✨ Features

### ✅ Fully Implemented & Working

-   **Dark Mode** - Click sun/moon icon (top-right) to toggle light/dark theme
-   **Kanban Board** - 4 columns: To Do, In Progress, Review, Done
-   **Drag & Drop** - Move tasks between columns
-   **AI Chat** - gpt-4.1-nano assistant (click chat icon)
-   **Task Management** - Create, edit, delete tasks
-   **Priority Levels** - High, Medium, Low, None
-   **Due Dates** - Track task deadlines
-   **Board Analytics** - View statistics in sidebar
-   **Auto-Save** - Database saves on shutdown
-   **Responsive Design** - Works on desktop and mobile
-   **Enhanced Filters (Backend)** - API ready with column, assignee, date filters

### 📖 Core Features Working Now

All essential task management features are fully implemented and ready to use:


## 🔍 Verification Status

**Last Verified**: 2026-04-07 08:14:29

| Check | Status |
|-------|--------|
| Essential Files | ✅ PASS |
| Project Structure | ✅ PASS |
| Markdown Links | ✅ PASS |
| Broken References | ✅ PASS |
| Database Integrity | ✅ PASS |
| Script Availability | ✅ PASS |

**Errors**: 0 | **Warnings**: 1 | **Fixes**: 2

See [CHANGELOG.md](docs/CHANGELOG.md) for detailed history.

---

---

## 🛠️ Tech Stack

**Frontend**:

-   React 18 + TypeScript + Vite
-   Tailwind CSS + shadcn/ui
-   Framer Motion (animations)
-   React Router v6
-   next-themes (dark mode)

**Backend**:

-   Express.js
-   SQLite (better-sqlite3)
-   OpenAI SDK (Euron API)

**AI**:

-   Model: gpt-4.1-nano
-   Provider: Euron API

---

## 📊 Project Structure

```
smart-board/
├── README.md                  # This file
├── index.html                 # Vite entry point
├── server.cjs                 # Express backend
├── vite.config.ts             # Vite config
├── tsconfig.json              # TypeScript config
├── .env                       # API key configuration
├── package.json               # Dependencies
├── src/
│   ├── App.tsx                # Root component
│   ├── main.tsx               # Entry point
│   ├── pages/                 # Pages (Index, NotFound)
│   ├── components/            # React components
│   ├── lib/                   # API & utilities
│   ├── types/                 # TypeScript types
│   └── index.css              # Global styles
├── scripts/
│   ├── build.bat/sh           # Build for production
│   ├── test.bat/sh            # Run tests
│   ├── pre-launch.bat/sh      # Pre-launch validation
│   └── verify.bat/sh          # Link & structure check
└── smartboard.db              # SQLite database (auto-created)
```

---

## 💾 Database

-   **Type**: SQLite
-   **File**: smartboard.db
-   **Features**:
    -   WAL mode for concurrent access
    -   Auto-save on shutdown
    -   Auto-recovery on restart
    -   Your data is safe!

---

## 🤖 AI Features

The app includes AI assistance powered by:

-   **Provider**: Euron API
-   **Model**: gpt-4.1-nano
-   **Capabilities**:
    -   Board summaries
    -   Task suggestions
    -   Priority recommendations
    -   Custom prompts

Just click the chat icon (bottom-right) and ask away!

### API Key Setup

The API key is stored in `.env` file (git-ignored for security):

**To set up your API key:**

1.  Get your API key from: [https://api.euron.one](https://api.euron.one)
2.  Copy `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```
3.  Open `.env` and replace with your actual key
4.  Restart the app

⚠️ **Never commit `.env` to git** - it's already in `.gitignore`

---

## 🚀 QUICK START - 3 Simple Steps

### First Time Only - Setup (2 minutes)

```bash
# 1. Navigate to project folder
cd c:\00_AI_Architect\20_Real_World_Projects\personal_projects\smart-board

# 2. Install dependencies (ONE TIME ONLY)
npm install --legacy-peer-deps
```

### Every Launch - Run the App (3 steps)

**Step 1:** In terminal, navigate to the smart-board folder and run:

```bash
npm run dev
```

Wait 10 seconds. You should see:

```
[Backend] ✅ Smart Board API running at http://localhost:3001
[Frontend] ➜ Local: http://127.0.0.1:5173/
```

**Step 2:** Open your browser and go to:

```
http://127.0.0.1:5173
```

**Step 3:** Enjoy! When done, press `Ctrl+C` in the terminal to stop.

---

## 📋 WHAT'S HAPPENING?

When you run `npm run dev`:

-   **Backend**: Node.js server starting on port 3001 (processes all task data)
-   **Frontend**: Vite dev server starting on port 5173 (shows the app in browser)
-   **Both**: Running in ONE terminal window automatically

---

## ⚠️ Important Notes

-   **Use `127.0.0.1:5173`** in browser (NOT localhost)
-   **First startup takes ~10 seconds** - be patient!
-   **Ctrl+C stops both** - Your data auto-saves to database
-   **Next time just run `npm run dev`** - No need to reinstall

---

## ✅ First Time Setup Checklist

- [ ] Open terminal (Windows: `Windows Key + R` → `powershell`)
- [ ] Navigate: `cd c:\00_AI_Architect\20_Real_World_Projects\personal_projects\smart-board`
- [ ] Install: `npm install --legacy-peer-deps` (wait 1-2 min)
- [ ] Run: `npm run dev` (wait 10 seconds)
- [ ] Open browser: `http://127.0.0.1:5173`
- [ ] Enter your name and click "Let's Go"
- [ ] See the Kanban board with 4 columns (To Do, In Progress, Review, Done)

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| npm dependency conflict error | Run `npm install --legacy-peer-deps` (fixes Vite plugin issue) |
| "Cannot find module" | Run `npm install --legacy-peer-deps` again |
| "Port already in use" (3001 or 5173) | Kill existing Node process: `taskkill /IM node.exe /F` then run `npm run dev` again |
| "Cannot connect" in browser | Use `http://127.0.0.1:5173` NOT `localhost:5173` |
| App won't load / blank screen | Wait 10 more seconds for Vite to compile, then refresh browser (F5) |
| Backend crashes with error | Check the error message in terminal - usually a missing `.env` file or database issue |
| "Address already in use" error | Another app is using port 3001 or 5173. Kill it or close the port-using app |

---

## 🎯 Quick Links

Service

URL

**Frontend**

[http://127.0.0.1:5173](http://127.0.0.1:5173)

**Backend API**

[http://127.0.0.1:3001](http://127.0.0.1:3001)

---

## ✅ Status

**Production Ready** ✨

Core features working:

-   ✅ Task management
-   ✅ AI chat
-   ✅ Dark mode
-   ✅ Database persistence
-   ✅ Responsive UI

---

## 📝 Summary

What

Details

**Launch**

Two terminals: `node server.cjs` + `npx vite`

**Open**

[http://127.0.0.1:5173](http://127.0.0.1:5173)

**Features**

11 working + 8 documented

**Database**

SQLite, auto-saves

**AI**

gpt-4.1-nano via Euron API

**Time to add features**

15-40 min each (code included)

---

**Ready to launch? Follow the Getting Started section above!** 🎉
