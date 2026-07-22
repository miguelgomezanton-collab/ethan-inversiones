// /api/smart-money.js — Smart Money via Claude AI + web search
// Dos llamadas paralelas para no superar el timeout de Vercel

async function askClaude(prompt, apiKey) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!r.ok) throw new Error(`Claude API ${r.status}`);
  const data = await r.json();
  const text = data.content?.find(b => b.type === 'text')?.text || '{}';
  const clean = text.replace(/```json\n?|```\n?/g,'').trim();
  try { return JSON.parse(clean); }
  catch { const m = clean.match(/\{[\s\S]*\}/); return m ? JSON.parse(m[0]) : {}; }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { ticker, section } = req.query;
  if (!ticker) return res.status(400).json({ error: 'ticker requerido' });

  const T = ticker.toUpperCase();
  const key = process.env.ANTHROPIC_API_KEY;

  // El cliente puede pedir solo una sección para llamadas paralelas
  if (section === 'insiders') {
    try {
      const data = await askClaude(
        `Busca las últimas transacciones de insider trading (SEC Form 4) para ${T} en los últimos 6 meses. Responde SOLO JSON sin markdown:
{"insiders":[{"date":"YYYY-MM-DD","insider":"nombre completo","title":"cargo","type":"Compra","qty":5000,"price":"$185.50","value":"$927K"}]}
Incluye 5-8 transacciones reales. type debe ser exactamente "Compra" o "Venta".`, key);
      return res.status(200).json({ ticker: T, ...data });
    } catch(e) { return res.status(200).json({ ticker: T, insiders: [], error: e.message }); }
  }

  if (section === 'market') {
    try {
      const data = await askClaude(
        `Busca datos actuales de short interest y ownership institucional para ${T}. Responde SOLO JSON sin markdown:
{"shortInterest":{"shortFloat":0.025,"daysTocover":1.8,"shortVolume":120000000},"institutional":{"pctInsiders":0.026,"pctInstitutions":0.625,"topHolders":[{"name":"Vanguard Group","pct":0.085,"shares":1300000000,"change":0.002}]}}
shortFloat es decimal (0.025 = 2.5%). daysTocover es número decimal. Incluye top 5 institucionales reales con datos actuales.`, key);
      return res.status(200).json({ ticker: T, ...data });
    } catch(e) { return res.status(200).json({ ticker: T, shortInterest: null, institutional: null, error: e.message }); }
  }

  // Sin section — devolver estructura vacía para que el cliente llame en paralelo
  return res.status(200).json({ ticker: T, ready: true });
}
