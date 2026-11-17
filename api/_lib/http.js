// Small helpers shared by the serverless functions.

export function readBody(req) {
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  return body && typeof body === 'object' ? body : {};
}

/** Rejects cross-site calls when ALLOWED_ORIGIN is set (comma-separated list). */
export function originAllowed(req) {
  const allowed = (process.env.ALLOWED_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!allowed.length) return true;
  const origin = req.headers.origin;
  // Same-origin GETs from the browser may omit Origin; POSTs from browsers send it.
  if (!origin) return req.method === 'GET';
  return allowed.includes(origin);
}

export function clientIp(req) {
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
