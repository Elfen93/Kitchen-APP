// Cloudflare Worker entry. Static files (dist/) are served by Workers Static
// Assets; only /api/* reaches this code (see run_worker_first in wrangler.jsonc).
import generate from '../server/generate.js';
import community from '../server/community.js';
import photo from '../server/photo.js';

const ROUTES = { '/api/generate': generate, '/api/community': community, '/api/photo': photo };
const MAX_BODY = 64 * 1024;

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

/** Builds the small req/res pair the shared handlers expect. */
async function toReq(request, env) {
  const url = new URL(request.url);
  const query = {};
  for (const [k, v] of url.searchParams) {
    if (k in query) query[k] = [].concat(query[k], v);
    else query[k] = v;
  }
  const headers = {};
  for (const [k, v] of request.headers) headers[k.toLowerCase()] = v;
  headers.host = url.host;

  let body = {};
  if (request.method === 'POST') {
    const text = await request.text();
    if (text.length > MAX_BODY) return { tooLarge: true };
    try { body = text ? JSON.parse(text) : {}; } catch { body = {}; }
  }
  return { method: request.method, query, headers, body, env };
}

function makeRes() {
  const out = { status: 200, body: null, headers: { ...SECURITY_HEADERS } };
  const res = {
    status(code) { out.status = code; return res; },
    json(b) { out.body = b; return res; },
    setHeader(k, v) { out.headers[k] = v; },
  };
  return { res, out };
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const handler = ROUTES[pathname];
    if (!handler) return Response.json({ error: 'Not found' }, { status: 404, headers: SECURITY_HEADERS });

    const req = await toReq(request, env);
    if (req.tooLarge) return Response.json({ error: 'Request too large' }, { status: 413, headers: SECURITY_HEADERS });

    const { res, out } = makeRes();
    try {
      await handler(req, res);
    } catch (err) {
      console.error('unhandled', pathname, err);
      return Response.json({ error: 'Unexpected server error.' }, { status: 500, headers: SECURITY_HEADERS });
    }
    return Response.json(out.body ?? {}, { status: out.status, headers: out.headers });
  },
};
