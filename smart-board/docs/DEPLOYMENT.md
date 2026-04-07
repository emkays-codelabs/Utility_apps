# 🚀 Smart Board - Deployment Guide

Deploy your Smart Board frontend to **Vercel** while keeping the Express backend running **locally**.

---

## 📋 Architecture Overview

```
Your Computer (Local)
├── Express Backend (port 3001) ← SQLite database
└── ngrok tunnel → https://your-domain.ngrok-free.app

Vercel (Cloud)
└── React Frontend → calls https://your-domain.ngrok-free.app/api
```

**Benefits:**
- ✅ Frontend is live and shareable
- ✅ Backend stays on your machine (full control)
- ✅ No database migration needed (SQLite stays local)
- ✅ AI chat works via Euron API

---

## 🔧 Prerequisites

- [ ] ngrok account (free): https://ngrok.com
- [ ] Vercel account (free): https://vercel.com
- [ ] Node.js + npm installed
- [ ] Smart Board code locally (this repo)

---

## Step-by-Step Deployment

### Step 1: Install ngrok

**Option A: Using winget (Windows)**
```bash
winget install ngrok
```

**Option B: From website**
- Download: https://ngrok.com/download
- Extract and add to PATH

**Verify:**
```bash
ngrok --version
```

---

### Step 2: Authenticate ngrok

1. Sign up at https://ngrok.com (free account)
2. Dashboard → Auth Token → copy your token
3. Run in terminal:
   ```bash
   ngrok config add-authtoken YOUR_TOKEN_HERE
   ```

---

### Step 3: Start your Smart Board locally

**Terminal 1 - Start backend + frontend:**
```bash
cd Utility_apps/smart-board
npm run dev
```

You should see:
```
[Backend] ✅ Smart Board API running at http://localhost:3001
[Frontend] ➜ Local: http://127.0.0.1:5173/
```

**Verify it works:**
- Open http://127.0.0.1:5173 in browser
- Enter your name, create a task, test AI chat
- ✅ Confirm everything works locally

---

### Step 4: Expose backend via ngrok tunnel

**Terminal 2 - Start ngrok:**
```bash
ngrok http 3001
```

You'll see output like:
```
Session Status    online
Account           your-email@example.com
Version           3.x.x
Region            us
Forwarding        https://abc-123-xyz.ngrok-free.app -> http://localhost:3001
```

**Copy this URL:** `https://abc-123-xyz.ngrok-free.app` (you'll need it in Step 6)

---

### Step 5: Set Vercel environment variable

In **Terminal 3**, set the API URL that Vercel will use:

```bash
cd Utility_apps/smart-board
npx vercel env rm VITE_API_URL
npx vercel env add VITE_API_URL production
```

**When prompted, paste:**
```
https://abc-123-xyz.ngrok-free.app/api
```

(Replace `abc-123-xyz` with your actual ngrok URL, and **include `/api` at the end**)

---

### Step 6: Deploy to Vercel

Still in **Terminal 3**:

```bash
npx vercel --prod
```

The build will:
1. Install dependencies
2. Build React + Vite bundle
3. Embed the ngrok URL into the code
4. Deploy to Vercel

You'll see:
```
🔍  Inspect: https://vercel.com/...
⏳  Production: https://planpilot-xxxxx.vercel.app
```

**That's your live app!** ✨

---

### Step 7: Verify deployment

**Test in browser:**
1. Open the Vercel URL: `https://planpilot-xxxxx.vercel.app`
2. Open DevTools → Network tab
3. Create a task
4. **Confirm API calls go to `https://abc-123-xyz.ngrok-free.app/api/...`** (NOT to Vercel domain)
5. Test features:
   - ✅ Create/edit/delete tasks
   - ✅ Dark mode toggle
   - ✅ AI chat (bottom-right)
   - ✅ Sidebar analytics

**✅ You're live!** 🎉

---

## 📌 Important Notes

### ngrok URL Changes (Free Plan)

The free ngrok tunnel URL changes every time you restart `ngrok http 3001`. This means:

**Every session, you need to:**
1. Start ngrok (get new URL)
2. Update `VITE_API_URL` in Vercel
3. Redeploy to Vercel

**To avoid this hassle:** Get a free static domain from ngrok
1. Dashboard → Cloud Edge → Domains → Claim 1 free domain
2. Run: `ngrok http --domain=your-domain.ngrok-free.app 3001`
3. This URL never changes → deploy once, done!

---

### Local Development Still Works

Your local workflow is **unchanged**:

```bash
npm run dev
```

- Vite proxy still forwards `/api` to `localhost:3001`
- No VITE_API_URL in local `.env` (that's for production only)
- Everything works as before

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| **Build fails with "npm install exited with 1"** | The `.npmrc` file contains `legacy-peer-deps=true`. Verify it exists. |
| **API calls return 404** | Check that `VITE_API_URL` is set correctly in Vercel env vars (Settings → Environment Variables). |
| **ngrok tunnel disconnects** | Restart: `ngrok http 3001`. Get a static domain to avoid redeploying. |
| **"Your account requires further verification" on Vercel** | Contact Vercel support at https://vercel.com/support. Verify your email in the meantime. |
| **Tasks don't persist after refresh** | Confirm the SQLite database (`smartboard.db`) exists locally. Check Terminal 1 logs. |
| **AI chat shows "⚠️ AI failed"** | Verify `OPENAI_API_KEY` is set in local `.env`. Backend needs it (Vercel doesn't run backend). |

---

## 📂 Files Modified for Deployment

```
smart-board/
├── src/lib/api.ts           (updated: line 3 reads VITE_API_URL)
├── vercel.json              (created: build config + SPA routing)
├── .npmrc                   (created: legacy-peer-deps=true)
└── [unchanged: server.cjs, components, database]
```

---

## 🔐 Security Notes

- ✅ `.env` with `OPENAI_API_KEY` is git-ignored (never uploaded)
- ✅ CORS enabled on Express backend (handles Vercel requests)
- ✅ `VITE_` variables are baked into the frontend (public — this is normal)
- ⚠️ ngrok free URLs are public (anyone with the URL can access your backend)

---

## Next Steps

1. **Keep backend running locally** while testing
2. **Share the Vercel URL** with others (it calls your local backend via ngrok)
3. **For permanent deployment**: Consider moving backend to a cloud service (Railway, Render, Fly.io)

---

## Quick Reference Commands

```bash
# Local dev (2 terminals)
npm run dev                                    # Terminal 1
ngrok http 3001                               # Terminal 2

# Deploy to Vercel
npx vercel env add VITE_API_URL production    # Set env var
npx vercel --prod                             # Deploy

# Redeploy after ngrok URL changes
npx vercel env rm VITE_API_URL
npx vercel env add VITE_API_URL production    # New URL
npx vercel --prod --force                     # Redeploy
```

---

**Questions? Check the main [README.md](../README.md) or the [Troubleshooting](#-troubleshooting) section above.**

**Ready to deploy? Follow Steps 1-7 above!** 🚀
