# 買い物 Cook — eat well in Japan for less

A free, installable web app for people living in Japan on a tight budget — especially people who
have just arrived and can't read supermarket labels yet.

- **Cook** — 40 tested budget recipes, plus new ones generated for your budget, diet, allergies and
  what's already in your kitchen. Cost per serving is compared to your per-meal budget.
- **Pantry** — mark what you have; recipes that use it go first, so less food is wasted.
- **List** — one shopping list for several recipes (same ingredients merged), with a large
  日本語 mode to show store staff. Log the receipt total when you're done.
- **Budget** — weekly spending tracker: how much is left and what that means per day.
- **Real prices** — tap any ingredient price and enter what you pay; every recipe updates.
- **Diet & allergies** — derived from the ingredients themselves (EN + JA), not hand-written tags.
  Bonito dashi counts as fish, soy sauce counts as wheat, mirin counts as alcohol. Generated
  recipes are re-checked on the device and dropped if they conflict.
- **Guide** — which stores are cheap for what, label words (半額, 消費期限…), seasonal produce.
- **Community** — optional shared recipes (needs a Redis store, see below).

Everything personal (budget, pantry, list, favourites, prices) stays in the browser's
localStorage. There are no accounts and no analytics.

## Stack

- React 18 + Vite (no UI framework, one CSS file with light/dark tokens)
- Vercel serverless functions in `api/`
- Claude API via the official `@anthropic-ai/sdk`, with structured outputs (Zod schema)

```
api/
  generate.js        POST — builds the prompt server-side, returns validated recipe JSON
  community.js       GET/POST — shared recipes (optional, Upstash/Vercel Redis REST)
  _lib/http.js       body parsing, origin check, per-IP rate limit
src/
  App.jsx            tabs, persisted state, recipe sheet
  views/             Cook, Pantry, List, Saved, More (budget & diet, guide, community, about)
  components/        RecipeCard, RecipeSheet (servings, prices, timer), Sheet
  lib/               diet.js, shopping.js, budget.js, recipe.js, api.js, persist.js
  data/              recipes.js (library), guide.js (stores, allergens, seasonal…)
tests/lib.test.js    unit tests for diet, list merging, prices, budget
```

## Run locally

```bash
npm install
npm test
npm run dev        # UI only; the library, pantry, list and budget all work without a server
```

To also run the API functions locally:

```bash
npm i -g vercel
cp .env.example .env.local   # add ANTHROPIC_API_KEY
vercel dev
```

## Deploy (Vercel)

1. Import the repo in Vercel. It detects Vite.
2. Settings → Environment Variables:

| Variable | Needed for | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | Generating recipes | From console.anthropic.com |
| `ALLOWED_ORIGIN` | Recommended | e.g. `https://your-app.vercel.app` — rejects calls from other sites |
| `ANTHROPIC_MODEL` | Optional | Defaults to `claude-opus-5-5` |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Community recipes | Or add Vercel's Redis/KV integration, which sets `KV_REST_API_URL` / `KV_REST_API_TOKEN` |
| `VITE_KOFI_URL`, `VITE_PAYPAL_URL` | Donation buttons | Hidden when empty |

3. Redeploy so the variables take effect.

Without `ANTHROPIC_API_KEY` the app still works fully from the built-in library; the generate
button shows that generation isn't available.

## Why the API proxy changed

The previous `/api/generate` forwarded whatever the browser sent — model, prompt, token limit —
to Anthropic with your key. Anyone who found the URL could use your key for anything. Now the
browser only sends preferences (meal, diet, allergies, pantry), the server builds the prompt,
picks the model, limits sizes and rate-limits per IP. The rate limit is per server instance, so
also set a monthly spend limit in the Anthropic console.

## Installing on a phone

- iPhone: Safari → Share → Add to Home Screen
- Android: Chrome → menu → Install app
