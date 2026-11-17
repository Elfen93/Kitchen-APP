// Standalone Node server (used on Render, or anywhere that runs `npm start`).
// Serves the built app from dist/ and the same handlers Vercel runs from api/.
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import generate from './api/generate.js';
import community from './api/community.js';
import photo from './api/photo.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(here, 'dist');
const app = express();

app.set('trust proxy', true);
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://upload.wikimedia.org; connect-src 'self'; manifest-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});
app.use('/api', express.json({ limit: '64kb' }));

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);
app.all('/api/generate', wrap(generate));
app.all('/api/community', wrap(community));
app.all('/api/photo', wrap(photo));
app.all('/api/*splat', (req, res) => res.status(404).json({ error: 'Not found' }));

app.use(express.static(dist, { index: false, maxAge: '1y', immutable: true, setHeaders: (res, p) => {
  if (!p.includes(`${path.sep}assets${path.sep}`)) res.setHeader('Cache-Control', 'public, max-age=300');
} }));
app.get(['/', '/*splat'], (req, res) => res.sendFile(path.join(dist, 'index.html'), { headers: { 'Cache-Control': 'no-cache' } }));

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`Kaimono Cook listening on :${port}`));
