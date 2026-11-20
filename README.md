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
- Cloudflare Workers: static assets for the app + a small Worker for `/api/*`
  (`worker/index.js`). The same handlers also run on Node via `server.js` (Express).
- Claude Haiku 5.5 via the official `@anthropic-ai/sdk`, with structured outputs (Zod schema)
- Neon Postgres (`@neondatabase/serverless`) for community recipes

```
server/
  generate.js        POST /api/generate — builds the prompt server-side, returns validated recipe JSON
  community.js       GET/POST /api/community — shared recipes (optional, Neon via DATABASE_URL)
  photo.js           GET /api/photo — dish photo + credit from Wikipedia/Wikimedia Commons
  http.js            body parsing, same-origin check, per-IP rate limit
worker/index.js      Cloudflare Worker: routes /api/* to the handlers above
wrangler.jsonc       Worker + static assets config
public/_headers      security headers (CSP) for static files
src/
  App.jsx            tabs, persisted state, recipe sheet
  views/             Cook, Pantry, List, Saved, More (budget & diet, guide, community, about)
  components/        RecipeCard, RecipeSheet (servings, prices, timer), Sheet
  lib/               diet.js, shopping.js, budget.js, recipe.js, api.js, persist.js
  data/              recipes.js (library), guide.js (stores, allergens, seasonal…)
  i18n/              ui.js (interface strings), data.es.js / data.ja.js (recipes + guide)
db/schema.sql        community table (also created automatically)
server.js            Express server (local or any Node host)
tests/lib.test.js    unit tests for diet, list merging, prices, budget
```

## Run locally

```bash
npm install
npm test
npm run dev        # UI only; the library, pantry, list and budget all work without a server
```

To run the full app locally exactly as Cloudflare runs it:

```bash
cp .dev.vars.example .dev.vars   # add ANTHROPIC_API_KEY (and DATABASE_URL for community)
npm run dev:worker               # http://localhost:8787
```

## Deploy on Cloudflare Workers + Neon

1. **Neon**: create a project (free tier) and copy its connection string. The table is created
   on first use; `db/schema.sql` has it if you prefer to run it yourself.
2. **Cloudflare** → Workers & Pages → Create → **Import a repository** → pick this repo.
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy` (default)
   - Production branch: the branch you deploy from
3. Worker → **Settings → Variables and Secrets**, add as **Secret**:
   - `ANTHROPIC_API_KEY` — from console.anthropic.com
   - `DATABASE_URL` — Neon connection string

   `ANTHROPIC_MODEL` lives in `wrangler.jsonc` (`claude-haiku-5-5`).
4. Every push to the production branch rebuilds and deploys.

The API only accepts calls from the same domain the app is served from. If you add a custom
domain and keep the `workers.dev` one too, nothing else is needed; to allow another site, set
`ALLOWED_ORIGIN` (comma-separated).

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
picks the model, limits sizes, accepts only same-origin calls and rate-limits per IP. The rate
limit is best-effort (per Worker instance), so also set a monthly spend limit in the Anthropic
console.

## Installing on a phone

- iPhone: Safari → Share → Add to Home Screen
- Android: Chrome → menu → Install app
