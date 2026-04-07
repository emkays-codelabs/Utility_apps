# 🎯 Smart Board - Quick Reference

One-page guide for everything you need to know.

---

## 🚀 Local Development

```bash
cd Utility_apps/smart-board

# First time
npm install --legacy-peer-deps

# Every time
npm run dev
```

**Result:**
- Backend: http://localhost:3001
- Frontend: http://127.0.0.1:5173
- Both in ONE terminal ✅

---

## 🌐 Deploy to Vercel (Optional)

### Prerequisites
- ngrok account (free): https://ngrok.com
- Vercel account (free): https://vercel.com

### 3 Terminal Approach

**Terminal 1 - App:**
```bash
npm run dev
```

**Terminal 2 - Expose backend:**
```bash
ngrok http 3001
# Copy: https://abc-123-xyz.ngrok-free.app
```

**Terminal 3 - Deploy:**
```bash
npx vercel env add VITE_API_URL production
# Paste: https://abc-123-xyz.ngrok-free.app/api

npx vercel --prod
```

**Done!** ✅ Your Vercel URL is live.

---

## 📁 Project Structure

```
smart-board/
├── src/
│   ├── components/          # React components
│   ├── pages/               # Pages (Index, NotFound)
│   ├── lib/
│   │   ├── api.ts          # ← Uses VITE_API_URL env var
│   │   └── utils.ts
│   ├── types/
│   │   └── kanban.ts       # Task types
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── server.cjs              # Express backend
├── vite.config.ts          # Vite config (no changes needed)
├── vercel.json             # ← Created for deployment
├── .npmrc                  # ← Created (legacy-peer-deps)
├── .env                    # OPENAI_API_KEY (git-ignored)
├── .env.example            # Template
├── package.json            # Dependencies
├── tailwind.config.ts      # Styling
├── tsconfig.json           # TypeScript
└── docs/                   # Documentation
    ├── SETUP.md           # Quick start
    ├── DEPLOYMENT.md      # Deploy guide
    └── QUICK_REFERENCE.md # (this file)
```

---

## 🔧 Backend API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/tasks` | Fetch tasks (with filters) |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/reports/summary` | Get analytics |
| POST | `/api/chat` | Send to AI |

**Base URL in code:**
- Local dev: `/api` (Vite proxy)
- Vercel prod: `VITE_API_URL` env var (embedded at build time)

---

## 🔑 Environment Variables

| Variable | Where | Purpose | Example |
|----------|-------|---------|---------|
| `OPENAI_API_KEY` | `.env` (local only) | AI chat via Euron API | `euri-c5d41b...` |
| `VITE_API_URL` | Vercel env vars (prod only) | Frontend → backend URL | `https://xyz.ngrok-free.app/api` |

**Important:**
- ✅ `.env` is git-ignored (never commit)
- ✅ `VITE_` vars are baked into frontend at build time
- ✅ Don't set `VITE_API_URL` locally (breaks Vite proxy)

---

## 🛠️ npm Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start backend + frontend (local dev) |
| `npm run build` | Build for production (Vite) |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests (Vitest) |
| `npm run verify` | Verify project integrity (Python) |

---

## 🔐 Architecture

### Local
```
Your Machine
├── React frontend (port 5173)
├── Express backend (port 3001)
└── SQLite database (smartboard.db)
```

### Deployed
```
Vercel
└── React frontend (static files)
    ↓
    (calls via VITE_API_URL)
    ↓
Your Machine (ngrok tunnel)
├── Express backend (port 3001)
└── SQLite database (smartboard.db)
```

---

## 🐛 Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| "Cannot find module" | Missing dependencies | `npm install --legacy-peer-deps` |
| "Port 3001/5173 in use" | Another process | `taskkill /IM node.exe /F` |
| "Cannot connect" in browser | Wrong address | Use `127.0.0.1:5173` not `localhost` |
| Build fails on Vercel | Peer deps issue | `.npmrc` contains `legacy-peer-deps=true` ✅ |
| API returns 404 in Vercel | Missing env var | Set `VITE_API_URL` in Vercel settings |
| ngrok disconnects | Tunnel ended | Restart: `ngrok http 3001` |

---

## 📊 Tech Stack at a Glance

| Layer | Tech | Version |
|-------|------|---------|
| Frontend | React + TypeScript + Vite | 18 + 5.x |
| Styling | Tailwind CSS + shadcn/ui | 3.4 |
| Animations | Framer Motion | 12.x |
| Backend | Express.js | 5.x |
| Database | SQLite (better-sqlite3) | 12.x |
| AI | OpenAI SDK (Euron API) | 6.x |

---

## 🔗 Important Links

| Resource | URL |
|----------|-----|
| **Main README** | [README.md](../README.md) |
| **Setup Guide** | [docs/SETUP.md](SETUP.md) |
| **Deployment** | [docs/DEPLOYMENT.md](DEPLOYMENT.md) |
| **Euron API** | https://api.euron.one |
| **Vercel** | https://vercel.com |
| **ngrok** | https://ngrok.com |

---

## ⚡ TL;DR

**Local:** `npm run dev` → http://127.0.0.1:5173

**Deploy:** `npx vercel --prod` (after setting `VITE_API_URL`)

**API Key:** Get from https://api.euron.one

**Stuck?** Check [DEPLOYMENT.md](DEPLOYMENT.md) or main README

---

**Last Updated:** 2026-04-07

**Status:** ✅ Ready to use locally & deploy to Vercel
