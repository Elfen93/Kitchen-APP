// GET /api/photo?q=親子丼&q=Oyakodon — finds a freely licensed photo of a dish.
//
// Searches Japanese, then English Wikipedia, for the dish and takes the
// article's lead image, keeping it only if it lives on Wikimedia Commons
// (free licence) so the credit and licence can be shown. Results are cached
// at the CDN for a week; misses are cached for a day.
import { str } from './_lib/http.js';

const UA = 'KaimonoCook/2.0 (budget recipe app; https://github.com/)';
const WIDTH = 640;

async function getJson(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  if (!r.ok) throw new Error(`${new URL(url).host} ${r.status}`);
  return r.json();
}

async function leadImage(lang, query) {
  const u = new URL(`https://${lang}.wikipedia.org/w/api.php`);
  Object.entries({
    action: 'query', format: 'json', formatversion: '2', redirects: '1',
    generator: 'search', gsrsearch: query, gsrlimit: '3', gsrnamespace: '0',
    prop: 'pageimages', piprop: 'name', pilicense: 'free',
  }).forEach(([k, v]) => u.searchParams.set(k, v));
  const data = await getJson(u);
  const pages = (data.query?.pages || []).sort((a, b) => a.index - b.index);
  const hit = pages.find((p) => p.pageimage);
  return hit ? { file: hit.pageimage, title: hit.title, lang } : null;
}

const stripHtml = (s) => (s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

async function commonsInfo(file) {
  const u = new URL('https://commons.wikimedia.org/w/api.php');
  Object.entries({
    action: 'query', format: 'json', formatversion: '2', titles: `File:${file}`,
    prop: 'imageinfo', iiprop: 'url|extmetadata', iiurlwidth: String(WIDTH),
  }).forEach(([k, v]) => u.searchParams.set(k, v));
  const data = await getJson(u);
  const page = data.query?.pages?.[0];
  const info = page?.imageinfo?.[0];
  if (!info || page.missing) return null; // not on Commons → licence unknown, skip
  const m = info.extmetadata || {};
  return {
    url: info.thumburl || info.url,
    credit: stripHtml(m.Artist?.value).slice(0, 80) || 'Wikimedia Commons',
    license: stripHtml(m.LicenseShortName?.value).slice(0, 40),
    page: info.descriptionurl,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const raw = req.query?.q;
  const queries = (Array.isArray(raw) ? raw : [raw]).map((q) => str(q, 80)).filter(Boolean).slice(0, 3);
  if (!queries.length) return res.status(400).json({ error: 'Missing q' });

  try {
    for (const q of queries) {
      const lang = /[぀-ヿ一-龯]/.test(q) ? 'ja' : 'en';
      const lead = await leadImage(lang, q);
      if (!lead) continue;
      const info = await commonsInfo(lead.file);
      if (!info) continue;
      res.setHeader('Cache-Control', 'public, s-maxage=604800, stale-while-revalidate=86400');
      return res.status(200).json({ ...info, article: lead.title });
    }
    res.setHeader('Cache-Control', 'public, s-maxage=86400');
    return res.status(404).json({ error: 'No photo found' });
  } catch (err) {
    console.error('photo lookup failed', err.message);
    return res.status(502).json({ error: 'Photo service unavailable' });
  }
}
