// api/generate.js  — Vercel serverless function
// This runs on the SERVER. The API key never reaches the browser.

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS — allow your domain in production, localhost in dev
  const allowed = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.ALLOWED_ORIGIN, // set this in Vercel dashboard
  ].filter(Boolean);

  const origin = req.headers.origin || '';
  if (allowed.includes(origin) || process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  try {
    const body = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':         'application/json',
        'x-api-key':            ANTHROPIC_API_KEY,
        'anthropic-version':    '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: err.message });
  }
}
