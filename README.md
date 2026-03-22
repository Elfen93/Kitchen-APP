# 買い物 Cook — Deployment Guide

## Stack
- **Frontend**: React + Vite
- **API proxy**: Vercel serverless function (`/api/generate.js`)
- **AI**: Anthropic claude-opus-4-5 (via server-side proxy)
- **Hosting**: Vercel (free tier)

---

## Deploy in 10 minutes

### 1. Get an Anthropic API key
Go to → https://console.anthropic.com  
Create an account, go to **API Keys**, click **Create Key**.  
Copy it — you'll need it in step 4.

---

### 2. Push to GitHub

```bash
# In this folder:
git init
git add .
git commit -m "initial commit"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/kaimono-cook.git
git push -u origin main
```

---

### 3. Deploy to Vercel

1. Go to → https://vercel.com
2. Click **Add New Project**
3. Import your GitHub repo
4. Vercel auto-detects Vite — no config needed
5. Click **Deploy**

---

### 4. Add your API key (IMPORTANT)

In Vercel dashboard → your project → **Settings** → **Environment Variables**

Add these two:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-...your key...` |
| `ALLOWED_ORIGIN` | `https://your-app.vercel.app` |

Then go to **Deployments** → click **Redeploy** so the variables take effect.

---

### 5. Make it installable as an app (PWA)

The `manifest.json` is already set up. Users can:
- **iPhone**: Open in Safari → Share → "Add to Home Screen"
- **Android**: Open in Chrome → menu → "Add to Home Screen" or "Install app"

It will appear on the home screen like a native app.

---

## Local development

```bash
npm install
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

npm run dev
# Open http://localhost:5173
```

The `/api/generate.js` proxy runs automatically in Vercel dev:
```bash
npm install -g vercel
vercel dev
# Open http://localhost:3000
```

---

## How the API proxy works

```
Browser → /api/generate (YOUR server) → api.anthropic.com
```

The browser **never** sees your API key. It only calls `/api/generate`
on your own domain. The serverless function adds the secret key and
forwards the request to Anthropic.

This is why you can't call Anthropic directly from the browser —
CORS blocks it, and it would expose your key.

---

## Future: native mobile app

When you're ready for App Store / Google Play:

1. Use **Expo** → `npx create-expo-app kaimono-native`
2. Port the components from React to React Native
   - `div` → `View`
   - `p`, `span` → `Text`  
   - `img` → `Image`
   - inline styles → `StyleSheet.create()`
3. The API calls, logic, and data stay identical
4. Submit to App Store ($99/year) and Google Play ($25 one-time)

---

## File structure

```
kaimono-cook/
├── api/
│   └── generate.js      ← Serverless proxy (API key lives here)
├── public/
│   └── manifest.json    ← PWA config
├── src/
│   ├── main.jsx         ← React entry point
│   └── App.jsx          ← Entire app (2000+ lines)
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── .env.example         ← Copy to .env.local
```
