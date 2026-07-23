// /api/smart-test.js — diagnóstico
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(200).json({ error: 'Sin ANTHROPIC_API_KEY' });

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 50,
        messages: [{ role: 'user', content: 'Di "OK" solamente.' }],
      }),
    });
    const text = await r.text();
    return res.status(200).json({ status: r.status, body: text.slice(0, 500) });
  } catch(e) {
    return res.status(200).json({ error: e.message });
  }
}
