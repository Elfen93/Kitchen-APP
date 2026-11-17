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
- **Photos** — each dish gets a freely licensed photo from Wikipedia / Wikimedia Commons, with
  the author and licence shown. If none is found, an emoji is shown instead.
- **English, Español, 日本語** — the whole interface, the 40 library recipes and the guide.
  Generated recipes come back in the chosen language too.
- **Community** — optional shared recipes, stored in Postgres (Neon).

Everything personal (budget, pantry, list, favourites, prices) stays in the browser's
localStorage. There are no accounts and no analytics.

## Stack

- React 18 + Vite (no UI framework, one CSS file with light/dark tokens)
- API handlers in `api/`, run either by `server.js` (Express — Render or any Node host) or as
  Vercel serverless functions
- Claude Haiku 5.5 via the official `@anthropic-ai/sdk`, with structured outputs (Zod schema)
- Neon Postgres (`@neondatabase/serverless`) for community recipes

```
api/
  generate.js        POST — builds the prompt server-side, returns validated recipe JSON
  community.js       GET/POST — shared recipes (optional, Neon/Postgres via DATABASE_URL)
  photo.js           GET — dish photo + credit from Wikipedia/Wikimedia Commons
  _lib/http.js       body parsing, origin check, per-IP rate limit
src/
  App.jsx            tabs, persisted state, recipe sheet
  views/             Cook, Pantry, List, Saved, More (budget & diet, guide, community, about)
  components/        RecipeCard, RecipeSheet (servings, prices, timer), Sheet
  lib/               diet.js, shopping.js, budget.js, recipe.js, api.js, persist.js
  data/              recipes.js (library), guide.js (stores, allergens, seasonal…)
  i18n/              ui.js (interface strings), data.es.js / data.ja.js (recipes + guide)
db/schema.sql        community table (also created automatically)
server.js            Express server for Render / any Node host
render.yaml          Render Blueprint
tests/lib.test.js    unit tests for diet, list merging, prices, budget
```

## Run locally

```bash
npm install
npm test
npm run dev        # UI only; the library, pantry, list and budget all work without a server
```

To run the full app with the API locally:

```bash
cp .env.example .env.local   # add ANTHROPIC_API_KEY (and DATABASE_URL if you want community)
npm run build
node --env-file=.env.local server.js   # http://localhost:3000
```

## Deploy on Render (recommended) + Neon

1. **Neon**: create a project at neon.tech (free tier) and copy its connection string.
   The table is created on first use; `db/schema.sql` has it if you prefer to run it yourself.
2. **Render**: New → Blueprint → pick this repo. `render.yaml` creates one web service
   (`npm ci && npm run build`, then `npm start`).
3. In the service's Environment tab set:

| Variable | Needed for | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | Generating recipes | From console.anthropic.com |
| `DATABASE_URL` | Community recipes | Neon connection string |
| `ALLOWED_ORIGIN` | Recommended | e.g. `https://kaimono-cook.onrender.com` |
| `ANTHROPIC_MODEL` | Optional | Defaults to `claude-haiku-5-5` |
| `VITE_KOFI_URL`, `VITE_PAYPAL_URL` | Donation buttons | Build-time; hidden when empty |

Render's free plan sleeps after ~15 minutes without traffic, and the first visit afterwards can
take up to a minute. For a public app use the Starter plan, or serve the frontend as a Render
Static Site and keep only the API on the web service.

### Vercel instead

The same `api/` handlers also run as Vercel functions (`vercel.json` is kept). Import the repo,
set the same variables, deploy.

Without `ANTHROPIC_API_KEY` the app still works fully from the built-in library; without
`DATABASE_URL` the community page says it is not enabled.

## Moderating community posts

```sql
UPDATE community_recipes SET hidden = true WHERE id = 123;
```

## Why the API proxy changed

The previous `/api/generate` forwarded whatever the browser sent — model, prompt, token limit —
to Anthropic with your key. Anyone who found the URL could use your key for anything. Now the
browser only sends preferences (meal, diet, allergies, pantry), the server builds the prompt,
picks the model, limits sizes and rate-limits per IP. The rate limit is per server instance, so
also set a monthly spend limit in the Anthropic console.

## Installing on a phone

- iPhone: Safari → Share → Add to Home Screen
- Android: Chrome → menu → Install app
