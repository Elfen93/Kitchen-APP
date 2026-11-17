// Browser-side calls to our own serverless functions. No API keys here.
import { isAllowed } from './diet.js';

async function post(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  let data = null;
  try { data = await res.json(); } catch { /* non-JSON */ }
  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

/**
 * Ask the server for fresh recipes. Results are checked again on the device
 * against the user's diet and allergies; anything that conflicts is dropped,
 * because an allergy filter must not depend on the model getting it right.
 */
export async function generateRecipes(params) {
  const data = await post('/api/generate', params);
  const stamp = Date.now().toString(36);
  const recipes = (data.recipes || []).map((r, i) => ({
    ...r,
    id: `ai-${stamp}-${i}`,
    source: 'ai',
    emoji: r.emoji || '🍽️',
  }));
  const safe = recipes.filter((r) => isAllowed(r, params.diet, params.allergies));
  return { recipes: safe, dropped: recipes.length - safe.length };
}

export async function fetchCommunity(sort) {
  const res = await fetch(`/api/community?sort=${encodeURIComponent(sort)}`);
  const data = await res.json().catch(() => ({}));
  if (res.status === 503) return { disabled: true, recipes: [] };
  if (!res.ok) throw new Error(data.error || 'Could not load community recipes');
  return { disabled: false, recipes: data.recipes || [] };
}

export const submitCommunity = (recipe) => post('/api/community', { action: 'submit', recipe });
export const likeCommunity = (id) => post('/api/community', { action: 'like', id });
