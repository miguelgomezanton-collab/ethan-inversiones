// /api/register-ticker.js
// Registra un ticker en tracked_assets y dispara el backfill.
// POST { ticker: "AAPL" }
// Llamado desde el frontend cuando el usuario añade una posición nueva.

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { ticker } = req.body || {};
  if (!ticker) return res.status(400).json({ error: 'ticker requerido' });

  // Llamar al backfill con el secreto interno
  const secret = process.env.CRON_SECRET;
  const host = req.headers.host || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';

  try {
    const r = await fetch(`${protocol}://${host}/api/backfill-ticker`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secret}`,
      },
      body: JSON.stringify({ ticker }),
    });
    const data = await r.json();
    return res.status(r.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
