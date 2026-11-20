// /api/community — shared recipes submitted by users.
//
// Storage: Postgres via Neon's serverless driver (env DATABASE_URL). Without it
// the endpoint answers 503 and the app shows the feature as unavailable.
// Schema: db/schema.sql (also created automatically on first request).
// Moderation: UPDATE community_recipes SET hidden = true WHERE id = …;
import { neon } from '@neondatabase/serverless';
import { readBody, originAllowed, clientIp, rateLimited, str } from './http.js';

const PAGE = 200;

let sql = null;
let sqlUrl = null;
function db(env) {
  const url = env?.DATABASE_URL;
  if (!url) return null;
  if (url !== sqlUrl) { sql = neon(url); sqlUrl = url; ready = undefined; }
  return sql;
}

let ready;
function ensureSchema() {
  ready ??= (async () => {
    await sql`CREATE TABLE IF NOT EXISTS community_recipes (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      recipe JSONB NOT NULL,
      likes INTEGER NOT NULL DEFAULT 0,
      hidden BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
  })().catch((e) => { ready = undefined; throw e; });
  return ready;
}

const num = (v, min, max, d) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : d;
};

function cleanRecipe(r) {
  if (!r || typeof r !== 'object') return null;
  const title = str(r.title, 80);
  const ingredients = (Array.isArray(r.ingredients) ? r.ingredients : []).slice(0, 25).map((i) => ({
    en: str(i?.en, 60),
    ja: str(i?.ja, 40),
    amount: num(i?.amount, 0, 10000, 0),
    unit: ['g', 'ml', 'unit', 'pack'].includes(i?.unit) ? i.unit : 'g',
    price: Math.round(num(i?.price, 0, 20000, 0)),
  })).filter((i) => i.en);
  const steps = (Array.isArray(r.steps) ? r.steps : []).map((s) => str(s, 400)).filter(Boolean).slice(0, 15);
  if (!title || ingredients.length < 1 || steps.length < 1) return null;
  return {
    title,
    titleJa: str(r.titleJa, 60),
    author: str(r.author, 40) || 'Anonymous',
    emoji: str(r.emoji, 8) || '🍽️',
    mealType: ['breakfast', 'lunch', 'dinner', 'snack'].includes(r.mealType) ? r.mealType : 'dinner',
    difficulty: ['Easiest', 'Easy', 'Intermediate'].includes(r.difficulty) ? r.difficulty : 'Easy',
    prepTime: Math.round(num(r.prepTime, 0, 600, 10)),
    cookTime: Math.round(num(r.cookTime, 0, 600, 15)),
    servings: Math.round(num(r.servings, 1, 12, 2)),
    tip: str(r.tip, 300),
    equipment: [],
    ingredients,
    steps,
  };
}

export default async function handler(req, res) {
  if (!db(req.env)) return res.status(503).json({ error: 'Community recipes are not set up on this server.' });
  if (!originAllowed(req)) return res.status(403).json({ error: 'Origin not allowed' });

  try {
    await ensureSchema();

    if (req.method === 'GET') {
      const rows = req.query?.sort === 'top'
        ? await sql`SELECT id, recipe, likes, created_at FROM community_recipes WHERE NOT hidden ORDER BY likes DESC, created_at DESC LIMIT ${PAGE}`
        : await sql`SELECT id, recipe, likes, created_at FROM community_recipes WHERE NOT hidden ORDER BY created_at DESC LIMIT ${PAGE}`;
      res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=120');
      return res.status(200).json({
        recipes: rows.map((r) => ({ ...r.recipe, id: String(r.id), likes: r.likes, createdAt: r.created_at })),
      });
    }

    if (req.method === 'POST') {
      const body = readBody(req);
      const ip = clientIp(req);

      if (body.action === 'like') {
        const id = str(String(body.id ?? ''), 20);
        if (!/^\d+$/.test(id)) return res.status(400).json({ error: 'Bad id' });
        if (rateLimited(`like:${ip}`, 60, 60 * 60 * 1000)) return res.status(429).json({ error: 'Slow down' });
        const rows = await sql`UPDATE community_recipes SET likes = likes + 1 WHERE id = ${id} AND NOT hidden RETURNING likes`;
        if (!rows.length) return res.status(404).json({ error: 'Not found' });
        return res.status(200).json({ likes: rows[0].likes });
      }

      if (body.action === 'submit') {
        if (rateLimited(`sub:${ip}`, 5, 60 * 60 * 1000)) return res.status(429).json({ error: 'Too many submissions — try again later.' });
        const recipe = cleanRecipe(body.recipe);
        if (!recipe) return res.status(400).json({ error: 'A recipe needs a title, at least one ingredient and one step.' });
        const rows = await sql`INSERT INTO community_recipes (recipe) VALUES (${JSON.stringify(recipe)}::jsonb) RETURNING id`;
        return res.status(201).json({ id: String(rows[0].id) });
      }
      return res.status(400).json({ error: 'Unknown action' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('community failed', err);
    return res.status(502).json({ error: 'Community storage is unavailable right now.' });
  }
}
