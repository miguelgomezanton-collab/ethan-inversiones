// /api/smart-money.js — Smart Money via Claude AI + web search

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
      max_tokens: 1500,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!r.ok) throw new Error(`Claude API ${r.status}: ${await r.text()}`);
  const data = await r.json();
  const text = data.content?.find(b => b.type === 'text')?.text || '{}';
  const clean = text.replace(/```json\n?|```\n?/g,'').trim();
  try { return JSON.parse(clean); }
  catch {
    const m = clean.match(/\{[\s\S]*\}/);
    if (m) try { return JSON.parse(m[0]); } catch {}
    return {};
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { ticker, section } = req.query;
  if (!ticker) return res.status(400).json({ error: 'ticker requerido' });

  const T = ticker.toUpperCase();
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: 'ANTHROPIC_API_KEY no configurada' });

  try {
    if (section === 'insiders') {
      const data = await askClaude(
        `Busca en SEC EDGAR Form 4 las últimas transacciones de insider trading para ${T} en los últimos 6 meses.
Responde SOLO JSON sin markdown ni texto extra:
{"insiders":[{"date":"YYYY-MM-DD","insider":"nombre","title":"cargo","type":"Compra","qty":5000,"price":"$185.50","value":"$927K"}]}
type debe ser exactamente "Compra" o "Venta". Incluye 5-8 transacciones reales.`, key);
      return res.status(200).json({ ticker: T, insiders: data.insiders || [] });
    }

    if (section === 'market') {
      const data = await askClaude(
        `Busca datos actuales de short interest y ownership institucional para ${T}.
Responde SOLO JSON sin markdown ni texto extra:
{"shortInterest":{"shortFloat":0.025,"daysTocover":1.8,"shortVolume":120000000},"institutional":{"pctInsiders":0.026,"pctInstitutions":0.625,"topHolders":[{"name":"Vanguard","pct":0.085,"shares":1300000000,"change":0.002}]}}
shortFloat decimal (0.025=2.5%), daysTocover número. Top 5 institucionales reales.`, key);
      return res.status(200).json({ ticker: T, shortInterest: data.shortInterest || null, institutional: data.institutional || null });
    }

    return res.status(200).json({ ticker: T, ready: true });
  } catch(e) {
    return res.status(200).json({ ticker: T, error: e.message, insiders: [], shortInterest: null, institutional: null });
  }
}
