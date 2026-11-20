// Helpers shared by the API handlers. Handlers take (req, res) where
//   req = { method, query, headers (lower-case keys), body, env }
//   res = { status(code), json(body), setHeader(name, value) }
// worker/index.js (Cloudflare) and server.js (Node) build these objects.

export function readBody(req) {
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  return body && typeof body === 'object' ? body : {};
}

/**
 * Only the app's own pages may call the API. Browsers send Origin on POST;
 * it must match the host the request was sent to, or one listed in
 * ALLOWED_ORIGIN (comma-separated) for extra domains.
 */
export function originAllowed(req) {
  const origin = req.headers.origin;
  if (!origin) return req.method === 'GET';
  const extra = (req.env?.ALLOWED_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (extra.includes(origin)) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

export function clientIp(req) {
  if (req.headers['cf-connecting-ip']) return req.headers['cf-connecting-ip'];
  const fwd = req.headers['x-forwarded-for'];
  return (Array.isArray(fwd) ? fwd[0] : (fwd || '')).split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
}

const buckets = new Map();
/**
 * Best-effort fixed-window rate limit, per server instance.
 * It stops casual abuse of the API key; it is not a hard global limit.
 */
export function rateLimited(key, limit, windowMs) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now - b.start > windowMs) {
    buckets.set(key, { start: now, count: 1 });
    if (buckets.size > 5000) buckets.clear();
    return false;
  }
  b.count += 1;
  return b.count > limit;
}

export const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
