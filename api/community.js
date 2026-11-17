// /api/community — shared recipes submitted by users.
//
// Storage: any Redis with an Upstash-compatible REST API (Upstash, or Vercel's
// Redis/KV integration, which sets KV_REST_API_URL / KV_REST_API_TOKEN).
// Without those variables the endpoint answers 503 and the app shows the
// feature as unavailable instead of breaking.
import { readBody, originAllowed, clientIp, rateLimited, str } from './_lib/http.js';

const URL_ = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const LIST = 'kc:recipes';
const LIKES = 'kc:likes';
const MAX_RECIPES = 500;

async function redis(commands) {
  const r = await fetch(`${URL_}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!r.ok) throw new Error(`redis ${r.status}`);
  const out = await r.json();
  return out.map((x) => {
    if (x.error) throw new Error(x.error);
    return x.result;
  });
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
  if (!URL_ || !TOKEN) return res.status(503).json({ error: 'Community recipes are not set up on this server.' });
  if (!originAllowed(req)) return res.status(403).json({ error: 'Origin not allowed' });

  try {
    if (req.method === 'GET') {
      const [ids] = await redis([['LRANGE', LIST, '0', String(MAX_RECIPES - 1)]]);
      if (!ids?.length) return res.status(200).json({ recipes: [] });
      const [raw, likes] = await redis([['MGET', ...ids.map((id) => `kc:r:${id}`)], ['HGETALL', LIKES]]);
      const likeMap = {};
      for (let i = 0; i < (likes || []).length; i += 2) likeMap[likes[i]] = Number(likes[i + 1]) || 0;
      let recipes = raw
        .map((s, i) => { try { return s ? { ...JSON.parse(s), id: ids[i], likes: likeMap[ids[i]] || 0 } : null; } catch { return null; } })
        .filter(Boolean);
      if (req.query?.sort === 'top') recipes = recipes.sort((a, b) => b.likes - a.likes);
      res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=120');
      return res.status(200).json({ recipes });
    }

    if (req.method === 'POST') {
      const body = readBody(req);
      const ip = clientIp(req);

      if (body.action === 'like') {
        const id = str(body.id, 40);
        if (!/^[a-z0-9]+$/.test(id)) return res.status(400).json({ error: 'Bad id' });
        if (rateLimited(`like:${ip}`, 60, 60 * 60 * 1000)) return res.status(429).json({ error: 'Slow down' });
        const [exists] = await redis([['EXISTS', `kc:r:${id}`]]);
        if (!exists) return res.status(404).json({ error: 'Not found' });
        const [likes] = await redis([['HINCRBY', LIKES, id, '1']]);
        return res.status(200).json({ likes });
      }

      if (body.action === 'submit') {
        if (rateLimited(`sub:${ip}`, 5, 60 * 60 * 1000)) return res.status(429).json({ error: 'Too many submissions — try again later.' });
        const recipe = cleanRecipe(body.recipe);
        if (!recipe) return res.status(400).json({ error: 'A recipe needs a title, at least one ingredient and one step.' });
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        await redis([
          ['SET', `kc:r:${id}`, JSON.stringify({ ...recipe, createdAt: Date.now() })],
          ['LPUSH', LIST, id],
          ['LTRIM', LIST, '0', String(MAX_RECIPES - 1)],
        ]);
        return res.status(201).json({ id });
      }
      return res.status(400).json({ error: 'Unknown action' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('community failed', err);
    return res.status(502).json({ error: 'Community storage is unavailable right now.' });
  }
}
