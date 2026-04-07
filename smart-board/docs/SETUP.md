# ⚡ Quick Setup Guide

Get Smart Board running in **5 minutes**.

---

## 📋 Checklist

### Setup (2 minutes - One Time Only)

- [ ] **Clone/download** the project
- [ ] **Get API key** from https://api.euron.one
- [ ] **Create `.env` file:**
  ```bash
  # In smart-board folder, create .env with:
  OPENAI_API_KEY=your_key_here
  ```

### Run (3 minutes - Every Time)

- [ ] **Terminal:** `npm install --legacy-peer-deps` (first time only)
- [ ] **Terminal:** `npm run dev`
- [ ] **Browser:** Open http://127.0.0.1:5173
- [ ] **Enter name** and click "Let's Go"
- [ ] **✅ See Kanban board!**

---

## 🚀 Commands

**First time:**
```bash
cd Utility_apps/smart-board
npm install --legacy-peer-deps
```

**Every launch:**
```bash
npm run dev
```

**Stop:**
```bash
Ctrl+C
```

---

## ✨ What You Get

- ✅ 4-column Kanban board (To Do, In Progress, Review, Done)
- ✅ Drag & drop tasks
- ✅ Create/edit/delete tasks
- ✅ AI chat assistant (bottom-right)
- ✅ Dark mode (top-right toggle)
- ✅ Analytics sidebar (left)

---

## 🆘 Issues?

| Issue | Fix |
|-------|-----|
| "Cannot find module" | Run `npm install --legacy-peer-deps` |
| "Port already in use" | Kill Node: `taskkill /IM node.exe /F` |
| "Cannot connect" | Use `http://127.0.0.1:5173` (NOT localhost) |
| "App won't load" | Wait 10 seconds, then refresh (F5) |

---

## 📚 Next Steps

- **Want to deploy?** → See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Want details?** → See main [README.md](../README.md)
- **Want to code?** → See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

---

## 🎯 API Key in 30 Seconds

1. Go to https://api.euron.one
2. Sign up (free)
3. Copy your API key
4. Paste into `.env` file
5. Done! ✅

---

**That's it! You're ready to go.** 🎉
