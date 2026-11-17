import { useEffect, useRef, useState } from 'react';

// Shared in-memory + localStorage cache so each dish is looked up once.
const KEY = 'kc2_photos';
let cache;
function load() {
  if (cache) return cache;
  try { cache = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { cache = {}; }
  return cache;
}
function store(k, v) {
  load()[k] = v;
  try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch { /* full */ }
}
const inflight = new Map();

function lookup(queries) {
  const k = queries.join('|');
  const hit = load()[k];
  // misses are retried after a week
  if (hit && (hit.url || Date.now() - hit.at < 7 * 864e5)) return Promise.resolve(hit);
  if (inflight.has(k)) return inflight.get(k);
  const qs = queries.map((q) => `q=${encodeURIComponent(q)}`).join('&');
  const p = fetch(`/api/photo?${qs}`)
    .then((r) => (r.ok ? r.json() : r.status === 404 ? { url: null } : Promise.reject(new Error('photo'))))
    .then((d) => { const v = { ...d, at: Date.now() }; store(k, v); return v; })
    .catch(() => ({ url: null }))
    .finally(() => inflight.delete(k));
  inflight.set(k, p);
  return p;
}

export function photoQueries(recipe) {
  return [recipe.titleJa, recipe.titleEn || recipe.title].filter(Boolean);
}

/**
 * Photo of the dish from Wikimedia Commons, falling back to the emoji.
 * Lazy: only looks up when scrolled into view.
 */
export default function DishPhoto({ recipe, className = 'art', withCredit = false, creditLabel }) {
  const ref = useRef(null);
  const [photo, setPhoto] = useState(() => load()[photoQueries(recipe).join('|')] || null);
  const [visible, setVisible] = useState(false);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return undefined;
    if (!('IntersectionObserver' in window)) { setVisible(true); return undefined; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setVisible(true); io.disconnect(); }
    }, { rootMargin: '200px' });
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!visible || photo?.url) return;
    let alive = true;
    const qs = photoQueries(recipe);
    if (qs.length) lookup(qs).then((p) => alive && setPhoto(p));
    return () => { alive = false; };
  }, [visible, recipe, photo]);

  const show = photo?.url && !broken;
  return (
    <figure className={`${className} ${show ? 'has-photo' : ''}`} ref={ref} style={{ margin: 0 }}>
      {show ? (
        <img src={photo.url} alt="" loading="lazy" decoding="async" onError={() => setBroken(true)} />
      ) : (
        <span aria-hidden="true">{recipe.emoji || '🍽️'}</span>
      )}
      {show && withCredit && (
        <figcaption>
          {creditLabel} · <a href={photo.page} target="_blank" rel="noopener noreferrer">{photo.credit}{photo.license ? `, ${photo.license}` : ''}</a>
        </figcaption>
      )}
    </figure>
  );
}
